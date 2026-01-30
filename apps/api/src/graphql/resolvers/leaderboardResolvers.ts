import { GameLeaderboard } from '../../models/GameLeaderboard';
import { cacheGet, cacheSet, cacheDelete } from '../../config/redis';
import {
  handleError,
  NotFoundError,
  RateLimitError,
  buildConnection,
  getPagination,
  checkRateLimit,
} from '../utils/errors';
import { requireRole, Context } from '../utils/auth';
import { logger } from '../../utils/logger';
import {
  validateInput,
  validatePartialInput,
  SubmitScoreSchema,
  LeaderboardFilterSchema,
  PaginationSchema,
} from '../utils/validation';

/**
 * Cache TTL Constants (in seconds)
 */
const CACHE_TTL = {
  LEADERBOARD_LIST: 60, // 1 minute (frequently updated)
  TODAY_LEADERBOARD: 30, // 30 seconds
  PERSONAL_BEST: 300, // 5 minutes
  PLAYER_RANK: 60, // 1 minute
};

/**
 * Cache Key Generators
 */
const cacheKeys = {
  leaderboardList: (filter: any, page: number, limit: number) =>
    `leaderboard:list:${JSON.stringify(filter)}:p${page}:l${limit}`,
  todayLeaderboard: (gameType: string, limit: number) => `leaderboard:today:${gameType}:${limit}`,
  personalBest: (username: string, gameType: string) => `leaderboard:pb:${username}:${gameType}`,
  playerRank: (id: string) => `leaderboard:rank:${id}`,
};

const submissionTracker = new Map<string, number>();

const checkDuplicateSubmission = (ip: string, username: string): void => {
  const key = `${ip}:${username}`;
  const now = Date.now();
  const lastSubmission = submissionTracker.get(key);

  if (lastSubmission && now - lastSubmission < 300000) {
    // 5 minutes
    const remainingSeconds = Math.ceil((300000 - (now - lastSubmission)) / 1000);
    throw new RateLimitError(
      `Please wait ${remainingSeconds} seconds before submitting another score`
    );
  }

  submissionTracker.set(key, now);
};

export const leaderboardResolvers = {
  Query: {
    /**
     * Get leaderboard with filters, sorting, and pagination
     * Implements Redis caching with short TTL
     */
    leaderboard: async (_: any, { filter, sort, pagination }: any, _context: Context) => {
      try {
        // Validate inputs
        const validatedFilter = validatePartialInput(LeaderboardFilterSchema, filter);
        const validatedPagination = validateInput(PaginationSchema, pagination || {});

        const { page, limit } = validatedPagination;
        const cacheKey = cacheKeys.leaderboardList(validatedFilter, page, limit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const { skip, limit: validLimit } = getPagination(page, limit);

        // Build query
        const query: any = {};

        if (validatedFilter.gameType) {
          query.gameType = validatedFilter.gameType;
        }

        if (validatedFilter.gameMode) {
          query.gameMode = validatedFilter.gameMode;
        }

        if (validatedFilter.username) {
          query.username = validatedFilter.username;
        }

        if (validatedFilter.isVerified !== undefined) {
          query.isVerified = validatedFilter.isVerified;
        }

        if (validatedFilter.dateFrom || validatedFilter.dateTo) {
          query.timestamp = {};
          if (validatedFilter.dateFrom) {
            query.timestamp.$gte = new Date(validatedFilter.dateFrom);
          }
          if (validatedFilter.dateTo) {
            query.timestamp.$lte = new Date(validatedFilter.dateTo);
          }
        }

        // Build sort
        const sortField = sort?.field || 'SCORE';
        const sortOrder = sort?.order === 'ASC' ? 1 : -1;

        const sortMap: Record<string, any> = {
          SCORE: { score: sortOrder, timestamp: -1 },
          WPM: { wpm: sortOrder, timestamp: -1 },
          ACCURACY: { accuracy: sortOrder, timestamp: -1 },
          TIMESTAMP: { timestamp: sortOrder },
        };

        const sortQuery = sortMap[sortField] || { score: -1 };

        // Execute query
        const [entries, totalCount] = await Promise.all([
          GameLeaderboard.find(query).sort(sortQuery).skip(skip).limit(validLimit).lean(),
          GameLeaderboard.countDocuments(query),
        ]);

        const result = buildConnection(entries, totalCount, page, validLimit);

        // Cache result (short TTL for leaderboard)
        await cacheSet(cacheKey, JSON.stringify(result), CACHE_TTL.LEADERBOARD_LIST);

        return result;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get today's top scores
     * Cached with very short TTL
     */
    todayLeaderboard: async (
      _: any,
      { gameType, limit = 10 }: { gameType: string; limit?: number },
      _context: Context
    ) => {
      try {
        const safeLimit = Math.min(Math.max(limit, 1), 100);
        const cacheKey = cacheKeys.todayLeaderboard(gameType, safeLimit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const entries = await (GameLeaderboard as any).getTodayTop(gameType, safeLimit);

        // Cache result (very short TTL)
        await cacheSet(cacheKey, JSON.stringify(entries), CACHE_TTL.TODAY_LEADERBOARD);

        return entries;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get player's personal best
     */
    personalBest: async (
      _: any,
      { username, gameType }: { username: string; gameType: string },
      _context: Context
    ) => {
      try {
        const cacheKey = cacheKeys.personalBest(username, gameType);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const entry = await (GameLeaderboard as any).getPersonalBest(username, gameType);

        if (entry) {
          // Cache result
          await cacheSet(cacheKey, JSON.stringify(entry), CACHE_TTL.PERSONAL_BEST);
        }

        return entry;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get player rank
     */
    playerRank: async (_: any, { id }: { id: string }, _context: Context) => {
      try {
        const cacheKey = cacheKeys.playerRank(id);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const rank = await (GameLeaderboard as any).getPlayerRank(id);

        if (!rank) {
          throw new NotFoundError('LeaderboardEntry', id);
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(rank), CACHE_TTL.PLAYER_RANK);

        return rank;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Submit game score (PUBLIC)
     * Implements rate limiting, validation, and anti-cheat checks
     */
    submitScore: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const clientIp = context.ip || 'unknown';

        // Validate input with Zod
        const validatedInput = validateInput(SubmitScoreSchema, input);

        // Rate limiting: 5 submissions per hour per IP
        checkRateLimit(clientIp, 'submit_score', 5, 3600000);

        // Check for duplicate submission (5 minute cooldown)
        checkDuplicateSubmission(clientIp, validatedInput.username);

        // Anti-cheat validation
        const suspiciousActivity = detectSuspiciousActivity(validatedInput);
        if (suspiciousActivity.isSuspicious) {
          logger.warn(`Suspicious score submission from ${clientIp}: ${suspiciousActivity.reason}`);
          // Don't reject, but flag for review
        }

        // Create entry
        const entry = new GameLeaderboard({
          ...validatedInput,
          ipAddress: clientIp,
          userAgent: context.userAgent,
          timestamp: new Date(),
          isSuspicious: suspiciousActivity.isSuspicious,
          suspiciousReason: suspiciousActivity.reason,
        });

        // Score is auto-calculated in pre-save hook
        await entry.save();

        // Get rank
        const rank = await (GameLeaderboard as any).getPlayerRank(entry._id);

        // Check if personal best
        const previousBest = await (GameLeaderboard as any).getPersonalBest(
          validatedInput.username,
          validatedInput.gameType
        );

        const isPersonalBest = !previousBest || entry.score > previousBest.score;

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.todayLeaderboard(validatedInput.gameType, 10)),
          cacheDelete(cacheKeys.personalBest(validatedInput.username, validatedInput.gameType)),
        ]);

        logger.info(
          `Score submitted: ${validatedInput.username} - ${entry.score} points ` +
            `(${validatedInput.wpm} WPM, ${validatedInput.accuracy}% accuracy)`
        );

        return {
          success: true,
          message: isPersonalBest ? '🎉 New personal best!' : 'Score submitted successfully',
          entry,
          rank,
          isPersonalBest,
        };
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Verify score (ADMIN ONLY)
     */
    verifyScore: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        requireRole(context, 'ADMIN');

        const entry = await GameLeaderboard.findByIdAndUpdate(
          id,
          { isVerified: true },
          { new: true }
        );

        if (!entry) {
          throw new NotFoundError('LeaderboardEntry', id);
        }

        // Invalidate caches
        await cacheDelete(cacheKeys.playerRank(id));

        logger.info(`Score verified: ${entry.username} - ${entry.score} points`);

        return entry;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Delete score (ADMIN ONLY)
     */
    deleteScore: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        requireRole(context, 'ADMIN');

        const entry = await GameLeaderboard.findByIdAndDelete(id);

        if (!entry) {
          throw new NotFoundError('LeaderboardEntry', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.playerRank(id)),
          cacheDelete(cacheKeys.todayLeaderboard(entry.gameType, 10)),
          cacheDelete(cacheKeys.personalBest(entry.username, entry.gameType)),
        ]);

        logger.info(`Score deleted: ${entry.username} - ${entry.score} points`);

        return {
          success: true,
          message: 'Score deleted successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },
  },

  // Field resolvers
  LeaderboardEntry: {
    /**
     * Resolve grade virtual
     */
    grade: (parent: any) => {
      if (typeof parent.getGrade === 'function') {
        return parent.getGrade();
      }
      return parent.grade || 'N/A';
    },

    /**
     * Resolve rank (expensive - only compute if requested)
     */
    rank: async (parent: any) => {
      if (parent.rank) return parent.rank;

      const rank = await (GameLeaderboard as any).getPlayerRank(parent._id || parent.id);
      return rank;
    },
  },
};

/**
 * Anti-cheat detection for suspicious scores
 */
function detectSuspiciousActivity(input: {
  wpm: number;
  accuracy: number;
  duration: number;
  mistakes: number;
}): { isSuspicious: boolean; reason?: string } {
  const { wpm, accuracy, duration, mistakes } = input;

  // World record for typing speed is ~212 WPM
  // Flag anything above 200 as suspicious
  if (wpm > 200) {
    return { isSuspicious: true, reason: 'WPM exceeds human capability' };
  }

  // Perfect accuracy with high WPM is suspicious
  if (accuracy === 100 && wpm > 100) {
    return {
      isSuspicious: true,
      reason: 'Perfect accuracy with high WPM is unusual',
    };
  }

  // Very short duration with high score
  if (duration < 20 && wpm > 80) {
    return { isSuspicious: true, reason: 'High WPM in very short duration' };
  }

  // No mistakes but high WPM
  if (mistakes === 0 && wpm > 120) {
    return {
      isSuspicious: true,
      reason: 'Zero mistakes with very high WPM is unusual',
    };
  }

  // Accuracy doesn't match mistakes/duration ratio
  const expectedMistakes = Math.floor(((100 - accuracy) / 100) * wpm * (duration / 60));
  const mistakeDifference = Math.abs(mistakes - expectedMistakes);
  if (mistakeDifference > expectedMistakes * 0.5 && expectedMistakes > 5) {
    return {
      isSuspicious: true,
      reason: "Mistakes don't match accuracy/WPM ratio",
    };
  }

  return { isSuspicious: false };
}

/**
 * Query Examples:
 *
 * # Get global leaderboard
 * query {
 *   leaderboard(
 *     filter: {
 *       gameType: TYPING
 *       gameMode: HARD
 *       isVerified: true
 *     }
 *     sort: { field: SCORE, order: DESC }
 *     pagination: { page: 1, limit: 100 }
 *   ) {
 *     edges {
 *       node {
 *         username
 *         wpm
 *         accuracy
 *         score
 *         grade
 *       }
 *     }
 *     pageInfo {
 *       hasNextPage
 *       totalPages
 *     }
 *     totalCount
 *   }
 * }
 *
 * # Get today's top scores
 * query {
 *   todayLeaderboard(gameType: TYPING, limit: 10) {
 *     username
 *     score
 *     wpm
 *     grade
 *   }
 * }
 *
 * # Get personal best
 * query {
 *   personalBest(username: "john_doe", gameType: TYPING) {
 *     score
 *     wpm
 *     accuracy
 *     timestamp
 *   }
 * }
 *
 * # Submit score
 * mutation {
 *   submitScore(input: {
 *     username: "john_doe"
 *     wpm: 85
 *     accuracy: 96.5
 *     level: 5
 *     duration: 60
 *     mistakes: 3
 *     gameMode: HARD
 *     gameType: TYPING
 *   }) {
 *     success
 *     message
 *     entry {
 *       score
 *       grade
 *     }
 *     rank
 *     isPersonalBest
 *   }
 * }
 */
