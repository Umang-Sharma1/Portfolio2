/**
 * Custom GraphQL Hooks
 *
 * Re-exports generated hooks with custom utilities for:
 * - Cache management
 * - Prefetching
 * - Optimistic updates
 */

import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { GET_PROJECT_BY_SLUG, GET_FEATURED_PROJECTS, GET_SKILLS, GET_STATS } from './queries';

// Re-export all generated hooks
export * from './__generated__/types';

// ============================================================================
// CACHE UTILITIES HOOK
// ============================================================================

/**
 * Hook for cache management utilities
 */
export function useCacheUtils() {
  const client = useApolloClient();

  const evictProjects = useCallback(() => {
    client.cache.evict({ fieldName: 'projects' });
    client.cache.evict({ fieldName: 'featuredProjects' });
    client.cache.evict({ fieldName: 'trendingProjects' });
    client.cache.evict({ fieldName: 'searchProjects' });
    client.cache.evict({ fieldName: 'projectsByCategory' });
    client.cache.gc();
  }, [client]);

  const evictSkills = useCallback(() => {
    client.cache.evict({ fieldName: 'skills' });
    client.cache.evict({ fieldName: 'trendingSkills' });
    client.cache.evict({ fieldName: 'topSkillsByCategory' });
    client.cache.evict({ fieldName: 'searchSkills' });
    client.cache.gc();
  }, [client]);

  const evictLeaderboard = useCallback(() => {
    client.cache.evict({ fieldName: 'leaderboard' });
    client.cache.evict({ fieldName: 'todayLeaderboard' });
    client.cache.gc();
  }, [client]);

  const evictAnalytics = useCallback(() => {
    client.cache.evict({ fieldName: 'analytics' });
    client.cache.evict({ fieldName: 'aggregateAnalytics' });
    client.cache.evict({ fieldName: 'recentAnalytics' });
    client.cache.gc();
  }, [client]);

  const clearCache = useCallback(() => {
    client.cache.reset();
  }, [client]);

  const evictAll = useCallback(() => {
    evictProjects();
    evictSkills();
    evictLeaderboard();
    evictAnalytics();
  }, [evictProjects, evictSkills, evictLeaderboard, evictAnalytics]);

  return {
    evictProjects,
    evictSkills,
    evictLeaderboard,
    evictAnalytics,
    evictAll,
    clearCache,
  };
}

// ============================================================================
// PREFETCH HOOKS
// ============================================================================

/**
 * Hook for prefetching project data
 */
export function usePrefetchProject() {
  const client = useApolloClient();

  const prefetch = useCallback(
    async (slug: string) => {
      try {
        await client.query({
          query: GET_PROJECT_BY_SLUG,
          variables: { slug },
          fetchPolicy: 'cache-first',
        });
      } catch (error) {
        // Silent fail for prefetch
        console.debug('Prefetch failed for project:', slug);
      }
    },
    [client]
  );

  return { prefetch };
}

/**
 * Hook for prefetching on hover (with debounce intent)
 */
export function usePrefetchOnHover() {
  const { prefetch } = usePrefetchProject();

  const onHover = useCallback(
    (slug: string) => {
      // Use requestIdleCallback if available, otherwise setTimeout
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => prefetch(slug), { timeout: 1000 });
      } else {
        setTimeout(() => prefetch(slug), 100);
      }
    },
    [prefetch]
  );

  return { onHover };
}

// ============================================================================
// WARMUP HOOK
// ============================================================================

/**
 * Hook for warming up the cache with essential data
 */
export function useWarmupCache() {
  const client = useApolloClient();

  const warmup = useCallback(async () => {
    try {
      await Promise.all([
        client.query({
          query: GET_FEATURED_PROJECTS,
          variables: { limit: 6 },
          fetchPolicy: 'cache-first',
        }),
        client.query({
          query: GET_SKILLS,
          variables: { pagination: { page: 1, limit: 50 } },
          fetchPolicy: 'cache-first',
        }),
        client.query({
          query: GET_STATS,
          fetchPolicy: 'cache-first',
        }),
      ]);
    } catch (error) {
      console.debug('Cache warmup failed:', error);
    }
  }, [client]);

  return { warmup };
}

// ============================================================================
// OPTIMISTIC UPDATE HELPERS
// ============================================================================

/**
 * Create an optimistic response for track view mutation
 */
export function createOptimisticViewResponse() {
  return {
    __typename: 'MutationResponse' as const,
    success: true,
    message: 'View tracked',
  };
}

/**
 * Create an optimistic response for track click mutation
 */
export function createOptimisticClickResponse() {
  return {
    __typename: 'MutationResponse' as const,
    success: true,
    message: 'Click tracked',
  };
}

/**
 * Create an optimistic response for contact message
 */
export function createOptimisticContactResponse(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const now = new Date().toISOString();
  return {
    __typename: 'ContactMessage' as const,
    id: `temp-${Date.now()}`,
    name: input.name,
    email: input.email,
    subject: input.subject || null,
    message: input.message,
    status: 'NEW' as const,
    isSpam: false,
    spamScore: 0,
    isRecent: true,
    daysSinceCreation: 0,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create an optimistic response for submit score
 */
export function createOptimisticScoreResponse(input: {
  username: string;
  wpm: number;
  accuracy: number;
  score: number;
  level: number;
  duration: number;
  mistakes: number;
  gameMode: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  gameType: 'TYPING' | 'QUIZ' | 'CODE_CHALLENGE' | 'MEMORY';
  isAnonymous?: boolean;
}) {
  const now = new Date().toISOString();
  return {
    __typename: 'SubmitScoreResponse' as const,
    success: true,
    message: 'Score submitted',
    entry: {
      __typename: 'LeaderboardEntry' as const,
      id: `temp-${Date.now()}`,
      username: input.username,
      wpm: input.wpm,
      accuracy: input.accuracy,
      score: input.score,
      level: input.level,
      duration: input.duration,
      mistakes: input.mistakes,
      gameMode: input.gameMode,
      gameType: input.gameType,
      isAnonymous: input.isAnonymous ?? true,
      country: null,
      isVerified: false,
      grade:
        input.accuracy >= 95 ? 'A' : input.accuracy >= 85 ? 'B' : input.accuracy >= 75 ? 'C' : 'D',
      rank: null,
      timestamp: now,
      createdAt: now,
    },
    rank: null,
    isPersonalBest: false,
  };
}
