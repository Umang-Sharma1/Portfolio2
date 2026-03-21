import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ============================================================================
// ENVIRONMENT VARIABLE SCHEMA
// ============================================================================

/**
 * Zod schema for environment variable validation
 * Validates all required and optional env vars on startup
 */
const envSchema = z.object({
  // Required
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  PORT: z.coerce.number().min(1000).max(65535).default(4000),

  // Database
  MONGODB_URI: z.string().url().default('mongodb://localhost:27017/portfolio'),

  // Redis
  REDIS_URL: z.string().url().default('redis://localhost:6379'),

  // CORS - Can be a single origin or comma-separated list
  CORS_ORIGIN: z
    .string()
    .default('http://localhost:3000')
    .transform((val) => {
      const origins = val.split(',').map((o) => o.trim());
      return origins.length === 1 ? origins[0] : origins;
    }),

  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().min(1000).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1).max(10000).default(100),

  // GraphQL Rate Limiting
  GRAPHQL_RATE_LIMIT_MAX: z.coerce.number().min(1).max(10000).default(200),

  // Contact Form Rate Limiting
  CONTACT_RATE_LIMIT_PER_HOUR: z.coerce.number().min(1).max(100).default(5),

  // Search Rate Limiting
  SEARCH_RATE_LIMIT_PER_MIN: z.coerce.number().min(1).max(1000).default(30),

  // JWT (optional - for future auth)
  JWT_SECRET: z.string().min(32).default('development-secret-key-change-in-production-please'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Admin (optional)
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),

  // Email (Web3Forms)
  WEB3FORMS_ACCESS_KEY: z.string().optional(),

  // Feature Flags
  ENABLE_PLAYGROUND: z.coerce.boolean().default(true),
  ENABLE_INTROSPECTION: z.coerce.boolean().default(true),
});

// ============================================================================
// VALIDATE ENVIRONMENT VARIABLES
// ============================================================================

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parseResult.error.format());
  process.exit(1);
}

const env = parseResult.data;

// ============================================================================
// EXPORT CONFIGURATION
// ============================================================================

export const config = {
  // Environment
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',

  // Server
  port: env.PORT,

  // Database
  mongoUri: env.MONGODB_URI,

  // Redis
  redisUrl: env.REDIS_URL,

  // CORS
  corsOrigin: env.CORS_ORIGIN,

  // Logging
  logLevel: env.LOG_LEVEL,

  // Rate Limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
    graphqlMax: env.GRAPHQL_RATE_LIMIT_MAX,
    contactPerHour: env.CONTACT_RATE_LIMIT_PER_HOUR,
    searchPerMin: env.SEARCH_RATE_LIMIT_PER_MIN,
  },

  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  // Admin
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },

  // Email (Web3Forms)
  email: {
    web3formsAccessKey: env.WEB3FORMS_ACCESS_KEY,
  },

  // Feature Flags
  features: {
    enablePlayground: env.NODE_ENV !== 'production' || env.ENABLE_PLAYGROUND,
    enableIntrospection: env.NODE_ENV !== 'production' || env.ENABLE_INTROSPECTION,
  },
} as const;

// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

export const securityConfig = {
  // Helmet Configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
        fontSrc: ["'self'", 'fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'wss:'],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: config.isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' as const },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' as const },
    xssFilter: true,
    noSniff: true,
    ieNoOpen: true,
    frameguard: { action: 'deny' as const },
  },

  // CORS Configuration
  cors: {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const allowedOrigins = Array.isArray(config.corsOrigin)
        ? config.corsOrigin
        : [config.corsOrigin];

      if (allowedOrigins.includes(origin) || config.isDevelopment) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'] as string[],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] as string[],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'] as string[],
    maxAge: 86400, // 24 hours
  },
};

// Log configuration on startup (without sensitive data)
if (config.isDevelopment) {
  console.log('📋 Configuration loaded:', {
    nodeEnv: config.nodeEnv,
    port: config.port,
    corsOrigin: config.corsOrigin,
    logLevel: config.logLevel,
    rateLimit: config.rateLimit,
    features: config.features,
  });
}
