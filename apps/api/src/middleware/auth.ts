import { GraphQLError } from 'graphql';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/jwt';
import { getSession, updateSessionActivity } from '../utils/session';
import { logger } from '../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
  sessionId?: string;
}

export interface AuthContext {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
}

interface Request {
  headers: {
    authorization?: string;
    'x-session-id'?: string;
  };
}

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================

/**
 * Extract and verify user from request
 * Does not throw - returns null if not authenticated
 */
export async function getAuthContext(req: Request): Promise<AuthContext> {
  const authHeader = req.headers.authorization;
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return { user: null, isAuthenticated: false };
  }

  try {
    // Verify the access token
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return { user: null, isAuthenticated: false };
    }

    // Optional: Validate session if session ID provided
    const sessionId = req.headers['x-session-id'];
    if (sessionId) {
      const session = await getSession(sessionId);
      if (!session || session.userId !== decoded.userId) {
        logger.warn('Invalid session', { userId: decoded.userId });
        return { user: null, isAuthenticated: false };
      }

      // Update session activity
      await updateSessionActivity(sessionId);
    }

    return {
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        sessionId,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    logger.debug('Auth context extraction failed', { error });
    return { user: null, isAuthenticated: false };
  }
}

// ============================================================================
// AUTHORIZATION HELPERS
// ============================================================================

/**
 * Require authentication - throws if not authenticated
 */
export function requireAuth(context: AuthContext): AuthenticatedUser {
  if (!context.isAuthenticated || !context.user) {
    throw new GraphQLError('You must be logged in to perform this action', {
      extensions: { code: 'UNAUTHENTICATED' },
    });
  }

  return context.user;
}

/**
 * Require specific role(s)
 */
export function requireRole(
  context: AuthContext,
  allowedRoles: string | string[]
): AuthenticatedUser {
  const user = requireAuth(context);

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    throw new GraphQLError('You do not have permission to perform this action', {
      extensions: {
        code: 'FORBIDDEN',
        requiredRoles: roles,
        currentRole: user.role,
      },
    });
  }

  return user;
}

/**
 * Check if user has admin role
 */
export function requireAdmin(context: AuthContext): AuthenticatedUser {
  return requireRole(context, ['admin', 'super_admin']);
}

/**
 * Check if user has super admin role
 */
export function requireSuperAdmin(context: AuthContext): AuthenticatedUser {
  return requireRole(context, 'super_admin');
}

// ============================================================================
// RESOLVER WRAPPERS
// ============================================================================

type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: unknown
) => Promise<TResult> | TResult;

/**
 * Wrap a resolver to require authentication
 */
export function withAuth<TResult, TParent, TArgs>(
  resolver: ResolverFn<TResult, TParent, AuthContext & { user: AuthenticatedUser }, TArgs>
): ResolverFn<TResult, TParent, AuthContext, TArgs> {
  return async (parent, args, context, info) => {
    const user = requireAuth(context);
    return resolver(parent, args, { ...context, user }, info);
  };
}

/**
 * Wrap a resolver to require admin role
 */
export function withAdmin<TResult, TParent, TArgs>(
  resolver: ResolverFn<TResult, TParent, AuthContext & { user: AuthenticatedUser }, TArgs>
): ResolverFn<TResult, TParent, AuthContext, TArgs> {
  return async (parent, args, context, info) => {
    const user = requireAdmin(context);
    return resolver(parent, args, { ...context, user }, info);
  };
}

/**
 * Wrap a resolver to require super admin role
 */
export function withSuperAdmin<TResult, TParent, TArgs>(
  resolver: ResolverFn<TResult, TParent, AuthContext & { user: AuthenticatedUser }, TArgs>
): ResolverFn<TResult, TParent, AuthContext, TArgs> {
  return async (parent, args, context, info) => {
    const user = requireSuperAdmin(context);
    return resolver(parent, args, { ...context, user }, info);
  };
}

// ============================================================================
// DIRECTIVE-LIKE MIDDLEWARE
// ============================================================================

/**
 * Auth directive implementation for schema-level protection
 * Can be used with graphql-tools makeExecutableSchema
 */
export const authDirectiveTransformer = {
  auth: (fieldConfig: { resolve: ResolverFn<unknown, unknown, AuthContext, unknown> }) => {
    const { resolve = (parent: unknown) => parent } = fieldConfig;
    fieldConfig.resolve = withAuth(resolve);
    return fieldConfig;
  },

  admin: (fieldConfig: { resolve: ResolverFn<unknown, unknown, AuthContext, unknown> }) => {
    const { resolve = (parent: unknown) => parent } = fieldConfig;
    fieldConfig.resolve = withAdmin(resolve);
    return fieldConfig;
  },

  superAdmin: (fieldConfig: { resolve: ResolverFn<unknown, unknown, AuthContext, unknown> }) => {
    const { resolve = (parent: unknown) => parent } = fieldConfig;
    fieldConfig.resolve = withSuperAdmin(resolve);
    return fieldConfig;
  },
};
