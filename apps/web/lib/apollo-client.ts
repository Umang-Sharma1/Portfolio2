import { ApolloClient, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import {
  HttpLink,
  from,
  ApolloLink,
  NormalizedCacheObject,
  TypePolicies,
  FieldMergeFunction,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';
import { createPersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';

// ============================================================================
// CONFIGURATION
// ============================================================================

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

const IS_SERVER = typeof window === 'undefined';
const IS_DEV = process.env.NODE_ENV === 'development';

// ============================================================================
// TYPE POLICIES - Cache Normalization & Field Policies
// ============================================================================

/**
 * Custom merge function for paginated lists
 * Handles cursor-based and offset-based pagination
 */
const paginatedMerge: FieldMergeFunction = (existing, incoming, { args }) => {
  // If no existing data or we're fetching the first page, use incoming
  if (!existing || args?.pagination?.page === 1 || args?.after === null) {
    return incoming;
  }

  // For cursor-based pagination (edges/pageInfo)
  if (incoming?.edges && existing?.edges) {
    return {
      ...incoming,
      edges: [...existing.edges, ...incoming.edges],
    };
  }

  // For array-based pagination
  if (Array.isArray(incoming) && Array.isArray(existing)) {
    return [...existing, ...incoming];
  }

  return incoming;
};

/**
 * Type policies for cache normalization and field-level caching
 */
const typePolicies: TypePolicies = {
  Query: {
    fields: {
      // Projects with pagination
      projects: {
        keyArgs: ['filter', 'sort'],
        merge: paginatedMerge,
      },

      // Single project by slug (cache by slug)
      project: {
        keyArgs: ['slug'],
        read(_, { args, toReference }) {
          if (args?.slug) {
            return toReference({
              __typename: 'Project',
              slug: args.slug,
            });
          }
          return undefined;
        },
      },

      // Featured projects (separate cache entry)
      featuredProjects: {
        keyArgs: ['limit'],
        merge: false, // Always replace
      },

      // Skills with pagination
      skills: {
        keyArgs: ['filter', 'sort'],
        merge: paginatedMerge,
      },

      // Leaderboard with filters
      leaderboard: {
        keyArgs: ['filter', 'sort', 'gameType', 'gameMode'],
        merge: paginatedMerge,
      },

      // Search results (no caching between different searches)
      searchProjects: {
        keyArgs: ['query'],
        merge: false,
      },

      // Analytics (cache by date range)
      analytics: {
        keyArgs: ['filter'],
        merge: false,
      },

      // Stats (single object, always fresh)
      stats: {
        merge: true,
      },
    },
  },

  // Project type normalization
  Project: {
    keyFields: ['id'],
    fields: {
      // Optimistic update for views
      views: {
        merge: (_, incoming) => incoming,
      },
      // Optimistic update for clicks
      clicks: {
        merge: true,
      },
    },
  },

  // Skill type normalization
  Skill: {
    keyFields: ['id'],
    fields: {
      views: {
        merge: (_, incoming) => incoming,
      },
    },
  },

  // Leaderboard entry normalization
  LeaderboardEntry: {
    keyFields: ['id'],
  },

  // Contact message normalization
  ContactMessage: {
    keyFields: ['id'],
  },

  // Analytics normalization
  Analytics: {
    keyFields: ['id'],
  },
};

// ============================================================================
// LINKS
// ============================================================================

/**
 * HTTP Link - Main transport
 */
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include',
  fetchOptions: {
    mode: 'cors',
  },
  headers: {
    'X-Client-Name': 'portfolio-web',
    'X-Client-Version': '1.0.0',
  },
});

/**
 * Error Link - Centralized error handling
 */
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      const { message, locations, path, extensions } = error;

      // Log error details
      console.error(
        `[GraphQL Error]: Message: ${message}`,
        '\nPath:',
        path,
        '\nLocations:',
        locations,
        '\nExtensions:',
        extensions
      );

      // Handle specific error codes
      switch (extensions?.code) {
        case 'UNAUTHENTICATED':
          // Redirect to login or refresh token
          if (!IS_SERVER) {
            // window.location.href = '/login';
            console.warn('Authentication required');
          }
          break;

        case 'FORBIDDEN':
          console.warn('Access forbidden');
          break;

        case 'RATE_LIMITED':
          console.warn('Rate limit exceeded. Please slow down.');
          break;

        case 'BAD_USER_INPUT':
          // Validation errors - let them propagate
          break;

        case 'NOT_FOUND':
          // Resource not found - let it propagate
          break;

        default:
          // Log unexpected errors
          if (IS_DEV) {
            console.error('Unexpected GraphQL error:', error);
          }
      }
    }
  }

  if (networkError) {
    console.error(
      `[Network Error]: ${networkError.message}`,
      '\nOperation:',
      operation.operationName
    );

    // Check for specific network error types
    if ('statusCode' in networkError) {
      const statusCode = (networkError as any).statusCode;

      switch (statusCode) {
        case 401:
          console.warn('Server returned 401 - Unauthorized');
          break;
        case 403:
          console.warn('Server returned 403 - Forbidden');
          break;
        case 500:
          console.error('Server error - Please try again later');
          break;
        case 503:
          console.error('Service unavailable - Please try again later');
          break;
      }
    }
  }
});

/**
 * Retry Link - Automatic retry with exponential backoff
 */
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: 3,
    retryIf: (error, operation) => {
      // Don't retry mutations (except idempotent ones)
      const isMutation = operation.query.definitions.some(
        (def) => def.kind === 'OperationDefinition' && def.operation === 'mutation'
      );

      // List of idempotent mutations that can be retried
      const idempotentMutations = ['trackPageView', 'trackProjectView', 'trackSkillView'];
      const operationName = operation.operationName;

      if (isMutation && !idempotentMutations.includes(operationName)) {
        return false;
      }

      // Don't retry client errors (4xx)
      if (error?.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
        return false;
      }

      // Retry network errors and server errors (5xx)
      return !!error;
    },
  },
});

/**
 * Persisted Queries Link - Reduce bandwidth & enable CDN caching
 * Uses SHA256 hash of query instead of full query text
 */
const persistedQueriesLink = createPersistedQueryLink({
  sha256,
  useGETForHashedQueries: true, // Use GET for CDN caching
});

/**
 * Logging Link - Development only
 */
const loggingLink = new ApolloLink((operation, forward) => {
  if (!IS_DEV) return forward(operation);

  const startTime = Date.now();
  const operationType = operation.query.definitions.find(
    (def) => def.kind === 'OperationDefinition'
  );

  console.log(
    `🚀 [GraphQL ${(operationType as any)?.operation || 'operation'}]: ${operation.operationName}`
  );

  return forward(operation).map((result) => {
    const duration = Date.now() - startTime;
    console.log(
      `✅ [GraphQL ${operation.operationName}]: Completed in ${duration}ms`,
      result.data ? '(with data)' : '(no data)'
    );
    return result;
  });
});

/**
 * Request ID Link - Add unique request ID for tracing
 */
const requestIdLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    },
  }));

  return forward(operation);
});

// ============================================================================
// CACHE INSTANCE
// ============================================================================

/**
 * Create InMemoryCache instance
 */
function createCache() {
  return new InMemoryCache({
    typePolicies,
    // Possible types for union/interface types
    possibleTypes: {
      // Add if you have union/interface types
      // SearchResult: ['Project', 'Skill'],
    },
  });
}

// ============================================================================
// CLIENT CREATION
// ============================================================================

let apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

/**
 * Create Apollo Client instance
 */
function createApolloClient() {
  // Build link chain
  const link = from([
    requestIdLink,
    loggingLink,
    errorLink,
    retryLink,
    persistedQueriesLink,
    httpLink,
  ]);

  return new ApolloClient({
    link,
    cache: createCache(),
    ssrMode: IS_SERVER,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: 'cache-first',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
    // Use new devtools and clientAwareness options (Apollo Client 3.14+)
    devtools: {
      enabled: IS_DEV && !IS_SERVER,
    },
    clientAwareness: {
      name: 'portfolio-web',
      version: '1.0.0',
    },
  });
}

/**
 * Initialize Apollo Client
 * - Server: Always create new client
 * - Client: Reuse existing or create new
 */
export function initializeApollo(initialState: NormalizedCacheObject | null = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // Hydrate cache with initial state from SSR
  if (initialState) {
    // Get existing cache and merge with incoming
    const existingCache = _apolloClient.extract();
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSR/SSG, always create new client
  if (IS_SERVER) return _apolloClient;

  // For client-side, reuse client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

/**
 * Get Apollo Client for use in hooks
 * Use this in components/pages
 */
export function getApolloClient() {
  return initializeApollo();
}

/**
 * Export a singleton client for simple use cases
 */
export const client = initializeApollo();

// ============================================================================
// SERVER COMPONENTS SUPPORT (Next.js 14)
// ============================================================================

/**
 * Create Apollo Client for React Server Components
 * Creates a new client per request to avoid data leaking between users
 */
function createServerClient() {
  return new ApolloClient({
    link: from([errorLink, retryLink, httpLink]),
    cache: createCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache', // Always fetch fresh data in RSC
        errorPolicy: 'all',
      },
    },
  });
}

/**
 * Get Apollo Client for server-side use
 * For React Server Components, creates a new client per request
 */
export function getServerClient() {
  return createServerClient();
}

// ============================================================================
// OPTIMISTIC RESPONSE HELPERS
// ============================================================================

/**
 * Generate optimistic response for view tracking
 */
export function optimisticViewResponse(currentViews: number) {
  return {
    __typename: 'TrackViewResponse',
    success: true,
    views: currentViews + 1,
  };
}

/**
 * Generate optimistic response for click tracking
 */
export function optimisticClickResponse(
  currentClicks: { github: number; live: number; demo: number },
  clickType: 'github' | 'live' | 'demo'
) {
  return {
    __typename: 'TrackClickResponse',
    success: true,
    clicks: {
      ...currentClicks,
      [clickType]: currentClicks[clickType] + 1,
    },
  };
}

/**
 * Generate optimistic response for score submission
 */
export function optimisticScoreResponse(input: {
  username: string;
  wpm: number;
  accuracy: number;
  score: number;
}) {
  return {
    __typename: 'SubmitScoreResponse',
    success: true,
    message: 'Score submitted!',
    entry: {
      __typename: 'LeaderboardEntry',
      id: `temp-${Date.now()}`,
      ...input,
      rank: null, // Will be determined by server
      createdAt: new Date().toISOString(),
    },
  };
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Evict all project-related queries from cache
 */
export function evictProjects() {
  client.cache.evict({ fieldName: 'projects' });
  client.cache.evict({ fieldName: 'featuredProjects' });
  client.cache.evict({ fieldName: 'searchProjects' });
  client.cache.gc();
}

/**
 * Evict all skill-related queries from cache
 */
export function evictSkills() {
  client.cache.evict({ fieldName: 'skills' });
  client.cache.gc();
}

/**
 * Evict leaderboard cache
 */
export function evictLeaderboard() {
  client.cache.evict({ fieldName: 'leaderboard' });
  client.cache.gc();
}

/**
 * Clear entire cache
 */
export async function clearCache() {
  await client.clearStore();
}

/**
 * Reset cache and refetch active queries
 */
export async function resetAndRefetch() {
  await client.resetStore();
}
