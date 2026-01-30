import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { logger } from './logger';
import crypto from 'crypto';

// ============================================================================
// TYPES
// ============================================================================

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

export interface DecodedToken extends JwtPayload, TokenPayload {
  iat: number;
  exp: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  refreshTokenExpires: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const JWT_SECRET = config.jwt.secret;
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days
const REFRESH_TOKEN_EXPIRY_REMEMBER = '30d'; // 30 days with remember me

// ============================================================================
// TOKEN GENERATION
// ============================================================================

/**
 * Generate an access token (short-lived)
 */
export function generateAccessToken(payload: Omit<TokenPayload, 'type'>): string {
  const tokenPayload: TokenPayload = {
    ...payload,
    type: 'access',
  };

  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    issuer: 'portfolio-api',
    audience: 'portfolio-admin',
    algorithm: 'HS256',
  };

  return jwt.sign(tokenPayload, JWT_SECRET, options);
}

/**
 * Generate a refresh token (long-lived)
 */
export function generateRefreshToken(
  payload: Omit<TokenPayload, 'type'>,
  rememberMe: boolean = false
): string {
  const tokenPayload: TokenPayload = {
    ...payload,
    type: 'refresh',
  };

  const options: SignOptions = {
    expiresIn: rememberMe ? REFRESH_TOKEN_EXPIRY_REMEMBER : REFRESH_TOKEN_EXPIRY,
    issuer: 'portfolio-api',
    audience: 'portfolio-admin',
    algorithm: 'HS256',
  };

  return jwt.sign(tokenPayload, JWT_SECRET, options);
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(
  payload: Omit<TokenPayload, 'type'>,
  rememberMe: boolean = false
): TokenPair {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload, rememberMe);

  // Calculate expiry times
  const decodedAccess = jwt.decode(accessToken) as DecodedToken;
  const decodedRefresh = jwt.decode(refreshToken) as DecodedToken;

  return {
    accessToken,
    refreshToken,
    accessTokenExpires: decodedAccess.exp * 1000, // Convert to milliseconds
    refreshTokenExpires: decodedRefresh.exp * 1000,
  };
}

// ============================================================================
// TOKEN VERIFICATION
// ============================================================================

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'portfolio-api',
      audience: 'portfolio-admin',
      algorithms: ['HS256'],
    }) as DecodedToken;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug('Invalid token', { error: error.message });
    }
    return null;
  }
}

/**
 * Verify specifically an access token
 */
export function verifyAccessToken(token: string): DecodedToken | null {
  const decoded = verifyToken(token);

  if (!decoded || decoded.type !== 'access') {
    return null;
  }

  return decoded;
}

/**
 * Verify specifically a refresh token
 */
export function verifyRefreshToken(token: string): DecodedToken | null {
  const decoded = verifyToken(token);

  if (!decoded || decoded.type !== 'refresh') {
    return null;
  }

  return decoded;
}

// ============================================================================
// TOKEN UTILITIES
// ============================================================================

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }

  return parts[1];
}

/**
 * Check if a token is about to expire (within 5 minutes)
 */
export function isTokenExpiringSoon(token: string): boolean {
  const decoded = verifyToken(token);
  if (!decoded) return true;

  const expiresAt = decoded.exp * 1000;
  const fiveMinutes = 5 * 60 * 1000;

  return Date.now() + fiveMinutes >= expiresAt;
}

/**
 * Get remaining time until token expires (in seconds)
 */
export function getTokenRemainingTime(token: string): number {
  const decoded = verifyToken(token);
  if (!decoded) return 0;

  const expiresAt = decoded.exp * 1000;
  const remaining = Math.max(0, expiresAt - Date.now());

  return Math.floor(remaining / 1000);
}

/**
 * Generate a secure random token for CSRF protection
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a unique token ID for tracking
 */
export function generateTokenId(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ============================================================================
// COOKIE CONFIGURATION
// ============================================================================

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'strict' as const,
  path: '/graphql', // Only send with GraphQL requests
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const REFRESH_TOKEN_COOKIE_OPTIONS_REMEMBER = {
  ...REFRESH_TOKEN_COOKIE_OPTIONS,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: 'strict' as const,
  path: '/graphql',
  maxAge: 0,
};
