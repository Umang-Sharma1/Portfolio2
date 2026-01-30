import { getRedisClient, isRedisConnected } from '../config/redis';
import { logger } from './logger';
import crypto from 'crypto';

// ============================================================================
// CONSTANTS
// ============================================================================

const SESSION_PREFIX = 'session:';
const REFRESH_TOKEN_PREFIX = 'refresh:';
const LOGIN_ATTEMPTS_PREFIX = 'login_attempts:';
const IP_BLACKLIST_PREFIX = 'ip_blacklist:';

const SESSION_TTL = 15 * 60; // 15 minutes (matches access token)
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60; // 7 days
const REFRESH_TOKEN_TTL_REMEMBER = 30 * 24 * 60 * 60; // 30 days
const LOGIN_ATTEMPTS_TTL = 15 * 60; // 15 minutes
const IP_BLACKLIST_TTL = 60 * 60; // 1 hour

const MAX_LOGIN_ATTEMPTS = 5;
const MAX_IP_FAILURES = 10; // Block IP after this many failures across all accounts

// Helper to get redis client
const getClient = () => {
  try {
    return getRedisClient();
  } catch {
    return null;
  }
};

// ============================================================================
// TYPES
// ============================================================================

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  ip: string;
  userAgent: string;
  createdAt: number;
  lastActivity: number;
}

export interface LoginAttemptData {
  attempts: number;
  lastAttempt: number;
  ips: string[];
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  data: Omit<SessionData, 'createdAt' | 'lastActivity'>
): Promise<string> {
  const client = getClient();
  if (!client || !isRedisConnected()) {
    logger.warn('Redis not connected, session not stored');
    return userId;
  }

  const sessionId = crypto.randomBytes(32).toString('hex');
  const sessionData: SessionData = {
    ...data,
    createdAt: Date.now(),
    lastActivity: Date.now(),
  };

  try {
    await client.setEx(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(sessionData));

    logger.debug('Session created', { sessionId: sessionId.slice(0, 8), userId });
    return sessionId;
  } catch (error) {
    logger.error('Failed to create session', { error });
    throw error;
  }
}

/**
 * Get session data
 */
export async function getSession(sessionId: string): Promise<SessionData | null> {
  const client = getClient();
  if (!client || !isRedisConnected()) {
    return null;
  }

  try {
    const data = await client.get(`${SESSION_PREFIX}${sessionId}`);
    if (!data) return null;

    return JSON.parse(data) as SessionData;
  } catch (error) {
    logger.error('Failed to get session', { error });
    return null;
  }
}

/**
 * Update session last activity
 */
export async function updateSessionActivity(sessionId: string): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  try {
    const session = await getSession(sessionId);
    if (!session) return;

    session.lastActivity = Date.now();

    await client.setEx(`${SESSION_PREFIX}${sessionId}`, SESSION_TTL, JSON.stringify(session));
  } catch (error) {
    logger.error('Failed to update session activity', { error });
  }
}

/**
 * Delete a session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  try {
    await client.del(`${SESSION_PREFIX}${sessionId}`);
    logger.debug('Session deleted', { sessionId: sessionId.slice(0, 8) });
  } catch (error) {
    logger.error('Failed to delete session', { error });
  }
}

/**
 * Delete all sessions for a user
 */
export async function deleteAllUserSessions(userId: string): Promise<number> {
  const client = getClient();
  if (!client || !isRedisConnected()) return 0;

  try {
    const keys = await client.keys(`${SESSION_PREFIX}*`);
    let deleted = 0;

    for (const key of keys) {
      const data = await client.get(key);
      if (data) {
        const session = JSON.parse(data) as SessionData;
        if (session.userId === userId) {
          await client.del(key);
          deleted++;
        }
      }
    }

    logger.info('User sessions deleted', { userId, count: deleted });
    return deleted;
  } catch (error) {
    logger.error('Failed to delete user sessions', { error });
    return 0;
  }
}

// ============================================================================
// REFRESH TOKEN STORAGE
// ============================================================================

/**
 * Store refresh token
 */
export async function storeRefreshToken(
  userId: string,
  tokenHash: string,
  rememberMe: boolean = false
): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  const ttl = rememberMe ? REFRESH_TOKEN_TTL_REMEMBER : REFRESH_TOKEN_TTL;

  try {
    await client.setEx(
      `${REFRESH_TOKEN_PREFIX}${tokenHash}`,
      ttl,
      JSON.stringify({
        userId,
        createdAt: Date.now(),
        rememberMe,
      })
    );
  } catch (error) {
    logger.error('Failed to store refresh token', { error });
  }
}

/**
 * Validate refresh token exists in Redis
 */
export async function validateRefreshToken(tokenHash: string): Promise<string | null> {
  const client = getClient();
  if (!client || !isRedisConnected()) return null;

  try {
    const data = await client.get(`${REFRESH_TOKEN_PREFIX}${tokenHash}`);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return parsed.userId;
  } catch (error) {
    logger.error('Failed to validate refresh token', { error });
    return null;
  }
}

/**
 * Revoke refresh token
 */
export async function revokeRefreshToken(tokenHash: string): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  try {
    await client.del(`${REFRESH_TOKEN_PREFIX}${tokenHash}`);
  } catch (error) {
    logger.error('Failed to revoke refresh token', { error });
  }
}

/**
 * Revoke all refresh tokens for a user
 */
export async function revokeAllRefreshTokens(userId: string): Promise<number> {
  const client = getClient();
  if (!client || !isRedisConnected()) return 0;

  try {
    const keys = await client.keys(`${REFRESH_TOKEN_PREFIX}*`);
    let revoked = 0;

    for (const key of keys) {
      const data = await client.get(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.userId === userId) {
          await client.del(key);
          revoked++;
        }
      }
    }

    return revoked;
  } catch (error) {
    logger.error('Failed to revoke all refresh tokens', { error });
    return 0;
  }
}

/**
 * Hash a token for storage
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// ============================================================================
// RATE LIMITING & BRUTE FORCE PROTECTION
// ============================================================================

/**
 * Record a login attempt
 */
export async function recordLoginAttempt(
  email: string,
  ip: string,
  success: boolean
): Promise<{ blocked: boolean; attemptsRemaining: number }> {
  const client = getClient();
  if (!client || !isRedisConnected()) {
    return { blocked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS };
  }

  const key = `${LOGIN_ATTEMPTS_PREFIX}${email.toLowerCase()}`;

  try {
    if (success) {
      // Clear attempts on successful login
      await client.del(key);
      return { blocked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS };
    }

    // Get current attempts
    const data = await client.get(key);
    let attemptData: LoginAttemptData = data
      ? JSON.parse(data)
      : { attempts: 0, lastAttempt: 0, ips: [] };

    // Increment attempts
    attemptData.attempts++;
    attemptData.lastAttempt = Date.now();
    if (!attemptData.ips.includes(ip)) {
      attemptData.ips.push(ip);
    }

    // Store updated data
    await client.setEx(key, LOGIN_ATTEMPTS_TTL, JSON.stringify(attemptData));

    // Check if blocked
    const blocked = attemptData.attempts >= MAX_LOGIN_ATTEMPTS;
    const attemptsRemaining = Math.max(0, MAX_LOGIN_ATTEMPTS - attemptData.attempts);

    // Also track IP-level failures
    await recordIpFailure(ip);

    logger.warn('Failed login attempt', {
      email: email.slice(0, 3) + '***',
      ip,
      attempts: attemptData.attempts,
      blocked,
    });

    return { blocked, attemptsRemaining };
  } catch (error) {
    logger.error('Failed to record login attempt', { error });
    return { blocked: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS };
  }
}

/**
 * Check if an account is rate limited
 */
export async function isAccountRateLimited(email: string): Promise<{
  limited: boolean;
  attemptsRemaining: number;
  retryAfter: number;
}> {
  const client = getClient();
  if (!client || !isRedisConnected()) {
    return { limited: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS, retryAfter: 0 };
  }

  const key = `${LOGIN_ATTEMPTS_PREFIX}${email.toLowerCase()}`;

  try {
    const data = await client.get(key);
    if (!data) {
      return { limited: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS, retryAfter: 0 };
    }

    const attemptData: LoginAttemptData = JSON.parse(data);
    const limited = attemptData.attempts >= MAX_LOGIN_ATTEMPTS;
    const attemptsRemaining = Math.max(0, MAX_LOGIN_ATTEMPTS - attemptData.attempts);

    // Calculate retry after
    let retryAfter = 0;
    if (limited) {
      const ttl = await client.ttl(key);
      retryAfter = ttl > 0 ? ttl : LOGIN_ATTEMPTS_TTL;
    }

    return { limited, attemptsRemaining, retryAfter };
  } catch (error) {
    logger.error('Failed to check rate limit', { error });
    return { limited: false, attemptsRemaining: MAX_LOGIN_ATTEMPTS, retryAfter: 0 };
  }
}

/**
 * Record IP-level failure
 */
async function recordIpFailure(ip: string): Promise<void> {
  const client = getClient();
  if (!client) return;

  const key = `${IP_BLACKLIST_PREFIX}failures:${ip}`;

  try {
    const failures = await client.incr(key);
    await client.expire(key, IP_BLACKLIST_TTL);

    if (failures >= MAX_IP_FAILURES) {
      await blacklistIp(ip);
    }
  } catch (error) {
    logger.error('Failed to record IP failure', { error });
  }
}

/**
 * Blacklist an IP address
 */
export async function blacklistIp(ip: string): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  const key = `${IP_BLACKLIST_PREFIX}blocked:${ip}`;

  try {
    await client.setEx(
      key,
      IP_BLACKLIST_TTL,
      JSON.stringify({
        blockedAt: Date.now(),
        reason: 'Too many failed login attempts',
      })
    );

    logger.warn('IP blacklisted', { ip });
  } catch (error) {
    logger.error('Failed to blacklist IP', { error });
  }
}

/**
 * Check if IP is blacklisted
 */
export async function isIpBlacklisted(ip: string): Promise<boolean> {
  const client = getClient();
  if (!client || !isRedisConnected()) return false;

  const key = `${IP_BLACKLIST_PREFIX}blocked:${ip}`;

  try {
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error('Failed to check IP blacklist', { error });
    return false;
  }
}

// ============================================================================
// LOGIN AUDIT LOG
// ============================================================================

const LOGIN_LOG_PREFIX = 'login_log:';
const LOGIN_LOG_TTL = 30 * 24 * 60 * 60; // 30 days

export interface LoginLogEntry {
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  timestamp: number;
}

/**
 * Log a login attempt
 */
export async function logLoginAttempt(entry: LoginLogEntry): Promise<void> {
  const client = getClient();
  if (!client || !isRedisConnected()) return;

  const key = `${LOGIN_LOG_PREFIX}${Date.now()}:${crypto.randomBytes(4).toString('hex')}`;

  try {
    await client.setEx(key, LOGIN_LOG_TTL, JSON.stringify(entry));
  } catch (error) {
    logger.error('Failed to log login attempt', { error });
  }
}

/**
 * Get recent login attempts for an account
 */
export async function getRecentLoginAttempts(
  email: string,
  limit: number = 10
): Promise<LoginLogEntry[]> {
  const client = getClient();
  if (!client || !isRedisConnected()) return [];

  try {
    const keys = await client.keys(`${LOGIN_LOG_PREFIX}*`);
    const entries: LoginLogEntry[] = [];

    for (const key of keys) {
      const data = await client.get(key);
      if (data) {
        const entry = JSON.parse(data) as LoginLogEntry;
        if (entry.email.toLowerCase() === email.toLowerCase()) {
          entries.push(entry);
        }
      }
    }

    // Sort by timestamp descending and limit
    return entries.sort((a, b) => b.timestamp - a.timestamp).slice(0, limit);
  } catch (error) {
    logger.error('Failed to get login attempts', { error });
    return [];
  }
}
