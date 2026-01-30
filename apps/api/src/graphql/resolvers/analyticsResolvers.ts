import { Analytics } from '../../models/Analytics';
import { Project } from '../../models/Project';
import { Skill } from '../../models/Skill';
import { cacheGet, cacheSet, cacheDelete } from '../../config/redis';
import { logger } from '../../utils/logger';
import { handleError, checkRateLimit, getPagination } from '../utils/errors';
import { Context } from '../utils/auth';
import { validateInput, TrackViewSchema, TrackClickSchema } from '../utils/validation';

/**
 * Cache TTL Constants (in seconds)
 */
const CACHE_TTL = {
  ANALYTICS_LIST: 600, // 10 minutes
  AGGREGATE_STATS: 900, // 15 minutes
  RECENT_ANALYTICS: 900, // 15 minutes
  DAILY_TRENDS: 1800, // 30 minutes
};

/**
 * Cache Key Generators
 */
const cacheKeys = {
  analyticsList: (dateFrom: string, dateTo: string, periodType?: string) =>
    `analytics:list:${dateFrom}:${dateTo}:${periodType || 'all'}`,
  aggregateStats: (dateFrom: string, dateTo: string) => `analytics:aggregate:${dateFrom}:${dateTo}`,
  recentAnalytics: (days: number) => `analytics:recent:${days}`,
  dailyTrends: (days: number) => `analytics:trends:${days}`,
};

/**
 * In-memory view tracking for rate limiting and deduplication
 * In production, this would use Redis
 */
const viewTracker = new Map<string, { count: number; lastView: number }>();
const clickTracker = new Map<string, number>();

/**
 * Check if this is a unique view (not duplicate within 30 minutes)
 */
const isUniqueView = (ip: string, page: string): boolean => {
  const key = `${ip}:${page}`;
  const now = Date.now();
  const record = viewTracker.get(key);

  if (!record || now - record.lastView > 1800000) {
    // 30 minutes
    viewTracker.set(key, { count: 1, lastView: now });
    return true;
  }

  record.count++;
  record.lastView = now;
  return false;
};

/**
 * Track a click (debounced)
 */
const trackUniqueClick = (ip: string, targetId: string): boolean => {
  const key = `${ip}:${targetId}`;
  const now = Date.now();
  const lastClick = clickTracker.get(key);

  if (!lastClick || now - lastClick > 60000) {
    // 1 minute debounce
    clickTracker.set(key, now);
    return true;
  }

  return false;
};

export const analyticsResolvers = {
  Query: {
    /**
     * Get analytics for date range
     */
    analytics: async (_: any, { filter }: any, _context: Context) => {
      try {
        const { dateFrom, dateTo, periodType } = filter;
        const cacheKey = cacheKeys.analyticsList(dateFrom, dateTo, periodType);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const query: any = {
          timestamp: {
            $gte: new Date(dateFrom),
            $lte: new Date(dateTo),
          },
        };

        if (periodType) {
          query.periodType = periodType;
        }

        const analytics = await Analytics.find(query).sort({ timestamp: -1 });

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(analytics), CACHE_TTL.ANALYTICS_LIST);

        return analytics;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get aggregate stats for dashboard
     */
    aggregateAnalytics: async (
      _: any,
      { dateFrom, dateTo }: { dateFrom: string; dateTo: string },
      _context: Context
    ) => {
      try {
        const cacheKey = cacheKeys.aggregateStats(dateFrom, dateTo);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const startDate = new Date(dateFrom);
        const endDate = new Date(dateTo);

        // Use static method if available
        let aggregate;
        if (typeof (Analytics as any).getAggregateStats === 'function') {
          aggregate = await (Analytics as any).getAggregateStats(startDate, endDate);
        } else {
          // Fallback aggregation
          const analytics = await Analytics.find({
            timestamp: { $gte: startDate, $lte: endDate },
          });

          aggregate = {
            totalPageViews: analytics.reduce((sum, a: any) => sum + (a.pageViews?.total || 0), 0),
            totalUniqueVisitors: analytics.reduce(
              (sum, a: any) => sum + (a.uniqueVisitors || 0),
              0
            ),
            totalProjectClicks: analytics.reduce(
              (sum, a: any) =>
                sum + (a.projectClicks?.reduce((s: number, p: any) => s + p.clicks, 0) || 0),
              0
            ),
            totalSkillViews: analytics.reduce(
              (sum, a: any) =>
                sum + (a.skillViews?.reduce((s: number, sk: any) => s + sk.views, 0) || 0),
              0
            ),
            averageBounceRate:
              analytics.length > 0
                ? analytics.reduce((sum, a: any) => sum + (a.bounceRate || 0), 0) / analytics.length
                : 0,
            averageSessionDuration:
              analytics.length > 0
                ? analytics.reduce((sum, a: any) => sum + (a.averageSessionDuration || 0), 0) /
                  analytics.length
                : 0,
            topProjects: [],
            topSkills: [],
          };
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(aggregate), CACHE_TTL.AGGREGATE_STATS);

        return aggregate;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get last N days analytics
     */
    recentAnalytics: async (_: any, { days = 30 }: { days?: number }, _context: Context) => {
      try {
        const safeDays = Math.min(Math.max(days, 1), 365);
        const cacheKey = cacheKeys.recentAnalytics(safeDays);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        let analytics;
        if (typeof (Analytics as any).getLastNDays === 'function') {
          analytics = await (Analytics as any).getLastNDays(safeDays);
        } else {
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - safeDays);

          analytics = await Analytics.find({
            timestamp: { $gte: startDate },
          }).sort({ timestamp: -1 });
        }

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(analytics), CACHE_TTL.RECENT_ANALYTICS);

        return analytics;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Track page view (PUBLIC)
     * Rate-limited and deduplicated
     */
    trackView: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const clientIp = context.ip || 'unknown';

        // Rate limit: 100 views per hour per IP
        checkRateLimit(clientIp, 'track_view', 100, 3600000);

        // Validate input
        const validatedInput = validateInput(TrackViewSchema, input);

        // Check if unique view
        const isUnique = isUniqueView(clientIp, validatedInput.page);

        // Get or create today's analytics record
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let analytics = await Analytics.findOne({
          timestamp: { $gte: today },
          periodType: 'DAILY',
        });

        if (!analytics) {
          analytics = new Analytics({
            periodType: 'DAILY',
            timestamp: today,
            pageViews: { home: 0, projects: 0, skills: 0, contact: 0, total: 0 },
            projectClicks: [],
            skillViews: [],
            uniqueVisitors: 0,
            returningVisitors: 0,
            averageSessionDuration: 0,
            bounceRate: 0,
            trafficSources: { direct: 0, search: 0, social: 0, referral: 0 },
            devices: { desktop: 0, mobile: 0, tablet: 0 },
            countries: new Map(),
          });
        }

        // Update page view count
        const pageKey = validatedInput.page as keyof typeof analytics.pageViews;
        if (analytics.pageViews && pageKey in analytics.pageViews) {
          (analytics.pageViews as any)[pageKey] = ((analytics.pageViews as any)[pageKey] || 0) + 1;
          analytics.pageViews.total = (analytics.pageViews.total || 0) + 1;
        }

        // Update unique visitors
        if (isUnique) {
          analytics.uniqueVisitors = (analytics.uniqueVisitors || 0) + 1;
        } else {
          analytics.returningVisitors = (analytics.returningVisitors || 0) + 1;
        }

        // Detect traffic source from referrer
        if (validatedInput.referrer) {
          const source = detectTrafficSource(validatedInput.referrer);
          if (analytics.trafficSources) {
            (analytics.trafficSources as any)[source] =
              ((analytics.trafficSources as any)[source] || 0) + 1;
          }
        } else if (analytics.trafficSources) {
          analytics.trafficSources.direct = (analytics.trafficSources.direct || 0) + 1;
        }

        await analytics.save();

        // Invalidate cache
        await cacheDelete(cacheKeys.recentAnalytics(30));

        logger.debug(`Page view tracked: ${validatedInput.page} from ${clientIp}`);

        return {
          success: true,
          message: 'View tracked successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Track click on project or skill (PUBLIC)
     */
    trackClick: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const clientIp = context.ip || 'unknown';

        // Rate limit: 50 clicks per hour per IP
        checkRateLimit(clientIp, 'track_click', 50, 3600000);

        // Validate input
        const validatedInput = validateInput(TrackClickSchema, input);

        // Check for unique click (debounced)
        const isUnique = trackUniqueClick(clientIp, validatedInput.targetId);

        if (!isUnique) {
          return {
            success: true,
            message: 'Click already recorded',
          };
        }

        // Update the appropriate model based on target type
        if (validatedInput.targetType === 'PROJECT') {
          await Project.findByIdAndUpdate(validatedInput.targetId, {
            $inc: { 'metrics.views': 1 },
          });
        } else if (validatedInput.targetType === 'SKILL') {
          await Skill.findByIdAndUpdate(validatedInput.targetId, {
            $inc: { viewCount: 1 },
          });
        }

        // Also update today's analytics
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (validatedInput.targetType === 'PROJECT') {
          await Analytics.findOneAndUpdate(
            {
              timestamp: { $gte: today },
              periodType: 'DAILY',
            },
            {
              $push: {
                projectClicks: {
                  projectId: validatedInput.targetId,
                  projectName: validatedInput.targetName || 'Unknown',
                  clicks: 1,
                },
              },
            },
            { upsert: true }
          );
        } else if (validatedInput.targetType === 'SKILL') {
          await Analytics.findOneAndUpdate(
            {
              timestamp: { $gte: today },
              periodType: 'DAILY',
            },
            {
              $push: {
                skillViews: {
                  skillId: validatedInput.targetId,
                  skillName: validatedInput.targetName || 'Unknown',
                  views: 1,
                },
              },
            },
            { upsert: true }
          );
        }

        logger.debug(
          `Click tracked: ${validatedInput.targetType} ${validatedInput.targetId} from ${clientIp}`
        );

        return {
          success: true,
          message: 'Click tracked successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Generate analytics for period (ADMIN ONLY)
     */
    generateAnalytics: async (_: any, { periodType }: { periodType: string }, context: Context) => {
      try {
        // Rate limit: 5 generations per hour
        checkRateLimit(context.ip || 'unknown', 'generate_analytics', 5, 3600000);

        const analytics = new Analytics({
          periodType,
          timestamp: new Date(),
          pageViews: { home: 0, projects: 0, skills: 0, contact: 0, total: 0 },
          projectClicks: [],
          skillViews: [],
          uniqueVisitors: 0,
          returningVisitors: 0,
          averageSessionDuration: 0,
          bounceRate: 0,
          trafficSources: { direct: 0, search: 0, social: 0, referral: 0 },
          devices: { desktop: 0, mobile: 0, tablet: 0 },
          countries: new Map(),
        });

        await analytics.save();

        // Invalidate caches
        await cacheDelete(cacheKeys.recentAnalytics(30));

        logger.info(`Analytics generated for period: ${periodType}`);

        return analytics;
      } catch (error) {
        handleError(error);
      }
    },
  },

  /**
   * Field resolvers for Analytics type
   */
  Analytics: {
    /**
     * Convert countries Map to array
     */
    countries: (parent: any) => {
      if (parent.countries instanceof Map) {
        return Array.from(parent.countries.entries() as [string, number][]).map(
          ([country, visits]) => ({
            country,
            visits,
          })
        );
      }
      if (Array.isArray(parent.countries)) {
        return parent.countries;
      }
      return [];
    },

    /**
     * Get most viewed project
     */
    mostViewedProject: (parent: any) => {
      if (!parent.projectClicks?.length) return null;

      const sorted = [...parent.projectClicks].sort((a: any, b: any) => b.clicks - a.clicks);
      return sorted[0] || null;
    },

    /**
     * Get most viewed skill
     */
    mostViewedSkill: (parent: any) => {
      if (!parent.skillViews?.length) return null;

      const sorted = [...parent.skillViews].sort((a: any, b: any) => b.views - a.views);
      return sorted[0] || null;
    },
  },
};

/**
 * Detect traffic source from referrer URL
 */
function detectTrafficSource(referrer: string): string {
  const url = referrer.toLowerCase();

  if (url.includes('google') || url.includes('bing') || url.includes('duckduckgo')) {
    return 'search';
  }

  if (
    url.includes('facebook') ||
    url.includes('twitter') ||
    url.includes('linkedin') ||
    url.includes('instagram')
  ) {
    return 'social';
  }

  if (url) {
    return 'referral';
  }

  return 'direct';
}

/**
 * Query/Mutation Examples:
 *
 * # Track page view
 * mutation {
 *   trackView(input: {
 *     page: home
 *     referrer: "https://google.com"
 *   }) {
 *     success
 *     message
 *   }
 * }
 *
 * # Track project click
 * mutation {
 *   trackClick(input: {
 *     targetType: PROJECT
 *     targetId: "project_id"
 *     targetName: "My Project"
 *   }) {
 *     success
 *     message
 *   }
 * }
 *
 * # Get recent analytics
 * query {
 *   recentAnalytics(days: 7) {
 *     timestamp
 *     pageViews { home projects skills contact total }
 *     uniqueVisitors
 *     bounceRate
 *   }
 * }
 *
 * # Get aggregate stats
 * query {
 *   aggregateAnalytics(dateFrom: "2024-01-01", dateTo: "2024-01-31") {
 *     totalPageViews
 *     totalUniqueVisitors
 *     averageBounceRate
 *     topProjects { projectName clicks }
 *   }
 * }
 */
