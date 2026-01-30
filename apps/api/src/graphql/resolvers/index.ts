import { skillResolvers } from './skillResolvers';
import { projectResolvers } from './projectResolvers';
import { contactResolvers } from './contactResolvers';
import { statsResolvers } from './statsResolvers';
import { analyticsResolvers } from './analyticsResolvers';
import { leaderboardResolvers } from './leaderboardResolvers';
import { authResolvers } from './authResolvers';

/**
 * Combined GraphQL Resolvers
 *
 * Features:
 * - Redis caching with variable TTLs (5-10 min for queries)
 * - DataLoader integration for N+1 prevention
 * - Rate limiting on mutations
 * - Zod input validation
 * - Field resolvers for computed fields
 * - JWT authentication with refresh tokens
 */
export const resolvers = {
  Query: {
    // Skill queries
    ...skillResolvers.Query,
    // Project queries (including searchProjects)
    ...projectResolvers.Query,
    // Stats queries
    ...statsResolvers.Query,
    // Analytics queries
    ...analyticsResolvers.Query,
    // Leaderboard queries
    ...leaderboardResolvers.Query,
    // Contact message queries (admin)
    ...contactResolvers.Query,
    // Auth queries
    ...authResolvers.Query,
  },
  Mutation: {
    // Contact mutations (sendMessage with rate limiting)
    ...contactResolvers.Mutation,
    // Analytics mutations (trackView, trackClick)
    ...analyticsResolvers.Mutation,
    // Leaderboard mutations (submitScore with anti-cheat)
    ...leaderboardResolvers.Mutation,
    // Project mutations (admin)
    ...projectResolvers.Mutation,
    // Skill mutations (admin)
    ...skillResolvers.Mutation,
    // Auth mutations (login, logout, refresh)
    ...authResolvers.Mutation,
  },
  // Field resolvers for type-specific computations
  Project: projectResolvers.Project,
  Skill: skillResolvers.Skill,
  ContactMessage: contactResolvers.ContactMessage,
  Analytics: analyticsResolvers.Analytics,
  LeaderboardEntry: leaderboardResolvers.LeaderboardEntry,
};

/**
 * Usage:
 *
 * The resolvers are automatically merged and passed to Apollo Server.
 * Each resolver module handles:
 *
 * 1. Redis Caching:
 *    - Projects: 5 min for lists, 10 min for single items
 *    - Skills: 10 min for lists, 15 min for singles
 *    - Leaderboard: 1 min (frequently updated)
 *    - Search: 10 min
 *
 * 2. Rate Limiting:
 *    - sendContactMessage: 5 per hour per IP
 *    - submitScore: 5 per hour per IP
 *    - trackView: 100 per hour per IP
 *    - trackClick: 50 per hour per IP
 *
 * 3. DataLoader:
 *    - Projects by ID/slug
 *    - Skills by ID/name
 *    - Projects by technology
 *
 * 4. Validation:
 *    - Zod schemas for all inputs
 *    - Spam detection for messages
 *    - Anti-cheat for leaderboard
 */
