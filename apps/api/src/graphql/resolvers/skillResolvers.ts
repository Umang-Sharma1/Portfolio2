import { Skill } from '../../models/Skill';
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
  SkillFilterSchema,
  SearchQuerySchema,
} from '../utils/validation';

/**
 * Cache TTL Constants (in seconds)
 */
const CACHE_TTL = {
  SKILL_LIST: 600, // 10 minutes
  SKILL_SINGLE: 900, // 15 minutes
  SEARCH_RESULTS: 600, // 10 minutes
  CATEGORIES: 1800, // 30 minutes
  TOP_SKILLS: 600, // 10 minutes
  TRENDING: 300, // 5 minutes
};

/**
 * Cache Key Generators
 */
const cacheKeys = {
  skillList: (filter: any, page: number, limit: number) =>
    `skills:list:${JSON.stringify(filter)}:p${page}:l${limit}`,
  skillById: (id: string) => `skill:id:${id}`,
  skillByName: (name: string) => `skill:name:${name}`,
  searchResults: (query: string, page: number, limit: number) =>
    `skills:search:${query}:p${page}:l${limit}`,
  skillCategories: () => `skills:categories`,
  topByCategory: (category: string, limit: number) => `skills:top:${category}:${limit}`,
  trendingSkills: (limit: number) => `skills:trending:${limit}`,
  groupedByCategory: () => `skills:grouped`,
};

export const skillResolvers = {
  Query: {
    /**
     * Get all skills with filtering, sorting, and pagination
     * Implements cursor-based pagination and Redis caching
     */
    skills: async (_: any, { filter, sort, pagination }: any, _context: Context) => {
      try {
        // Validate inputs
        const validatedFilter = validatePartialInput(SkillFilterSchema, filter);
        const validatedPagination = validateInput(PaginationSchema, pagination || {});

        const { page, limit } = validatedPagination;
        const cacheKey = cacheKeys.skillList(validatedFilter, page, limit);

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

        if (validatedFilter.minProficiency !== undefined) {
          query.proficiency = { $gte: validatedFilter.minProficiency };
        }

        if (validatedFilter.featured !== undefined) {
          query.featured = validatedFilter.featured;
        }

        // Build sort
        let sortObj: any = { proficiency: -1 }; // Default sort
        if (sort) {
          const sortOrder = sort.order === 'ASC' ? 1 : -1;
          switch (sort.field) {
            case 'NAME':
              sortObj = { name: sortOrder };
              break;
            case 'PROFICIENCY':
              sortObj = { proficiency: sortOrder };
              break;
            case 'EXPERIENCE':
              sortObj = { yearsOfExperience: sortOrder };
              break;
            case 'PROJECT_COUNT':
              sortObj = { projectCount: sortOrder };
              break;
          }
        }

        // Execute query with pagination
        const { skip, limit: pageLimit } = getPagination(page, limit);
        const queryStart = Date.now();

        // Select only fields needed by SkillFields fragment
        const projection = {
          name: 1,
          category: 1,
          proficiency: 1,
          yearsOfExperience: 1,
          projectCount: 1,
          status: 1,
          relatedSkills: 1,
          icon: 1,
          color: 1,
          description: 1,
          views: 1,
          lastUsedDate: 1,
          featured: 1,
          order: 1,
          createdAt: 1,
          updatedAt: 1,
        };

        const [skills, totalCount] = await Promise.all([
          Skill.find(query, projection).sort(sortObj).skip(skip).limit(pageLimit).lean(),
          // Use estimatedDocumentCount when no filters (reads metadata, O(1))
          Object.keys(query).length === 0
            ? Skill.estimatedDocumentCount()
            : Skill.countDocuments(query),
        ]);

        logger.debug(
          `Skills query: ${Date.now() - queryStart}ms (${totalCount} total, page ${page})`
        );

        // Build connection response
        const result = buildConnection(skills, totalCount, page, pageLimit);

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.SKILL_LIST);
        logger.debug(`Cache set: ${cacheKey}`);

        return result;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get single skill by ID
     * Uses DataLoader for batching
     */
    skill: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        const cacheKey = cacheKeys.skillById(id);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Use DataLoader
        const skill = await context.loaders.skillLoader.load(id);

        if (!skill) {
          throw new NotFoundError('Skill', id);
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(skill), CACHE_TTL.SKILL_SINGLE);

        return skill;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Full-text search for skills
     */
    searchSkills: async (
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

        // Text search with regex fallback
        const { skip, limit: pageLimit } = getPagination(page, limit);

        let skills;
        let totalCount;

        try {
          // Try text search first — use skip/limit for proper pagination
          const textQuery = { $text: { $search: searchQuery } };
          [skills, totalCount] = await Promise.all([
            Skill.find(textQuery, { score: { $meta: 'textScore' } })
              .sort({ score: { $meta: 'textScore' } })
              .skip(skip)
              .limit(pageLimit)
              .lean(),
            Skill.countDocuments(textQuery),
          ]);
        } catch {
          // Fallback to regex search
          const regex = new RegExp(searchQuery, 'i');
          const regexQuery = {
            $or: [{ name: regex }, { description: regex }, { category: regex }],
          };
          [skills, totalCount] = await Promise.all([
            Skill.find(regexQuery).sort({ proficiency: -1 }).skip(skip).limit(pageLimit).lean(),
            Skill.countDocuments(regexQuery),
          ]);
        }

        // Build connection from already-paginated results
        const result = buildConnection(skills, totalCount, page, pageLimit);

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.SEARCH_RESULTS);

        logger.info(`Skill search: "${searchQuery}" - ${totalCount} results`);

        return result;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get top skills by category
     */
    topSkillsByCategory: async (
      _: any,
      { category, limit = 10 }: { category: string; limit?: number }
    ) => {
      try {
        const safeLimit = Math.min(Math.max(limit, 1), 50);
        const cacheKey = cacheKeys.topByCategory(category, safeLimit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const skills = await Skill.find({ category })
          .sort({ proficiency: -1, yearsOfExperience: -1 })
          .limit(safeLimit)
          .lean();

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(skills), CACHE_TTL.TOP_SKILLS);

        return skills;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get trending skills based on recent project usage
     */
    trendingSkills: async (_: any, { limit = 5 }: { limit?: number }) => {
      try {
        const safeLimit = Math.min(Math.max(limit, 1), 20);
        const cacheKey = cacheKeys.trendingSkills(safeLimit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        // Get skills with highest project count and recent updates
        const skills = await Skill.find({ status: { $ne: 'ARCHIVED' } })
          .sort({ projectCount: -1, updatedAt: -1 })
          .limit(safeLimit)
          .lean();

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(skills), CACHE_TTL.TRENDING);

        return skills;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get all unique skill categories
     */
    skillCategories: async () => {
      try {
        const cacheKey = cacheKeys.skillCategories();

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const categories = await Skill.distinct('category');

        // Cache result (longer TTL since categories rarely change)
        await cacheSet(cacheKey, JSON.stringify(categories), CACHE_TTL.CATEGORIES);

        return categories;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Create a new skill (ADMIN ONLY)
     */
    createSkill: async (_: any, { input }: any, context: Context) => {
      try {
        // Rate limit: 20 creates per hour
        checkRateLimit(context.ip || 'unknown', 'create_skill', 20, 3600000);

        const skill = new Skill(input);
        await skill.save();

        // Invalidate related caches
        await Promise.all([
          cacheDelete(cacheKeys.skillCategories()),
          cacheDelete(cacheKeys.groupedByCategory()),
        ]);

        logger.info(`Skill created: ${skill.name}`);

        return skill;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Update an existing skill (ADMIN ONLY)
     */
    updateSkill: async (_: any, { id, input }: any, context: Context) => {
      try {
        // Rate limit: 30 updates per hour
        checkRateLimit(context.ip || 'unknown', 'update_skill', 30, 3600000);

        const skill = await Skill.findByIdAndUpdate(
          id,
          { $set: input },
          { new: true, runValidators: true }
        );

        if (!skill) {
          throw new NotFoundError('Skill', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.skillById(id)),
          cacheDelete(cacheKeys.skillByName(skill.name)),
          cacheDelete(cacheKeys.skillCategories()),
        ]);

        logger.info(`Skill updated: ${skill.name}`);

        return skill;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Delete a skill (ADMIN ONLY)
     */
    deleteSkill: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        const skill = await Skill.findById(id);

        if (!skill) {
          throw new NotFoundError('Skill', id);
        }

        await Skill.findByIdAndDelete(id);

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.skillById(id)),
          cacheDelete(cacheKeys.skillByName(skill.name)),
          cacheDelete(cacheKeys.skillCategories()),
        ]);

        logger.info(`Skill deleted: ${skill.name}`);

        return {
          success: true,
          message: 'Skill deleted successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Sync skill project counts from projects collection
     */
    syncSkillProjectCounts: async (_: any, __: any, context: Context) => {
      try {
        // Rate limit: 1 sync per hour
        checkRateLimit(context.ip || 'unknown', 'sync_skills', 1, 3600000);

        // Use static method if available
        if (typeof (Skill as any).syncProjectCounts === 'function') {
          await (Skill as any).syncProjectCounts();
        }

        // Invalidate all skill caches
        await cacheDelete(cacheKeys.groupedByCategory());

        logger.info('Skill project counts synced');

        return {
          success: true,
          message: 'Skill project counts synced successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },
  },

  /**
   * Field resolvers for Skill type
   */
  Skill: {
    /**
     * Map MongoDB _id to GraphQL id field
     */
    id: (parent: any) => parent._id?.toString() || parent.id,

    /**
     * Resolve proficiencyLevel (virtual stripped by .lean())
     */
    proficiencyLevel: (parent: any) => {
      if (parent.proficiencyLevel) return parent.proficiencyLevel;
      const p = parent.proficiency || 0;
      if (p >= 90) return 'Expert';
      if (p >= 75) return 'Advanced';
      if (p >= 60) return 'Intermediate';
      if (p >= 40) return 'Beginner';
      return 'Novice';
    },

    /**
     * Resolve isActive (virtual stripped by .lean())
     */
    isActive: (parent: any) => {
      if (typeof parent.isActive === 'boolean') return parent.isActive;
      return parent.status !== 'ARCHIVED';
    },

    /**
     * Dynamically compute project count from actual projects
     */
    projectCount: async (parent: any, _: any, context: Context) => {
      try {
        const projects = await context.loaders.projectsByTechnologyLoader.load(parent.name);
        return projects?.length ?? parent.projectCount ?? 0;
      } catch {
        return parent.projectCount ?? 0;
      }
    },

    /**
     * Resolve related projects using DataLoader
     */
    relatedProjects: async (parent: any, _: any, context: Context) => {
      try {
        const projects = await context.loaders.projectsByTechnologyLoader.load(parent.name);
        return projects || [];
      } catch (error) {
        logger.error('Error loading related projects:', error);
        return [];
      }
    },

    /**
     * Calculate experience level based on years
     */
    experienceLevel: (parent: any) => {
      const years = parent.yearsOfExperience || 0;
      if (years >= 5) return 'EXPERT';
      if (years >= 3) return 'ADVANCED';
      if (years >= 1) return 'INTERMEDIATE';
      return 'BEGINNER';
    },
  },
};
