import { Project } from "../../models/Project";
import { cacheGet, cacheSet, cacheDelete } from "../../config/redis";
import {
  handleError,
  NotFoundError,
  ValidationError,
  buildConnection,
  getPagination,
} from "../utils/errors";
import { requireRole } from "../utils/auth";
import { logger } from "../../utils/logger";

/**
 * Enhanced Project Resolvers with DataLoader, Caching, Error Handling
 */

export const projectResolvers = {
  Query: {
    /**
     * Get all projects with filters, sorting, and pagination
     */
    projects: async (
      _: any,
      { filter, sort, pagination }: any,
      context: any,
    ) => {
      try {
        const { page = 1, limit = 10 } = pagination || {};
        const { skip, limit: validLimit } = getPagination(page, limit);

        // Build query
        const query: any = {};

        if (filter?.category) {
          query.category = filter.category;
        }

        if (filter?.status) {
          query.status = filter.status;
        }

        if (filter?.featured !== undefined) {
          query.featured = filter.featured;
        }

        if (filter?.searchTerm) {
          query.$text = { $search: filter.searchTerm };
        }

        if (filter?.technologies?.length > 0) {
          query.technologies = { $in: filter.technologies };
        }

        if (filter?.minViews) {
          query.views = { $gte: filter.minViews };
        }

        // Build sort
        const sortField = sort?.field || "CREATED_AT";
        const sortOrder = sort?.order === "ASC" ? 1 : -1;

        const sortMap: any = {
          TITLE: { title: sortOrder },
          CREATED_AT: { createdAt: sortOrder },
          VIEWS: { views: sortOrder },
          CLICKS: { "clicks.github": sortOrder }, // Sort by total would need aggregation
        };

        const sortQuery = sortMap[sortField] || { createdAt: -1 };

        // Execute query with pagination
        const [projects, totalCount] = await Promise.all([
          Project.find(query)
            .sort(sortQuery)
            .skip(skip)
            .limit(validLimit)
            .lean(),
          Project.countDocuments(query),
        ]);

        return buildConnection(projects, totalCount, page, validLimit);
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get single project by slug (SEO-friendly)
     * Uses DataLoader and Redis caching
     */
    project: async (_: any, { slug }: any, context: any) => {
      try {
        // Try cache first
        const cacheKey = `project:slug:${slug}`;
        const cached = await cacheGet(cacheKey);

        if (cached) {
          logger.info(`Cache HIT for project slug: ${slug}`);
          return JSON.parse(cached);
        }

        logger.info(`Cache MISS for project slug: ${slug}`);

        // Use DataLoader
        const project = await context.loaders.projectBySlugLoader.load(slug);

        if (!project) {
          throw new NotFoundError("Project", slug);
        }

        // Cache for 1 hour
        await cacheSet(cacheKey, JSON.stringify(project), 3600);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get single project by ID
     */
    projectById: async (_: any, { id }: any, context: any) => {
      try {
        // Use DataLoader to batch and cache
        const project = await context.loaders.projectLoader.load(id);

        if (!project) {
          throw new NotFoundError("Project", id);
        }

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Full-text search projects
     */
    searchProjects: async (_: any, { query, pagination }: any) => {
      try {
        const { page = 1, limit = 10 } = pagination || {};
        const { skip, limit: validLimit } = getPagination(page, limit);

        // Text search with MongoDB text index
        const [projects, totalCount] = await Promise.all([
          Project.find({ $text: { $search: query } })
            .sort({ score: { $meta: "textScore" } }) // Sort by relevance
            .skip(skip)
            .limit(validLimit)
            .lean(),
          Project.countDocuments({ $text: { $search: query } }),
        ]);

        return buildConnection(projects, totalCount, page, validLimit);
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get featured projects
     */
    featuredProjects: async (_: any, { limit = 6 }: any) => {
      try {
        // Try cache first
        const cacheKey = `projects:featured:${limit}`;
        const cached = await cacheGet(cacheKey);

        if (cached) {
          return JSON.parse(cached);
        }

        const projects = await Project.find({
          featured: true,
          status: "COMPLETED",
        })
          .sort({ views: -1, createdAt: -1 })
          .limit(limit)
          .lean();

        // Cache for 1 hour
        await cacheSet(cacheKey, JSON.stringify(projects), 3600);

        return projects;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get trending projects (recent + high views)
     */
    trendingProjects: async (_: any, { limit = 6 }: any) => {
      try {
        const projects = await (Project as any).findTrending(limit);
        return projects;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get projects by category with pagination
     */
    projectsByCategory: async (_: any, { category, pagination }: any) => {
      try {
        const { page = 1, limit = 10 } = pagination || {};
        const { skip, limit: validLimit } = getPagination(page, limit);

        const [projects, totalCount] = await Promise.all([
          Project.find({ category, status: "COMPLETED" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(validLimit)
            .lean(),
          Project.countDocuments({ category, status: "COMPLETED" }),
        ]);

        return buildConnection(projects, totalCount, page, validLimit);
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Create new project (ADMIN ONLY)
     */
    createProject: async (_: any, { input }: any, context: any) => {
      try {
        // Check authentication and authorization
        requireRole(context, "ADMIN");

        const project = new Project(input);
        await project.save();

        // Invalidate relevant caches
        await cacheDelete("projects:*");
        await cacheDelete("stats:*");

        logger.info(`Project created: ${project.title} by admin`);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Update existing project (ADMIN ONLY)
     */
    updateProject: async (_: any, { id, input }: any, context: any) => {
      try {
        requireRole(context, "ADMIN");

        const project = await Project.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true },
        );

        if (!project) {
          throw new NotFoundError("Project", id);
        }

        // Invalidate caches
        await cacheDelete(`project:${id}:*`);
        await cacheDelete(`project:slug:${project.slug}`);
        await cacheDelete("projects:*");

        logger.info(`Project updated: ${project.title}`);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Delete project (ADMIN ONLY)
     */
    deleteProject: async (_: any, { id }: any, context: any) => {
      try {
        requireRole(context, "ADMIN");

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
          throw new NotFoundError("Project", id);
        }

        // Invalidate caches
        await cacheDelete(`project:*`);
        await cacheDelete("projects:*");
        await cacheDelete("stats:*");

        logger.info(`Project deleted: ${project.title}`);

        return {
          success: true,
          message: "Project deleted successfully",
        };
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Track project click
     */
    trackClick: async (_: any, { input }: any, context: any) => {
      try {
        const { projectId, clickType } = input;

        const project = await Project.findById(projectId);

        if (!project) {
          throw new NotFoundError("Project", projectId);
        }

        // Increment click count
        await project.incrementClick(clickType as "github" | "live" | "demo");

        logger.info(`Click tracked: ${clickType} for project ${project.title}`);

        return {
          success: true,
          message: "Click tracked successfully",
        };
      } catch (error) {
        handleError(error);
      }
    },
  },

  // Field resolvers for computed properties
  Project: {
    /**
     * Resolve durationFormatted virtual
     */
    durationFormatted: (parent: any) => {
      // Virtual is already populated by Mongoose
      return parent.durationFormatted || "N/A";
    },

    /**
     * Resolve isRecent
     */
    isRecent: (parent: any) => {
      if (typeof parent.isRecent === "function") {
        return parent.isRecent();
      }

      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return new Date(parent.createdAt) > sixMonthsAgo;
    },
  },
};

/**
 * Usage Example in Apollo Server:
 *
 * const server = new ApolloServer({
 *   typeDefs,
 *   resolvers: [projectResolvers, skillResolvers, ...],
 *   context: ({ req }) => buildContext({ req }, createLoaders()),
 * });
 *
 * Query Examples:
 *
 * # Get paginated projects
 * query {
 *   projects(
 *     filter: { category: FRONTEND, featured: true }
 *     sort: { field: VIEWS, order: DESC }
 *     pagination: { page: 1, limit: 10 }
 *   ) {
 *     edges {
 *       node {
 *         id
 *         title
 *         slug
 *         views
 *       }
 *     }
 *     pageInfo {
 *       hasNextPage
 *       currentPage
 *       totalPages
 *     }
 *     totalCount
 *   }
 * }
 *
 * # Get project by slug
 * query {
 *   project(slug: "ecommerce-platform") {
 *     title
 *     description
 *     durationFormatted
 *     isRecent
 *   }
 * }
 *
 * # Search projects
 * query {
 *   searchProjects(query: "React GraphQL", pagination: { limit: 5 }) {
 *     edges {
 *       node { title }
 *     }
 *   }
 * }
 *
 * # Admin: Create project
 * mutation {
 *   createProject(input: {
 *     title: "New Project"
 *     description: "Description"
 *     category: FULLSTACK
 *     technologies: ["React", "Node.js"]
 *     status: IN_PROGRESS
 *   }) {
 *     id
 *     title
 *   }
 * }
 */
