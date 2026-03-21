import express, { Request, Response, NextFunction } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config, securityConfig } from './config';
import { connectDatabase } from './config/database';
import {
  connectRedis,
  warmCache,
  getCacheMetrics,
  disconnectRedis,
  isRedisConnected,
} from './config/redis';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { createLoaders } from './graphql/dataloaders';
import { Context } from './graphql/utils/auth';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// ============================================================================
// INPUT SANITIZATION
// ============================================================================

/**
 * Sanitize string input to prevent XSS attacks
 */
function sanitizeString(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Express middleware to sanitize request body
 */
function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    // Don't sanitize GraphQL queries/variables - they're validated separately
    // Only sanitize if it's a regular REST endpoint
    if (!req.path.includes('/graphql')) {
      req.body = sanitizeObject(req.body);
    }
  }
  next();
}

// ============================================================================
// RATE LIMITERS
// ============================================================================

/**
 * General API rate limiter: 100 requests per 15 minutes
 */
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown'
    );
  },
});

/**
 * GraphQL rate limiter: 200 requests per 15 minutes
 */
const graphqlLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.graphqlMax,
  message: { error: 'Too many GraphQL requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      'unknown'
    );
  },
});

/**
 * Search rate limiter: 30 requests per minute
 */
const searchLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: config.rateLimit.searchPerMin,
  message: { error: 'Too many search requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Only apply to search queries
    const body = req.body as { query?: string };
    return !body?.query?.includes('search');
  },
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function startServer() {
  try {
    const serverStart = Date.now();

    // Connect to databases with timing
    const dbStart = Date.now();
    await connectDatabase();
    logger.info(`⏱️ MongoDB connection: ${Date.now() - dbStart}ms`);

    const redisStart = Date.now();
    await connectRedis();
    logger.info(`⏱️ Redis connection: ${Date.now() - redisStart}ms`);

    // Warm cache after connections are established
    const cacheStart = Date.now();
    await warmCache();
    logger.info(`⏱️ Cache warming: ${Date.now() - cacheStart}ms`);

    logger.info(`⏱️ Total startup initialization: ${Date.now() - serverStart}ms`);

    const app = express();

    // ========================================
    // SECURITY MIDDLEWARE
    // ========================================

    // Helmet with full security configuration
    if (config.isProduction) {
      app.use(helmet(securityConfig.helmet));
    } else {
      // Relaxed settings for development
      app.use(
        helmet({
          contentSecurityPolicy: false, // Disable CSP for GraphQL Playground
          crossOriginEmbedderPolicy: false,
        })
      );
    }

    // Trust proxy (for accurate IP detection behind reverse proxy)
    app.set('trust proxy', 1);

    // Compression
    app.use(compression());

    // Cookie parsing
    app.use(cookieParser());

    // CORS with enhanced configuration
    app.use(cors(config.isProduction ? securityConfig.cors : { origin: true, credentials: true }));

    // Body parsing with size limits
    app.use(express.json({ limit: '10kb' })); // Limit JSON body size
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Input sanitization
    app.use(sanitizeMiddleware);

    // ========================================
    // RATE LIMITING
    // ========================================

    // Apply general rate limit to all routes
    app.use(generalLimiter);

    // Apply GraphQL-specific rate limit
    app.use('/graphql', graphqlLimiter);

    // Apply search-specific rate limit
    app.use('/graphql', searchLimiter);

    // ========================================
    // HEALTH & MONITORING ENDPOINTS
    // ========================================

    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        redis: isRedisConnected() ? 'connected' : 'disconnected',
      });
    });

    // Cache metrics endpoint (protected in production)
    app.get('/metrics/cache', (_req, res) => {
      if (config.isProduction) {
        // In production, require auth header
        // TODO: Implement proper auth
        return res.status(403).json({ error: 'Forbidden' });
      }
      res.json(getCacheMetrics());
    });

    // ========================================
    // APOLLO SERVER
    // ========================================

    const apolloServer = new ApolloServer<Context>({
      typeDefs,
      resolvers,
      formatError: (error) => {
        // Log error server-side
        logger.error('GraphQL Error:', {
          message: error.message,
          path: error.path,
          extensions: error.extensions,
        });

        // In production, hide internal error details
        if (config.isProduction && error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
          return {
            message: 'An unexpected error occurred',
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
          };
        }

        return error;
      },
      introspection: config.features.enableIntrospection,
      plugins: [
        // Request timing plugin
        {
          async requestDidStart() {
            const start = Date.now();
            return {
              async willSendResponse(requestContext) {
                const duration = Date.now() - start;
                const opName = requestContext.request.operationName || 'anonymous';
                // Log slow queries prominently
                if (duration > 1000) {
                  logger.warn(`🐢 SLOW GraphQL: ${opName} took ${duration}ms`);
                } else {
                  logger.debug(`GraphQL: ${opName} completed in ${duration}ms`);
                }
              },
            };
          },
        },
      ],
    });

    await apolloServer.start();

    // Apply Apollo middleware
    app.use(
      '/graphql',
      expressMiddleware(apolloServer, {
        context: async ({ req, res }): Promise<Context> => {
          // Extract IP address (trust proxy)
          const ip =
            (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
            req.socket.remoteAddress ||
            'unknown';

          // Extract user agent
          const userAgent = req.headers['user-agent'] || 'unknown';

          // Create DataLoaders for this request
          const loaders = createLoaders();

          // TODO: Add JWT authentication logic here
          const user = null;

          return {
            user,
            req,
            res,
            ip,
            userAgent,
            loaders,
          };
        },
      })
    );

    // ========================================
    // ERROR HANDLING
    // ========================================

    app.use(errorHandler);

    // 404 handler
    app.use((_req, res) => {
      res.status(404).json({ error: 'Not Found' });
    });

    // ========================================
    // START SERVER
    // ========================================

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server ready at http://localhost:${config.port}/graphql`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
      logger.info(`🔒 CORS origin: ${JSON.stringify(config.corsOrigin)}`);
      logger.info(`⚡ Rate limits: ${config.rateLimit.maxRequests}/${config.rateLimit.windowMs}ms`);
    });

    // ========================================
    // GRACEFUL SHUTDOWN
    // ========================================

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, starting graceful shutdown...`);

      // Stop accepting new connections
      server.close(async () => {
        logger.info('HTTP server closed');

        // Close Redis connection
        await disconnectRedis();

        // Close MongoDB connection
        const mongoose = await import('mongoose');
        await mongoose.default.connection.close();
        logger.info('MongoDB connection closed');

        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// ============================================================================
// GLOBAL ERROR HANDLERS
// ============================================================================

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();
