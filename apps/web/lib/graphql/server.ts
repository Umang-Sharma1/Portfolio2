/**
 * Apollo Client for React Server Components (RSC)
 *
 * This module provides utilities for fetching GraphQL data
 * in Next.js 14 Server Components.
 *
 * Usage in Server Components:
 * ```tsx
 * import { getServerClient } from '@/lib/graphql/server';
 * import { GET_PROJECTS } from '@/lib/graphql/queries';
 *
 * export default async function ProjectsPage() {
 *   const { data } = await getServerClient().query({
 *     query: GET_PROJECTS,
 *   });
 *
 *   return <ProjectList projects={data.projects} />;
 * }
 * ```
 */

import { getServerClient } from '../apollo-client';
import {
  GET_PROJECTS,
  GET_PROJECT_BY_SLUG,
  GET_FEATURED_PROJECTS,
  GET_SKILLS,
  GET_STATS,
  GET_LEADERBOARD,
  SEARCH_PROJECTS,
} from './queries';

// Re-export the server client
export { getServerClient };

// ============================================================================
// SERVER-SIDE FETCH FUNCTIONS
// ============================================================================

/**
 * Fetch all projects with optional filters
 */
export async function fetchProjects(options?: {
  filter?: Record<string, any>;
  sort?: { field: string; order: 'ASC' | 'DESC' };
  pagination?: { page: number; limit: number };
}) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_PROJECTS,
    variables: {
      filter: options?.filter,
      sort: options?.sort,
      pagination: options?.pagination || { page: 1, limit: 10 },
    },
  });

  if (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }

  return data.projects;
}

/**
 * Fetch single project by slug
 */
export async function fetchProjectBySlug(slug: string) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_PROJECT_BY_SLUG,
    variables: { slug },
  });

  if (error) {
    console.error(`Error fetching project ${slug}:`, error);
    throw error;
  }

  return data.project;
}

/**
 * Fetch featured projects
 */
export async function fetchFeaturedProjects(limit: number = 6) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_FEATURED_PROJECTS,
    variables: { limit },
  });

  if (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }

  return data.featuredProjects;
}

/**
 * Fetch all skills with optional filters
 */
export async function fetchSkills(options?: {
  filter?: Record<string, any>;
  sort?: { field: string; order: 'ASC' | 'DESC' };
  pagination?: { page: number; limit: number };
}) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_SKILLS,
    variables: {
      filter: options?.filter,
      sort: options?.sort,
      pagination: options?.pagination || { page: 1, limit: 50 },
    },
  });

  if (error) {
    console.error('Error fetching skills:', error);
    throw error;
  }

  return data.skills;
}

/**
 * Fetch skills grouped by category
 */
export async function fetchSkillsByCategory() {
  const skills = await fetchSkills({ pagination: { page: 1, limit: 100 } });

  // Group skills by category
  const grouped: Record<string, any[]> = {};
  for (const skill of skills) {
    const category = skill.category;
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(skill);
  }

  // Sort each category by proficiency
  for (const category of Object.keys(grouped)) {
    grouped[category].sort((a, b) => b.proficiency - a.proficiency);
  }

  return grouped;
}

/**
 * Fetch portfolio stats
 */
export async function fetchStats() {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_STATS,
  });

  if (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }

  return data.stats;
}

/**
 * Fetch leaderboard entries
 */
export async function fetchLeaderboard(options?: {
  filter?: Record<string, any>;
  sort?: { field: string; order: 'ASC' | 'DESC' };
  pagination?: { page: number; limit: number };
}) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: GET_LEADERBOARD,
    variables: {
      filter: options?.filter,
      sort: options?.sort,
      pagination: options?.pagination || { page: 1, limit: 20 },
    },
  });

  if (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }

  return data.leaderboard;
}

/**
 * Search projects by query
 */
export async function searchProjects(query: string, limit: number = 10) {
  const client = getServerClient();

  const { data, error } = await client.query({
    query: SEARCH_PROJECTS,
    variables: { query, limit },
  });

  if (error) {
    console.error('Error searching projects:', error);
    throw error;
  }

  return data.searchProjects;
}

// ============================================================================
// CACHING STRATEGIES
// ============================================================================

/**
 * Fetch with revalidation for ISR (Incremental Static Regeneration)
 *
 * Usage:
 * const projects = await fetchWithRevalidate(
 *   () => fetchFeaturedProjects(6),
 *   60 // Revalidate every 60 seconds
 * );
 */
export async function fetchWithRevalidate<T>(
  fetcher: () => Promise<T>,
  revalidateSeconds: number = 60
): Promise<T> {
  // Note: Next.js handles revalidation at the route level
  // This is a placeholder for custom caching logic if needed
  return fetcher();
}

/**
 * Fetch with tags for on-demand revalidation
 *
 * Usage with revalidateTag:
 * revalidateTag('projects') // In an API route or Server Action
 */
export const CACHE_TAGS = {
  projects: 'projects',
  featuredProjects: 'featured-projects',
  skills: 'skills',
  stats: 'stats',
  leaderboard: 'leaderboard',
} as const;

// ============================================================================
// ERROR BOUNDARY HELPERS
// ============================================================================

/**
 * Safe fetch wrapper that returns null on error
 * Useful for optional data that shouldn't break the page
 */
export async function safeFetch<T>(fetcher: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fetcher();
  } catch (error) {
    console.error('Safe fetch error:', error);
    return fallback;
  }
}
