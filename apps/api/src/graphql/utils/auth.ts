import { GraphQLError } from 'graphql';
import { AuthenticationError, AuthorizationError } from './errors';

/**
 * Authentication and Authorization Utilities
 */

export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
  name?: string;
}

export interface Context {
  user: User | null;
  ip: string;
  userAgent: string;
  loaders: any;
  req: any;
  res: any;
}

/**
 * Check if user is authenticated
 */
export const requireAuth = (context: Context): User => {
  if (!context.user) {
    throw new AuthenticationError('You must be logged in to perform this action');
  }
  return context.user;
};

/**
 * Check if user has required role
 */
export const requireRole = (context: Context, requiredRole: 'USER' | 'ADMIN'): User => {
  const user = requireAuth(context);

  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    throw new AuthorizationError('You do not have permission to perform this action');
  }

  return user;
};

/**
 * GraphQL Directive for Authentication
 * Usage: @auth(requires: ADMIN) on field definition
 */
export const authDirective = (next: any, source: any, args: any, context: Context) => {
  const requiredRole = args.requires || 'USER';

  requireRole(context, requiredRole);

  return next(source, args, context);
};

/**
 * Extract user from request
 * This is a placeholder - implement your actual authentication logic
 */
export const getUserFromToken = (token: string | undefined): User | null => {
  if (!token) return null;

  try {
    // TODO: Replace with actual JWT verification
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // return { id: decoded.id, email: decoded.email, role: decoded.role };

    // For development: Check for admin token
    if (token === process.env.ADMIN_TOKEN) {
      return {
        id: 'admin',
        email: 'admin@portfolio.com',
        role: 'ADMIN',
        name: 'Admin User',
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to extract authentication from request
 */
export const getUser = (req: any): User | null => {
  // Check Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  // Extract token (format: "Bearer <token>")
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  return getUserFromToken(token);
};

/**
 * Get client IP address
 */
export const getClientIp = (req: any): string => {
  return (
    req.ip ||
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    'unknown'
  );
};

/**
 * Get user agent
 */
export const getUserAgent = (req: any): string => {
  return req.headers['user-agent'] || 'unknown';
};

/**
 * Build GraphQL context with authentication
 */
export const buildContext = async ({ req, res }: any, loaders: any): Promise<Context> => {
  return {
    user: getUser(req),
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
    loaders,
    req,
    res,
  };
};

/**
 * Authentication Setup Instructions:
 *
 * 1. Install dependencies:
 *    npm install jsonwebtoken @types/jsonwebtoken
 *
 * 2. Add to .env:
 *    JWT_SECRET=your-secret-key-here
 *    ADMIN_TOKEN=your-admin-token-here (for development)
 *
 * 3. Implement login mutation (create separate auth resolver):
 *    mutation {
 *      login(email: "admin@portfolio.com", password: "password") {
 *        token
 *        user { id email role }
 *      }
 *    }
 *
 * 4. Replace getUserFromToken() with actual JWT verification:
 *    import jwt from 'jsonwebtoken';
 *    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
 *
 * 5. Use in GraphQL requests:
 *    Headers: { "Authorization": "Bearer <token>" }
 *
 * 6. Protected queries/mutations will automatically check auth:
 *    query {
 *      contactMessages { ... }  # Requires ADMIN role
 *    }
 */
