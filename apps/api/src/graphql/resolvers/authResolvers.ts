import { GraphQLError } from 'graphql';
import { Admin, IAdmin } from '../../models/Admin';
import {
  generateTokenPair,
  verifyRefreshToken,
  extractTokenFromHeader,
  verifyAccessToken,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS_REMEMBER,
  CLEAR_COOKIE_OPTIONS,
} from '../../utils/jwt';
import {
  createSession,
  deleteSession,
  deleteAllUserSessions,
  storeRefreshToken,
  validateRefreshToken,
  revokeRefreshToken,
  revokeAllRefreshTokens,
  hashToken,
  recordLoginAttempt,
  isAccountRateLimited,
  isIpBlacklisted,
  logLoginAttempt,
} from '../../utils/session';
import { logger } from '../../utils/logger';

// ============================================================================
// TYPES
// ============================================================================

interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expiresIn?: number;
  message?: string;
}

interface Context {
  req: {
    headers: {
      authorization?: string;
      'x-forwarded-for'?: string;
      'user-agent'?: string;
    };
    ip?: string;
    cookies?: Record<string, string>;
  };
  res: {
    cookie: (name: string, value: string, options: Record<string, unknown>) => void;
    clearCookie: (name: string, options: Record<string, unknown>) => void;
  };
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getClientIp(req: Context['req']): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || '0.0.0.0';
}

function getUserAgent(req: Context['req']): string {
  return req.headers['user-agent'] || 'Unknown';
}

// ============================================================================
// RESOLVERS
// ============================================================================

export const authResolvers = {
  Mutation: {
    /**
     * Admin login
     */
    adminLogin: async (
      _: unknown,
      { input }: { input: LoginInput },
      context: Context
    ): Promise<AuthResponse> => {
      const { email, password, rememberMe = false } = input;
      const ip = getClientIp(context.req);
      const userAgent = getUserAgent(context.req);

      logger.info('Login attempt', { email: email.slice(0, 3) + '***', ip });

      try {
        // Check if IP is blacklisted
        if (await isIpBlacklisted(ip)) {
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'IP blacklisted',
            timestamp: Date.now(),
          });

          throw new GraphQLError('Too many failed attempts. Please try again later.', {
            extensions: { code: 'IP_BLOCKED' },
          });
        }

        // Check account rate limit
        const rateLimit = await isAccountRateLimited(email);
        if (rateLimit.limited) {
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'Account rate limited',
            timestamp: Date.now(),
          });

          throw new GraphQLError(
            `Account temporarily locked. Try again in ${Math.ceil(rateLimit.retryAfter / 60)} minutes.`,
            {
              extensions: {
                code: 'RATE_LIMITED',
                retryAfter: rateLimit.retryAfter,
              },
            }
          );
        }

        // Find admin by email (includes password)
        const admin = await Admin.findByEmail(email);

        if (!admin) {
          await recordLoginAttempt(email, ip, false);
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'User not found',
            timestamp: Date.now(),
          });

          throw new GraphQLError('Invalid email or password', {
            extensions: { code: 'INVALID_CREDENTIALS' },
          });
        }

        // Check if account is active
        if (!admin.isActive) {
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'Account disabled',
            timestamp: Date.now(),
          });

          throw new GraphQLError('Account has been disabled. Contact support.', {
            extensions: { code: 'ACCOUNT_DISABLED' },
          });
        }

        // Check if account is locked (from database-level locking)
        if (admin.isLocked()) {
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'Account locked',
            timestamp: Date.now(),
          });

          throw new GraphQLError('Account is temporarily locked. Try again later.', {
            extensions: { code: 'ACCOUNT_LOCKED' },
          });
        }

        // Verify password
        const isValidPassword = await admin.comparePassword(password);

        if (!isValidPassword) {
          await admin.incrementLoginAttempts();
          await recordLoginAttempt(email, ip, false);
          await logLoginAttempt({
            email,
            ip,
            userAgent,
            success: false,
            failureReason: 'Invalid password',
            timestamp: Date.now(),
          });

          const remainingAttempts = Math.max(0, 5 - (admin.loginAttempts + 1));

          throw new GraphQLError(
            remainingAttempts > 0
              ? `Invalid password. ${remainingAttempts} attempts remaining.`
              : 'Account locked due to too many failed attempts.',
            {
              extensions: {
                code: 'INVALID_CREDENTIALS',
                attemptsRemaining: remainingAttempts,
              },
            }
          );
        }

        // Successful login - reset attempts
        await admin.resetLoginAttempts();
        await recordLoginAttempt(email, ip, true);

        // Generate tokens
        const tokenPayload = {
          userId: admin._id.toString(),
          email: admin.email,
          role: admin.role,
        };

        const tokens = generateTokenPair(tokenPayload, rememberMe);

        // Store refresh token in Redis
        const refreshTokenHash = hashToken(tokens.refreshToken);
        await storeRefreshToken(admin._id.toString(), refreshTokenHash, rememberMe);

        // Create session
        await createSession(admin._id.toString(), {
          userId: admin._id.toString(),
          email: admin.email,
          role: admin.role,
          ip,
          userAgent,
        });

        // Set refresh token in httpOnly cookie
        context.res.cookie(
          'refreshToken',
          tokens.refreshToken,
          rememberMe ? REFRESH_TOKEN_COOKIE_OPTIONS_REMEMBER : REFRESH_TOKEN_COOKIE_OPTIONS
        );

        // Log successful login
        await logLoginAttempt({
          email,
          ip,
          userAgent,
          success: true,
          timestamp: Date.now(),
        });

        logger.info('Login successful', { userId: admin._id, email: admin.email });

        return {
          success: true,
          token: tokens.accessToken,
          user: {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
          expiresIn: Math.floor((tokens.accessTokenExpires - Date.now()) / 1000),
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }

        logger.error('Login error', { error });
        throw new GraphQLError('An error occurred during login', {
          extensions: { code: 'INTERNAL_ERROR' },
        });
      }
    },

    /**
     * Admin logout
     */
    adminLogout: async (_: unknown, __: unknown, context: Context): Promise<boolean> => {
      try {
        // Get refresh token from cookie
        const refreshToken = context.req.cookies?.refreshToken;

        if (refreshToken) {
          // Revoke the refresh token
          const tokenHash = hashToken(refreshToken);
          await revokeRefreshToken(tokenHash);
        }

        // Get user from context (if authenticated)
        if (context.user) {
          // Delete session
          await deleteSession(context.user.userId);
        }

        // Clear the refresh token cookie
        context.res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);

        logger.info('Logout successful', { userId: context.user?.userId });

        return true;
      } catch (error) {
        logger.error('Logout error', { error });
        return false;
      }
    },

    /**
     * Logout from all devices
     */
    adminLogoutAll: async (_: unknown, __: unknown, context: Context): Promise<boolean> => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      try {
        // Revoke all refresh tokens
        await revokeAllRefreshTokens(context.user.userId);

        // Delete all sessions
        await deleteAllUserSessions(context.user.userId);

        // Clear current refresh token cookie
        context.res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);

        logger.info('Logout all successful', { userId: context.user.userId });

        return true;
      } catch (error) {
        logger.error('Logout all error', { error });
        return false;
      }
    },

    /**
     * Refresh access token
     */
    refreshToken: async (_: unknown, __: unknown, context: Context): Promise<AuthResponse> => {
      const refreshToken = context.req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new GraphQLError('No refresh token provided', {
          extensions: { code: 'NO_REFRESH_TOKEN' },
        });
      }

      try {
        // Verify the refresh token JWT
        const decoded = verifyRefreshToken(refreshToken);

        if (!decoded) {
          context.res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);
          throw new GraphQLError('Invalid or expired refresh token', {
            extensions: { code: 'INVALID_REFRESH_TOKEN' },
          });
        }

        // Validate refresh token exists in Redis
        const tokenHash = hashToken(refreshToken);
        const storedUserId = await validateRefreshToken(tokenHash);

        if (!storedUserId || storedUserId !== decoded.userId) {
          context.res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);
          throw new GraphQLError('Refresh token has been revoked', {
            extensions: { code: 'TOKEN_REVOKED' },
          });
        }

        // Get admin from database
        const admin = await Admin.findById(decoded.userId);

        if (!admin || !admin.isActive) {
          context.res.clearCookie('refreshToken', CLEAR_COOKIE_OPTIONS);
          throw new GraphQLError('User not found or inactive', {
            extensions: { code: 'USER_NOT_FOUND' },
          });
        }

        // Revoke old refresh token
        await revokeRefreshToken(tokenHash);

        // Generate new tokens
        const tokenPayload = {
          userId: admin._id.toString(),
          email: admin.email,
          role: admin.role,
        };

        const tokens = generateTokenPair(tokenPayload);

        // Store new refresh token
        const newTokenHash = hashToken(tokens.refreshToken);
        await storeRefreshToken(admin._id.toString(), newTokenHash);

        // Update cookie
        context.res.cookie('refreshToken', tokens.refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        logger.debug('Token refreshed', { userId: admin._id });

        return {
          success: true,
          token: tokens.accessToken,
          user: {
            id: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
          expiresIn: Math.floor((tokens.accessTokenExpires - Date.now()) / 1000),
        };
      } catch (error) {
        if (error instanceof GraphQLError) {
          throw error;
        }

        logger.error('Token refresh error', { error });
        throw new GraphQLError('Failed to refresh token', {
          extensions: { code: 'REFRESH_FAILED' },
        });
      }
    },

    /**
     * Get current authenticated user
     */
    me: async (_: unknown, __: unknown, context: Context): Promise<AuthResponse['user'] | null> => {
      if (!context.user) {
        return null;
      }

      try {
        const admin = await Admin.findById(context.user.userId);

        if (!admin) {
          return null;
        }

        return {
          id: admin._id.toString(),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        };
      } catch (error) {
        logger.error('Get me error', { error });
        return null;
      }
    },
  },

  Query: {
    /**
     * Check authentication status
     */
    isAuthenticated: async (_: unknown, __: unknown, context: Context): Promise<boolean> => {
      return !!context.user;
    },

    /**
     * Get current user (requires auth)
     */
    currentUser: async (
      _: unknown,
      __: unknown,
      context: Context
    ): Promise<AuthResponse['user']> => {
      if (!context.user) {
        throw new GraphQLError('Not authenticated', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }

      const admin = await Admin.findById(context.user.userId);

      if (!admin) {
        throw new GraphQLError('User not found', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      }

      return {
        id: admin._id.toString(),
        email: admin.email,
        name: admin.name,
        role: admin.role,
      };
    },
  },
};

export default authResolvers;
