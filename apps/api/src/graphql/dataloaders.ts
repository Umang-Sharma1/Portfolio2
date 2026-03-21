import DataLoader from 'dataloader';
import { Project } from '../models/Project';
import { Skill } from '../models/Skill';
import { ContactMessage } from '../models/ContactMessage';
import { Analytics } from '../models/Analytics';
import { GameLeaderboard } from '../models/GameLeaderboard';

/**
 * DataLoader utility to prevent N+1 query problems
 * Batches and caches database requests within a single GraphQL operation
 */

// Batch function for Projects
const batchProjects = async (ids: readonly string[]) => {
  const projects = await Project.find({ _id: { $in: ids as string[] } }).lean();

  // Map results to maintain order of input IDs
  const projectMap = new Map(projects.map((p: any) => [p._id.toString(), p]));
  return ids.map((id) => projectMap.get(id) || null);
};

// Batch function for Skills
const batchSkills = async (ids: readonly string[]) => {
  const skills = await Skill.find({ _id: { $in: ids as string[] } }).lean();

  const skillMap = new Map(skills.map((s: any) => [s._id.toString(), s]));
  return ids.map((id) => skillMap.get(id) || null);
};

// Batch function for ContactMessages
const batchContactMessages = async (ids: readonly string[]) => {
  const messages = await ContactMessage.find({ _id: { $in: ids as string[] } }).lean();

  const messageMap = new Map(messages.map((m: any) => [m._id.toString(), m]));
  return ids.map((id) => messageMap.get(id) || null);
};

// Batch function for Analytics
const batchAnalytics = async (ids: readonly string[]) => {
  const analytics = await Analytics.find({ _id: { $in: ids as string[] } }).lean();

  const analyticsMap = new Map(analytics.map((a: any) => [a._id.toString(), a]));
  return ids.map((id) => analyticsMap.get(id) || null);
};

// Batch function for Leaderboard Entries
const batchLeaderboardEntries = async (ids: readonly string[]) => {
  const entries = await GameLeaderboard.find({ _id: { $in: ids as string[] } }).lean();

  const entryMap = new Map(entries.map((e: any) => [e._id.toString(), e]));
  return ids.map((id) => entryMap.get(id) || null);
};

/**
 * Batch function for Projects by Slug
 * Useful for SEO-friendly URLs
 */
const batchProjectsBySlug = async (slugs: readonly string[]) => {
  const projects = await Project.find({ slug: { $in: slugs as string[] } }).lean();

  const projectMap = new Map(projects.map((p: any) => [p.slug, p]));
  return slugs.map((slug) => projectMap.get(slug) || null);
};

/**
 * Batch function for Skills by Name
 * Useful for related skills lookup
 */
const batchSkillsByName = async (names: readonly string[]) => {
  const skills = await Skill.find({ name: { $in: names as string[] } }).lean();

  const skillMap = new Map(skills.map((s: any) => [s.name, s]));
  return names.map((name) => skillMap.get(name) || null);
};

/**
 * Batch function for Projects by Technology
 * Load all projects that use specific technologies in a SINGLE query
 * instead of one query per technology (N+1 fix)
 * Supports flexible matching via aliases for skill→technology name mismatches
 */

// Skill name → project technology aliases (bidirectional matching)
const TECH_ALIASES: Record<string, string[]> = {
  'Express.js': ['Express'],
  CSS3: ['CSS', 'CSS Modules'],
  GraphQL: ['Apollo GraphQL'],
  'JWT Authentication': ['JWT'],
  AWS: ['AWS S3'],
  'Sass/SCSS': ['Sass', 'SCSS', 'Styled Components'],
  JavaScript: ['JS'],
  HTML5: ['HTML'],
};

const batchProjectsByTechnology = async (technologies: readonly string[]) => {
  // Build expanded list: original names + all aliases (for the $in query)
  const expandedNames = new Set<string>();
  // Map: lowercased tech/alias → original requested skill name(s)
  const aliasToSkill = new Map<string, Set<string>>();

  for (const tech of technologies) {
    const variants = [tech, ...(TECH_ALIASES[tech] || [])];
    for (const v of variants) {
      expandedNames.add(v);
      const key = v.toLowerCase();
      if (!aliasToSkill.has(key)) aliasToSkill.set(key, new Set());
      aliasToSkill.get(key)!.add(tech);
    }
  }

  // Single query: find ALL projects matching ANY name or alias
  const allProjects = await Project.find({
    technologies: { $in: Array.from(expandedNames) },
  })
    .sort({ createdAt: -1 })
    .lean();

  // Group results by requested technology (through aliases, case-insensitive)
  const techMap = new Map<string, any[]>();
  for (const tech of technologies) {
    techMap.set(tech, []);
  }

  for (const project of allProjects) {
    const seen = new Set<string>(); // avoid duplicate project per skill
    for (const projTech of project.technologies) {
      const skills = aliasToSkill.get(projTech.toLowerCase());
      if (skills) {
        for (const skill of skills) {
          if (!seen.has(skill)) {
            seen.add(skill);
            techMap.get(skill)!.push(project);
          }
        }
      }
    }
  }

  return technologies.map((tech) => techMap.get(tech) || []);
};

/**
 * Create DataLoaders for a GraphQL request
 * New loaders are created per request to avoid caching issues
 */
export const createLoaders = () => {
  return {
    // By ID loaders
    projectLoader: new DataLoader<string, any>(batchProjects, {
      cacheKeyFn: (key) => key.toString(),
    }),

    skillLoader: new DataLoader<string, any>(batchSkills, {
      cacheKeyFn: (key) => key.toString(),
    }),

    contactMessageLoader: new DataLoader<string, any>(batchContactMessages, {
      cacheKeyFn: (key) => key.toString(),
    }),

    analyticsLoader: new DataLoader<string, any>(batchAnalytics, {
      cacheKeyFn: (key) => key.toString(),
    }),

    leaderboardEntryLoader: new DataLoader<string, any>(batchLeaderboardEntries, {
      cacheKeyFn: (key) => key.toString(),
    }),

    // Custom loaders
    projectBySlugLoader: new DataLoader<string, any>(batchProjectsBySlug),

    skillByNameLoader: new DataLoader<string, any>(batchSkillsByName),

    projectsByTechnologyLoader: new DataLoader<string, any[]>(batchProjectsByTechnology),
  };
};

/**
 * Type definition for loaders
 */
export type Loaders = ReturnType<typeof createLoaders>;

/**
 * Usage Example:
 *
 * In resolver:
 * const project = await context.loaders.projectLoader.load(projectId);
 * const skill = await context.loaders.skillByNameLoader.load("React");
 *
 * Benefits:
 * 1. Batching: Multiple load() calls in same tick are batched into one query
 * 2. Caching: Same ID requested multiple times = only one DB query per request
 * 3. Performance: Prevents N+1 queries (e.g., loading related skills for each project)
 */
