import { Project } from '../../models/Project';
import { cacheGet, cacheSet, cacheDelete } from '../../config/redis';
import { logger } from '../../utils/logger';
import {
  handleError,
  NotFoundError,
  checkRateLimit,
  getPagination,
  buildConnection,
} from '../utils/errors';
import { Context } from '../utils/auth';
import {
  validateInput,
  validatePartialInput,
  PaginationSchema,
  ProjectFilterSchema,
  SearchQuerySchema,
} from '../utils/validation';

/**
 * Cache TTL Constants (in seconds)
 */
const CACHE_TTL = {
  PROJECT_LIST: 300, // 5 minutes
  PROJECT_SINGLE: 600, // 10 minutes
  SEARCH_RESULTS: 600, // 10 minutes
  FEATURED: 300, // 5 minutes
  TRENDING: 180, // 3 minutes
  CATEGORIES: 900, // 15 minutes
};

/**
 * Cache Key Generators
 */
const cacheKeys = {
  projectList: (filter: any, page: number, limit: number) =>
    `projects:list:${JSON.stringify(filter)}:p${page}:l${limit}`,
  projectBySlug: (slug: string) => `project:slug:${slug}`,
  projectById: (id: string) => `project:id:${id}`,
  searchResults: (query: string, page: number, limit: number) =>
    `projects:search:${query}:p${page}:l${limit}`,
  featuredProjects: (limit: number) => `projects:featured:${limit}`,
  trendingProjects: (limit: number) => `projects:trending:${limit}`,
  projectsByCategory: (category: string, page: number, limit: number) =>
    `projects:category:${category}:p${page}:l${limit}`,
};

export const projectResolvers = {
  Query: {
    /**
     * Get all projects with filtering, sorting, and pagination
     * Implements cursor-based pagination and Redis caching
     */
    projects: async (_: any, { filter, sort, pagination }: any, context: Context) => {
      try {
        // Validate inputs
        const validatedFilter = validatePartialInput(ProjectFilterSchema, filter);
        const validatedPagination = validateInput(PaginationSchema, pagination || {});

        const { page, limit } = validatedPagination;
        const cacheKey = cacheKeys.projectList(validatedFilter, page, limit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Build query
        const query: any = {};

        if (validatedFilter.category) {
          query.category = validatedFilter.category;
        }

        if (validatedFilter.status) {
          query.status = validatedFilter.status;
        }

        if (validatedFilter.featured !== undefined) {
          query.featured = validatedFilter.featured;
        }

        if (validatedFilter.technologies?.length) {
          query.technologies = { $all: validatedFilter.technologies };
        }

        if (validatedFilter.minStars !== undefined) {
          query['metrics.stars'] = { $gte: validatedFilter.minStars };
        }

        // Date range filtering
        if (validatedFilter.startDate || validatedFilter.endDate) {
          query.createdAt = {};
          if (validatedFilter.startDate) {
            query.createdAt.$gte = new Date(validatedFilter.startDate);
          }
          if (validatedFilter.endDate) {
            query.createdAt.$lte = new Date(validatedFilter.endDate);
          }
        }

        // Build sort
        let sortObj: any = { createdAt: -1 }; // Default sort
        if (sort) {
          const sortOrder = sort.order === 'ASC' ? 1 : -1;
          switch (sort.field) {
            case 'CREATED_AT':
              sortObj = { createdAt: sortOrder };
              break;
            case 'UPDATED_AT':
              sortObj = { updatedAt: sortOrder };
              break;
            case 'TITLE':
              sortObj = { title: sortOrder };
              break;
            case 'STARS':
              sortObj = { 'metrics.stars': sortOrder };
              break;
            case 'VIEWS':
              sortObj = { 'metrics.views': sortOrder };
              break;
          }
        }

        // Execute query with pagination
        const { skip, limit: pageLimit } = getPagination(page, limit);
        const queryStart = Date.now();

        // Select only fields needed by ProjectFields fragment
        const projection = {
          title: 1,
          slug: 1,
          description: 1,
          category: 1,
          status: 1,
          featured: 1,
          technologies: 1,
          images: 1,
          links: 1,
          metrics: 1,
          timeline: 1,
          views: 1,
          clicks: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1,
        };

        const [projects, totalCount] = await Promise.all([
          Project.find(query, projection).sort(sortObj).skip(skip).limit(pageLimit).lean(),
          // Use estimatedDocumentCount when no filters (reads metadata, O(1))
          Object.keys(query).length === 0
            ? Project.estimatedDocumentCount()
            : Project.countDocuments(query),
        ]);

        logger.debug(
          `Projects query: ${Date.now() - queryStart}ms (${totalCount} total, page ${page})`
        );

        // Build connection response
        const result = buildConnection(projects, totalCount, page, pageLimit);

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.PROJECT_LIST);
        logger.debug(`Cache set: ${cacheKey}`);

        return result;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get single project by slug (SEO-friendly)
     * Uses DataLoader for batching
     */
    project: async (_: any, { slug }: { slug: string }, context: Context) => {
      try {
        const cacheKey = cacheKeys.projectBySlug(slug);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Use DataLoader for batched loading
        const project = await context.loaders.projectBySlugLoader.load(slug);

        if (!project) {
          throw new NotFoundError('Project', slug);
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(project), CACHE_TTL.PROJECT_SINGLE);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get project by ID
     * Uses DataLoader for batching
     */
    projectById: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        const cacheKey = cacheKeys.projectById(id);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Use DataLoader
        const project = await context.loaders.projectLoader.load(id);

        if (!project) {
          throw new NotFoundError('Project', id);
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(project), CACHE_TTL.PROJECT_SINGLE);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Full-text search for projects
     * Implements caching for search results
     */
    searchProjects: async (
      _: any,
      { query, pagination }: { query: string; pagination?: any },
      _context: Context
    ) => {
      try {
        // Validate inputs
        const { query: searchQuery } = validateInput(SearchQuerySchema, { query });
        const validatedPagination = validateInput(PaginationSchema, pagination || {});

        const { page, limit } = validatedPagination;
        const normalizedQuery = searchQuery.toLowerCase().trim();
        const cacheKey = cacheKeys.searchResults(normalizedQuery, page, limit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Search cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Use MongoDB text search with proper pagination
        const { skip, limit: pageLimit } = getPagination(page, limit);
        const textQuery = { $text: { $search: searchQuery } };

        const [searchResults, totalCount] = await Promise.all([
          Project.find(textQuery, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(pageLimit)
            .lean(),
          Project.countDocuments(textQuery),
        ]);

        const result = buildConnection(searchResults, totalCount, page, pageLimit);

        // Cache for shorter duration (search results change more frequently)
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.SEARCH_RESULTS);

        logger.info(`Search executed: "${searchQuery}" - ${totalCount} results`);

        return result;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get featured projects for homepage
     */
    featuredProjects: async (_: any, { limit = 6 }: { limit?: number }) => {
      try {
        const safeLimit = Math.min(Math.max(limit, 1), 20);
        const cacheKey = cacheKeys.featuredProjects(safeLimit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const projects = await Project.find(
          { featured: true, status: 'COMPLETED' },
          {
            title: 1,
            slug: 1,
            description: 1,
            category: 1,
            status: 1,
            featured: 1,
            technologies: 1,
            images: 1,
            links: 1,
            metrics: 1,
            views: 1,
            createdAt: 1,
          }
        )
          .sort({ 'metrics.stars': -1, createdAt: -1 })
          .limit(safeLimit)
          .lean();

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(projects), CACHE_TTL.FEATURED);

        return projects;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get trending projects based on recent activity
     */
    trendingProjects: async (_: any, { limit = 6 }: { limit?: number }) => {
      try {
        const safeLimit = Math.min(Math.max(limit, 1), 20);
        const cacheKey = cacheKeys.trendingProjects(safeLimit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Use static method for trending calculation
        const projects = await (Project as any).findTrending(safeLimit);

        // Cache result (shorter TTL for trending)
        await cacheSet(cacheKey, JSON.stringify(projects), CACHE_TTL.TRENDING);

        return projects;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get projects by category with pagination
     */
    projectsByCategory: async (
      _: any,
      { category, pagination }: { category: string; pagination?: any }
    ) => {
      try {
        const validatedPagination = validateInput(PaginationSchema, pagination || {});
        const { page, limit } = validatedPagination;
        const cacheKey = cacheKeys.projectsByCategory(category, page, limit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const { skip, limit: pageLimit } = getPagination(page, limit);

        const categoryQuery = { category, status: 'COMPLETED' };
        const projection = {
          title: 1,
          slug: 1,
          description: 1,
          category: 1,
          status: 1,
          featured: 1,
          technologies: 1,
          images: 1,
          links: 1,
          metrics: 1,
          timeline: 1,
          views: 1,
          clicks: 1,
          features: 1,
          createdAt: 1,
          updatedAt: 1,
        };

        const [projects, totalCount] = await Promise.all([
          Project.find(categoryQuery, projection)
            .sort({ 'metrics.stars': -1, createdAt: -1 })
            .skip(skip)
            .limit(pageLimit)
            .lean(),
          Project.countDocuments(categoryQuery),
        ]);

        const result = buildConnection(projects, totalCount, page, pageLimit);

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.PROJECT_LIST);

        return result;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Create a new project (ADMIN ONLY)
     */
    createProject: async (_: any, { input }: any, context: Context) => {
      try {
        // Rate limit: 10 creates per hour
        checkRateLimit(context.ip || 'unknown', 'create_project', 10, 3600000);

        const project = new Project(input);
        await project.save();

        // Invalidate related caches
        await Promise.all([
          cacheDelete(cacheKeys.featuredProjects(6)),
          cacheDelete(cacheKeys.trendingProjects(6)),
        ]);

        logger.info(`Project created: ${project.title} (${project.slug})`);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Update an existing project (ADMIN ONLY)
     */
    updateProject: async (_: any, { id, input }: any, context: Context) => {
      try {
        // Rate limit: 20 updates per hour
        checkRateLimit(context.ip || 'unknown', 'update_project', 20, 3600000);

        const project = await Project.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );

        if (!project) {
          throw new NotFoundError('Project', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.projectById(id)),
          cacheDelete(cacheKeys.projectBySlug(project.slug || '')),
          cacheDelete(cacheKeys.featuredProjects(6)),
        ]);

        logger.info(`Project updated: ${project.title}`);

        return project;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Delete a project (ADMIN ONLY)
     */
    deleteProject: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        const project = await Project.findById(id);

        if (!project) {
          throw new NotFoundError('Project', id);
        }

        await Project.findByIdAndDelete(id);

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.projectById(id)),
          cacheDelete(cacheKeys.projectBySlug(project.slug || '')),
          cacheDelete(cacheKeys.featuredProjects(6)),
        ]);

        logger.info(`Project deleted: ${project.title}`);

        return {
          success: true,
          message: 'Project deleted successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },
  },

  /**
   * Field resolvers for Project type
   */
  Project: {
    /**
     * Map MongoDB _id to GraphQL id field
     */
    id: (parent: any) => parent._id?.toString() || parent.id,

    /**
     * Resolve isRecent computed field
     */
    isRecent: (parent: any) => {
      if (typeof parent.isRecent === 'boolean') return parent.isRecent;
      if (typeof parent.isRecent === 'function') return parent.isRecent();
      if (!parent.createdAt) return false;
      const createdAt = new Date(parent.createdAt).getTime();
      const thirtyDays = 1000 * 60 * 60 * 24 * 30;
      return Date.now() - createdAt <= thirtyDays;
    },

    /**
     * Ensure links object exists
     */
    links: (parent: any) => parent.links || {},

    /**
     * Ensure images object exists and screenshots is always an array
     */
    images: (parent: any) => ({
      ...parent.images,
      screenshots: parent.images?.screenshots || [],
    }),

    /**
     * Ensure metrics object exists
     */
    metrics: (parent: any) => parent.metrics || {},

    /**
     * Ensure timeline object exists
     */
    timeline: (parent: any) =>
      parent.timeline || { startDate: null, endDate: null, duration: null },

    /**
     * Ensure clicks object exists
     */
    clicks: (parent: any) => parent.clicks || { github: 0, live: 0, demo: 0 },

    architecture: (parent: any) => parent.architecture || null,

    /**
     * Resolve related skills using DataLoader
     */
    relatedSkills: async (parent: any, _: any, context: Context) => {
      if (!parent.technologies?.length) return [];

      try {
        // Load all skills by name using DataLoader (batched)
        const skills = await Promise.all(
          parent.technologies.map((tech: string) => context.loaders.skillByNameLoader.load(tech))
        );

        return skills.filter(Boolean);
      } catch (error) {
        logger.error('Error loading related skills:', error);
        return [];
      }
    },

    /**
     * Calculate popularity score virtual
     */
    popularityScore: (parent: any) => {
      const metrics = parent.metrics || {};
      return (
        (metrics.stars || 0) * 10 +
        (metrics.forks || 0) * 5 +
        (metrics.views || 0) * 0.1 +
        (metrics.downloads || 0) * 2
      );
    },
  },
};
