import { createClient, RedisClientType } from 'redis';
import { config } from './index';
import { logger } from '../utils/logger';

// ============================================================================
// CACHE TTL CONSTANTS (in seconds)
// ============================================================================
export const CACHE_TTL = {
  // API Responses
  PROJECTS: 300, // 5 minutes
  SKILLS: 300, // 5 minutes
  PROJECT_DETAIL: 600, // 10 minutes

  // Search Results
  SEARCH: 600, // 10 minutes

  // Rate Limiting Data
  RATE_LIMIT: 900, // 15 minutes

  // Analytics
  ANALYTICS: 3600, // 1 hour
  ANALYTICS_AGGREGATION: 3600, // 1 hour

  // Leaderboard
  LEADERBOARD: 180, // 3 minutes (more dynamic)

  // Contact Messages
  MESSAGES: 300, // 5 minutes
} as const;

// ============================================================================
// CACHE METRICS
// ============================================================================
interface CacheMetrics {
  hits: number;
  misses: number;
  errors: number;
  lastReset: Date;
}

const metrics: CacheMetrics = {
  hits: 0,
  misses: 0,
  errors: 0,
  lastReset: new Date(),
};

/**
 * Get cache hit/miss statistics
 */
export function getCacheMetrics(): CacheMetrics & { hitRate: string } {
  const total = metrics.hits + metrics.misses;
  const hitRate = total > 0 ? ((metrics.hits / total) * 100).toFixed(2) : '0.00';
  return { ...metrics, hitRate: `${hitRate}%` };
}

/**
 * Reset cache metrics (for monitoring intervals)
 */
export function resetCacheMetrics(): void {
  metrics.hits = 0;
  metrics.misses = 0;
  metrics.errors = 0;
  metrics.lastReset = new Date();
}

// ============================================================================
// REDIS CLIENT
// ============================================================================
let redisClient: RedisClientType;
let isConnected = false;

/**
 * Connect to Redis with retry logic
 */
export async function connectRedis(): Promise<void> {
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      redisClient = createClient({
        url: config.redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis max reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            // Exponential backoff with max 30 seconds
            return Math.min(retries * 1000, 30000);
          },
          connectTimeout: 10000, // 10 second connection timeout
        },
      });

      redisClient.on('error', (error) => {
        logger.error('Redis Client Error:', error);
        isConnected = false;
        metrics.errors++;
      });

      redisClient.on('connect', () => {
        logger.info('✅ Redis connected successfully');
        isConnected = true;
      });

      redisClient.on('reconnecting', () => {
        logger.warn('Redis reconnecting...');
      });

      redisClient.on('end', () => {
        logger.warn('Redis connection closed');
        isConnected = false;
      });

      await redisClient.connect();
      return;
    } catch (error) {
      logger.error(`Redis connection attempt ${attempt}/${maxRetries} failed:`, error);

      if (attempt === maxRetries) {
        throw new Error(`Failed to connect to Redis after ${maxRetries} attempts`);
      }

      // Exponential backoff
      const delay = baseDelay * Math.pow(2, attempt - 1);
      logger.info(`Retrying Redis connection in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Get Redis client instance
 */
export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return isConnected && redisClient?.isOpen;
}

// ============================================================================
// CACHE HELPER FUNCTIONS
// ============================================================================

/**
 * Get cached value by key
 * Returns null if not found or on error
 */
export async function cacheGet(key: string): Promise<string | null> {
  try {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache get');
      metrics.misses++;
      return null;
    }

    const value = await redisClient.get(key);

    if (value !== null) {
      metrics.hits++;
      logger.debug(`Cache HIT: ${key}`);
    } else {
      metrics.misses++;
      logger.debug(`Cache MISS: ${key}`);
    }

    return value;
  } catch (error) {
    logger.error(`Cache get error for key ${key}:`, error);
    metrics.errors++;
    return null;
  }
}

/**
 * Set cached value with TTL
 */
export async function cacheSet(
  key: string,
  value: string,
  ttlSeconds: number = CACHE_TTL.PROJECTS
): Promise<boolean> {
  try {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache set');
      return false;
    }

    await redisClient.setEx(key, ttlSeconds, value);
    logger.debug(`Cache SET: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (error) {
    logger.error(`Cache set error for key ${key}:`, error);
    metrics.errors++;
    return false;
  }
}

/**
 * Delete cached value by key
 */
export async function cacheDelete(key: string): Promise<boolean> {
  try {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache delete');
      return false;
    }

    const result = await redisClient.del(key);
    logger.debug(`Cache DELETE: ${key} (removed: ${result})`);
    return result > 0;
  } catch (error) {
    logger.error(`Cache delete error for key ${key}:`, error);
    metrics.errors++;
    return false;
  }
}

/**
 * Check if key exists in cache
 */
export async function cacheExists(key: string): Promise<boolean> {
  try {
    if (!isRedisConnected()) {
      return false;
    }

    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Cache exists error for key ${key}:`, error);
    metrics.errors++;
    return false;
  }
}

/**
 * Invalidate all keys matching a pattern
 * Uses SCAN to avoid blocking Redis
 * Pattern example: "projects:*" or "search:*"
 */
export async function invalidatePattern(pattern: string): Promise<number> {
  try {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping pattern invalidation');
      return 0;
    }

    let cursor = 0;
    let deletedCount = 0;

    do {
      // Use SCAN to find keys matching pattern (non-blocking)
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;
      const keys = result.keys;

      if (keys.length > 0) {
        const deleted = await redisClient.del(keys);
        deletedCount += deleted;
      }
    } while (cursor !== 0);

    logger.info(`Cache INVALIDATE: Pattern "${pattern}" removed ${deletedCount} keys`);
    return deletedCount;
  } catch (error) {
    logger.error(`Cache invalidate pattern error for ${pattern}:`, error);
    metrics.errors++;
    return 0;
  }
}

/**
 * Clear all cache (use with caution!)
 */
export async function cacheClear(): Promise<void> {
  try {
    if (!isRedisConnected()) {
      logger.warn('Redis not connected, skipping cache clear');
      return;
    }

    await redisClient.flushDb();
    logger.info('Redis cache cleared');
  } catch (error) {
    logger.error('Cache clear error:', error);
    metrics.errors++;
  }
}

/**
 * Get TTL for a key (in seconds, -1 if no TTL, -2 if key doesn't exist)
 */
export async function cacheTTL(key: string): Promise<number> {
  try {
    if (!isRedisConnected()) {
      return -2;
    }

    return await redisClient.ttl(key);
  } catch (error) {
    logger.error(`Cache TTL error for key ${key}:`, error);
    metrics.errors++;
    return -2;
  }
}

// ============================================================================
// CACHE WARMING
// ============================================================================

import { Project } from '../models/Project';
import { Skill } from '../models/Skill';

/**
 * Pre-populate cache with frequently accessed data
 * Called on server startup — runs in parallel for speed
 */
export async function warmCache(): Promise<void> {
  try {
    if (!isRedisConnected()) {
      logger.warn('⚠️ Redis not connected, skipping cache warming');
      return;
    }

    logger.info('🔥 Starting cache warming...');
    const startTime = Date.now();

    // Select only fields needed by GraphQL fragments (avoid fetching entire documents)
    const projectProjection = {
      title: 1, slug: 1, description: 1, category: 1, status: 1,
      featured: 1, technologies: 1, images: 1, links: 1, metrics: 1,
      timeline: 1, views: 1, clicks: 1, features: 1, createdAt: 1, updatedAt: 1,
    };
    const skillProjection = {
      name: 1, category: 1, proficiency: 1, yearsOfExperience: 1,
      projectCount: 1, status: 1, relatedSkills: 1, icon: 1, color: 1,
      description: 1, views: 1, lastUsedDate: 1, featured: 1, order: 1,
      createdAt: 1, updatedAt: 1,
    };

    // Run all cache warming queries in parallel
    const [featuredProjects, skills, recentProjects] = await Promise.all([
      // 1. Featured projects
      Project.find({ featured: true, status: 'COMPLETED' }, projectProjection)
        .sort({ order: 1, createdAt: -1 })
        .limit(10)
        .lean(),

      // 2. All active skills
      Skill.find({ status: { $ne: 'ARCHIVED' } }, skillProjection)
        .sort({ proficiency: -1, name: 1 })
        .lean(),

      // 3. Recent projects (for homepage)
      Project.find({ status: 'COMPLETED' }, projectProjection)
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
    ]);

    // Cache everything in parallel
    const skillsByCategory = skills.reduce((acc: Record<string, any[]>, skill: any) => {
      const category = skill.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    }, {});

    await Promise.all([
      cacheSet('projects:featured', JSON.stringify(featuredProjects), CACHE_TTL.PROJECTS),
      cacheSet('skills:all', JSON.stringify(skills), CACHE_TTL.SKILLS),
      cacheSet('skills:by-category', JSON.stringify(skillsByCategory), CACHE_TTL.SKILLS),
      cacheSet('projects:recent', JSON.stringify(recentProjects), CACHE_TTL.PROJECTS),
    ]);

    const duration = Date.now() - startTime;
    logger.info(`🔥 Cache warming completed in ${duration}ms (${featuredProjects.length} featured, ${skills.length} skills, ${recentProjects.length} recent)`);
  } catch (error) {
    logger.error('Cache warming failed:', error);
    // Don't throw - cache warming failure shouldn't prevent server startup
  }
}

// ============================================================================
// RATE LIMITING WITH REDIS
// ============================================================================

/**
 * Check rate limit using Redis (distributed rate limiting)
 * Returns remaining requests or throws if limit exceeded
 */
export async function checkRedisRateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const key = `ratelimit:${action}:${identifier}`;

  try {
    if (!isRedisConnected()) {
      // Fallback: allow request if Redis is down
      logger.warn('Redis not connected, allowing request (rate limit bypass)');
      return { allowed: true, remaining: maxRequests, resetIn: 0 };
    }

    // Use Redis MULTI for atomic operations
    const multi = redisClient.multi();
    multi.incr(key);
    multi.ttl(key);

    const results = await multi.exec();
    const currentCount = results[0] as number;
    let ttl = results[1] as number;

    // Set TTL if this is the first request in the window
    if (ttl === -1) {
      await redisClient.expire(key, windowSeconds);
      ttl = windowSeconds;
    }

    const remaining = Math.max(0, maxRequests - currentCount);
    const allowed = currentCount <= maxRequests;

    return {
      allowed,
      remaining,
      resetIn: ttl,
    };
  } catch (error) {
    logger.error(`Rate limit check error for ${key}:`, error);
    // Fail open: allow request if Redis error
    return { allowed: true, remaining: maxRequests, resetIn: 0 };
  }
}

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

/**
 * Gracefully disconnect Redis
 */
export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient && isConnected) {
      await redisClient.quit();
      logger.info('Redis disconnected gracefully');
    }
  } catch (error) {
    logger.error('Error disconnecting Redis:', error);
  }
}
