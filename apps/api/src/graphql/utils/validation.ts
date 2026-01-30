import { z } from 'zod';
import { ValidationError } from './errors';

/**
 * Zod Validation Schemas for GraphQL Inputs
 * Enterprise-grade input validation with detailed error messages
 */

// ==========================================
// CONTACT MESSAGE VALIDATION
// ==========================================

export const ContactMessageSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email must be less than 255 characters')
    .transform((email) => email.toLowerCase().trim()),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject must be less than 200 characters')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  company: z.string().max(100).optional(),
  phone: z
    .string()
    .regex(/^[\d\s+()-]*$/, 'Invalid phone number format')
    .max(20)
    .optional(),
  budget: z.string().max(50).optional(),
  projectType: z
    .enum(['FREELANCE', 'FULL_TIME', 'COLLABORATION', 'CONSULTATION', 'OTHER'])
    .optional(),
});

// ==========================================
// SUBMIT SCORE VALIDATION
// ==========================================

export const SubmitScoreSchema = z.object({
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
  wpm: z
    .number()
    .int('WPM must be a whole number')
    .min(1, 'WPM must be at least 1')
    .max(300, 'WPM cannot exceed 300 (suspicious activity)'),
  accuracy: z
    .number()
    .min(0, 'Accuracy cannot be negative')
    .max(100, 'Accuracy cannot exceed 100%'),
  level: z
    .number()
    .int('Level must be a whole number')
    .min(1, 'Level must be at least 1')
    .max(100, 'Level cannot exceed 100')
    .optional()
    .default(1),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(10, 'Duration must be at least 10 seconds')
    .max(3600, 'Duration cannot exceed 1 hour'),
  mistakes: z
    .number()
    .int('Mistakes must be a whole number')
    .min(0, 'Mistakes cannot be negative')
    .optional()
    .default(0),
  gameMode: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'CUSTOM']),
  gameType: z.enum(['TYPING', 'MEMORY', 'PUZZLE', 'QUIZ']),
  isAnonymous: z.boolean().optional().default(false),
});

// ==========================================
// TRACK VIEW VALIDATION
// ==========================================

export const TrackViewSchema = z.object({
  page: z.enum(['home', 'projects', 'skills', 'contact', 'about']),
  referrer: z.string().url().optional().nullable(),
  sessionId: z.string().uuid().optional(),
});

// ==========================================
// TRACK CLICK VALIDATION
// ==========================================

export const TrackClickSchema = z.object({
  targetType: z.enum(['PROJECT', 'SKILL', 'EXTERNAL_LINK', 'SOCIAL']),
  targetId: z.string().min(1, 'Target ID is required'),
  targetName: z.string().max(100).optional(),
});

// ==========================================
// PAGINATION VALIDATION
// ==========================================

export const PaginationSchema = z.object({
  page: z
    .number()
    .int('Page must be a whole number')
    .min(1, 'Page must be at least 1')
    .max(1000, 'Page cannot exceed 1000')
    .optional()
    .default(1),
  limit: z
    .number()
    .int('Limit must be a whole number')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional()
    .default(10),
});

// ==========================================
// PROJECT FILTER VALIDATION
// ==========================================

export const ProjectFilterSchema = z.object({
  category: z
    .enum(['FULLSTACK', 'FRONTEND', 'BACKEND', 'MOBILE', 'AI_ML', 'DEVOPS', 'OTHER'])
    .optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'PLANNED', 'ARCHIVED']).optional(),
  featured: z.boolean().optional(),
  technologies: z.array(z.string().min(1).max(50)).max(20).optional(),
  minStars: z.number().int().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ==========================================
// SKILL FILTER VALIDATION
// ==========================================

export const SkillFilterSchema = z.object({
  category: z
    .enum(['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'DEVOPS', 'TOOL', 'SOFT_SKILL', 'OTHER'])
    .optional(),
  status: z.enum(['LEARNING', 'PROFICIENT', 'EXPERT']).optional(),
  minProficiency: z.number().int().min(0).max(100).optional(),
  featured: z.boolean().optional(),
});

// ==========================================
// LEADERBOARD FILTER VALIDATION
// ==========================================

export const LeaderboardFilterSchema = z.object({
  gameType: z.enum(['TYPING', 'MEMORY', 'PUZZLE', 'QUIZ']).optional(),
  gameMode: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT', 'CUSTOM']).optional(),
  isVerified: z.boolean().optional(),
  username: z.string().min(2).max(30).optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

// ==========================================
// SEARCH QUERY VALIDATION
// ==========================================

export const SearchQuerySchema = z.object({
  query: z
    .string()
    .min(2, 'Search query must be at least 2 characters')
    .max(100, 'Search query must be less than 100 characters')
    .transform((q) => q.trim()),
});

// ==========================================
// VALIDATION HELPER
// ==========================================

/**
 * Inferred types from Zod schemas
 */
export type ContactMessageInput = z.infer<typeof ContactMessageSchema>;
export type SubmitScoreInput = z.infer<typeof SubmitScoreSchema>;
export type TrackViewInput = z.infer<typeof TrackViewSchema>;
export type TrackClickInput = z.infer<typeof TrackClickSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type ProjectFilterInput = z.infer<typeof ProjectFilterSchema>;
export type SkillFilterInput = z.infer<typeof SkillFilterSchema>;
export type LeaderboardFilterInput = z.infer<typeof LeaderboardFilterSchema>;
export type SearchQueryInput = z.infer<typeof SearchQuerySchema>;

/**
 * Validate input with Zod schema and throw GraphQL-compatible error
 */
export function validateInput<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const field = firstError.path.join('.');
      throw new ValidationError(firstError.message, field);
    }
    throw error;
  }
}

/**
 * Validate and sanitize input, returning partial for optional fields
 */
export function validatePartialInput<T extends z.ZodObject<any>>(
  schema: T,
  data: unknown
): Partial<z.infer<T>> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  try {
    return schema.partial().parse(data) as Partial<z.infer<T>>;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      const field = firstError.path.join('.');
      throw new ValidationError(firstError.message, field);
    }
    throw error;
  }
}

// ==========================================
// SPAM DETECTION
// ==========================================

const spamPatterns = [
  /\b(viagra|casino|lottery|winner|congratulations|click here|free money)\b/i,
  /(http[s]?:\/\/){2,}/i, // Multiple URLs
  /(.)\1{10,}/i, // Repeated characters
  /[A-Z]{20,}/i, // Too many caps
];

const linkCountRegex = /https?:\/\//gi;

export const detectSpam = (text: string): { isSpam: boolean; reason?: string } => {
  // Check link count
  const linkCount = (text.match(linkCountRegex) || []).length;
  if (linkCount > 3) {
    return { isSpam: true, reason: 'Too many links detected' };
  }

  // Check spam patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return { isSpam: true, reason: 'Spam pattern detected' };
    }
  }

  return { isSpam: false };
};
