import { ContactMessage } from '../../models/ContactMessage';
import { cacheGet, cacheSet, cacheDelete } from '../../config/redis';
import { logger } from '../../utils/logger';
import {
  handleError,
  NotFoundError,
  checkRateLimit,
  getPagination,
  RateLimitError,
} from '../utils/errors';
import { Context } from '../utils/auth';
import { validateInput, ContactMessageSchema, detectSpam } from '../utils/validation';

/**
 * Cache TTL Constants (in seconds)
 */
const CACHE_TTL = {
  MESSAGE_LIST: 300, // 5 minutes
  SPAM_STATS: 600, // 10 minutes
  PENDING_MESSAGES: 180, // 3 minutes
};

/**
 * Cache Key Generators
 */
const cacheKeys = {
  messageList: (status: string, page: number, limit: number) =>
    `messages:list:${status}:p${page}:l${limit}`,
  messageById: (id: string) => `message:id:${id}`,
  pendingMessages: () => `messages:pending`,
  spamStats: () => `messages:spam-stats`,
};

/**
 * Rate limit tracking for IP-based spam prevention
 */
const ipSubmissionTracker = new Map<string, { count: number; firstSubmission: number }>();

const checkMessageRateLimit = (ip: string): void => {
  const now = Date.now();
  const windowMs = 3600000; // 1 hour
  const maxMessages = 5; // Max 5 messages per hour per IP

  const record = ipSubmissionTracker.get(ip);

  if (!record || now - record.firstSubmission > windowMs) {
    // New window
    ipSubmissionTracker.set(ip, { count: 1, firstSubmission: now });
    return;
  }

  if (record.count >= maxMessages) {
    const remainingMs = windowMs - (now - record.firstSubmission);
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new RateLimitError(
      `Too many messages. Please wait ${remainingMin} minute(s) before sending another message.`
    );
  }

  record.count++;
};

export const contactResolvers = {
  Query: {
    /**
     * Get all contact messages with status filter (ADMIN ONLY)
     */
    contactMessages: async (
      _: any,
      { status, pagination }: { status?: string; pagination?: any },
      context: Context
    ) => {
      try {
        const page = pagination?.page || 1;
        const limit = pagination?.limit || 20;
        const cacheKey = cacheKeys.messageList(status || 'all', page, limit);

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const query: any = {};
        if (status) {
          query.status = status;
        }

        const { skip, limit: pageLimit } = getPagination(page, limit);

        const messages = await ContactMessage.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(pageLimit)
          .lean();

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(messages), CACHE_TTL.MESSAGE_LIST);

        return messages;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get pending (unread) messages (ADMIN ONLY)
     */
    pendingMessages: async (_: any, __: any, _context: Context) => {
      try {
        const cacheKey = cacheKeys.pendingMessages();

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const messages = await ContactMessage.find({ status: 'NEW' })
          .sort({ createdAt: -1 })
          .lean();

        // Cache result (shorter TTL for pending)
        await cacheSet(cacheKey, JSON.stringify(messages), CACHE_TTL.PENDING_MESSAGES);

        return messages;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Get spam statistics (ADMIN ONLY)
     */
    spamStats: async (_: any, __: any, _context: Context) => {
      try {
        const cacheKey = cacheKeys.spamStats();

        // Try cache first
        const cached = await cacheGet(cacheKey);
        if (cached) {
          logger.debug(`Cache hit: ${cacheKey}`);
          return JSON.parse(cached);
        }

        const [total, spam] = await Promise.all([
          ContactMessage.countDocuments({}),
          ContactMessage.countDocuments({ isSpam: true }),
        ]);

        const spamRate = total > 0 ? ((spam / total) * 100).toFixed(2) + '%' : '0%';

        const stats = { total, spam, spamRate };

        // Cache result
        await cacheSet(cacheKey, JSON.stringify(stats), CACHE_TTL.SPAM_STATS);

        return stats;
      } catch (error) {
        handleError(error);
      }
    },
  },

  Mutation: {
    /**
     * Send a contact message (PUBLIC)
     * Implements rate limiting, spam detection, and Zod validation
     */
    sendContactMessage: async (_: any, { input }: { input: any }, context: Context) => {
      try {
        const clientIp = context.ip || 'unknown';

        // Rate limit check (5 messages per hour per IP)
        checkMessageRateLimit(clientIp);

        // Validate input with Zod
        const validatedInput = validateInput(ContactMessageSchema, input);

        // Spam detection on message content
        const messageSpamCheck = detectSpam(validatedInput.message);
        const subjectSpamCheck = validatedInput.subject
          ? detectSpam(validatedInput.subject)
          : { isSpam: false };

        const isSpam = messageSpamCheck.isSpam || subjectSpamCheck.isSpam;
        const spamReason = messageSpamCheck.reason || subjectSpamCheck.reason;

        // Create message
        const contactMessage = new ContactMessage({
          ...validatedInput,
          ipAddress: clientIp,
          userAgent: context.userAgent,
          isSpam,
          spamReason,
          status: isSpam ? 'SPAM' : 'NEW',
          // Auto-detect priority based on content
          priority: detectPriority(validatedInput.message, validatedInput.subject),
        });

        await contactMessage.save();

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.pendingMessages()),
          cacheDelete(cacheKeys.spamStats()),
        ]);

        if (isSpam) {
          logger.warn(`Spam message detected from ${validatedInput.email}: ${spamReason}`);
        } else {
          logger.info(`New contact message from ${validatedInput.email}`);
        }

        return contactMessage;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Update message status (ADMIN ONLY)
     */
    updateMessageStatus: async (
      _: any,
      { id, input }: { id: string; input: { status: string; adminNotes?: string } },
      context: Context
    ) => {
      try {
        // Rate limit: 50 updates per hour
        checkRateLimit(context.ip || 'unknown', 'update_message', 50, 3600000);

        const updateData: any = {
          status: input.status,
          respondedAt: input.status === 'REPLIED' ? new Date() : undefined,
        };

        if (input.adminNotes) {
          updateData.adminNotes = input.adminNotes;
        }

        const message = await ContactMessage.findByIdAndUpdate(
          id,
          { $set: updateData },
          { new: true }
        );

        if (!message) {
          throw new NotFoundError('ContactMessage', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.messageById(id)),
          cacheDelete(cacheKeys.pendingMessages()),
        ]);

        logger.info(`Message ${id} status updated to ${input.status}`);

        return message;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Mark message as spam (ADMIN ONLY)
     */
    markMessageAsSpam: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        // Rate limit: 30 per hour
        checkRateLimit(context.ip || 'unknown', 'mark_spam', 30, 3600000);

        const message = await ContactMessage.findByIdAndUpdate(
          id,
          {
            $set: {
              isSpam: true,
              status: 'SPAM',
              spamReason: 'Manually marked by admin',
            },
          },
          { new: true }
        );

        if (!message) {
          throw new NotFoundError('ContactMessage', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.messageById(id)),
          cacheDelete(cacheKeys.pendingMessages()),
          cacheDelete(cacheKeys.spamStats()),
        ]);

        logger.info(`Message ${id} marked as spam`);

        return message;
      } catch (error) {
        handleError(error);
      }
    },

    /**
     * Delete a message (ADMIN ONLY)
     */
    deleteMessage: async (_: any, { id }: { id: string }, context: Context) => {
      try {
        const message = await ContactMessage.findByIdAndDelete(id);

        if (!message) {
          throw new NotFoundError('ContactMessage', id);
        }

        // Invalidate caches
        await Promise.all([
          cacheDelete(cacheKeys.messageById(id)),
          cacheDelete(cacheKeys.pendingMessages()),
          cacheDelete(cacheKeys.spamStats()),
        ]);

        logger.info(`Message ${id} deleted`);

        return {
          success: true,
          message: 'Message deleted successfully',
        };
      } catch (error) {
        handleError(error);
      }
    },
  },

  /**
   * Field resolvers for ContactMessage type
   */
  ContactMessage: {
    /**
     * Calculate response time if responded
     */
    responseTime: (parent: any) => {
      if (parent.respondedAt && parent.createdAt) {
        const responseMs =
          new Date(parent.respondedAt).getTime() - new Date(parent.createdAt).getTime();
        const responseHours = Math.round(responseMs / 3600000);
        return `${responseHours} hours`;
      }
      return null;
    },
  },
};

/**
 * Detect message priority based on content
 */
function detectPriority(message: string, subject?: string): string {
  const text = `${subject || ''} ${message}`.toLowerCase();

  // High priority keywords
  const highPriorityKeywords = [
    'urgent',
    'asap',
    'emergency',
    'immediately',
    'critical',
    'deadline',
    'job offer',
    'interview',
    'opportunity',
  ];

  // Low priority keywords
  const lowPriorityKeywords = [
    'just wondering',
    'no rush',
    'whenever you can',
    'not urgent',
    'question',
  ];

  for (const keyword of highPriorityKeywords) {
    if (text.includes(keyword)) {
      return 'HIGH';
    }
  }

  for (const keyword of lowPriorityKeywords) {
    if (text.includes(keyword)) {
      return 'LOW';
    }
  }

  return 'NORMAL';
}

/**
 * Query/Mutation Examples:
 *
 * # Send contact message (public)
 * mutation {
 *   sendContactMessage(input: {
 *     name: "John Doe"
 *     email: "john@example.com"
 *     subject: "Job Opportunity"
 *     message: "I'd like to discuss a potential role..."
 *   }) {
 *     id
 *     status
 *     priority
 *     createdAt
 *   }
 * }
 *
 * # Get pending messages (admin)
 * query {
 *   pendingMessages {
 *     id
 *     name
 *     email
 *     subject
 *     message
 *     priority
 *     createdAt
 *   }
 * }
 *
 * # Update message status (admin)
 * mutation {
 *   updateMessageStatus(
 *     id: "message_id"
 *     input: { status: RESPONDED, adminNotes: "Replied via email" }
 *   ) {
 *     id
 *     status
 *     responseTime
 *   }
 * }
 */
