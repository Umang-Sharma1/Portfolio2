import { GraphQLError } from "graphql";

/**
 * Custom Error Classes for GraphQL
 */

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "Not authenticated") {
    super(message, {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}

export class AuthorizationError extends GraphQLError {
  constructor(message: string = "Not authorized") {
    super(message, {
      extensions: {
        code: "FORBIDDEN",
        http: { status: 403 },
      },
    });
  }
}

export class ValidationError extends GraphQLError {
  constructor(message: string, field?: string) {
    super(message, {
      extensions: {
        code: "BAD_USER_INPUT",
        field,
        http: { status: 400 },
      },
    });
  }
}

export class NotFoundError extends GraphQLError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier "${identifier}" not found`
      : `${resource} not found`;

    super(message, {
      extensions: {
        code: "NOT_FOUND",
        resource,
        identifier,
        http: { status: 404 },
      },
    });
  }
}

export class RateLimitError extends GraphQLError {
  constructor(message: string = "Too many requests") {
    super(message, {
      extensions: {
        code: "RATE_LIMITED",
        http: { status: 429 },
      },
    });
  }
}

export class InternalServerError extends GraphQLError {
  constructor(message: string = "Internal server error") {
    super(message, {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
}

/**
 * Error Handler Utility
 * Catches and transforms errors into appropriate GraphQL errors
 */
export const handleError = (error: any): never => {
  // If already a GraphQL error, rethrow
  if (error instanceof GraphQLError) {
    throw error;
  }

  // Mongoose validation errors
  if (error.name === "ValidationError") {
    const firstError = Object.values(error.errors)[0] as any;
    throw new ValidationError(firstError.message, firstError.path);
  }

  // Mongoose CastError (invalid ObjectId)
  if (error.name === "CastError") {
    throw new ValidationError(`Invalid ${error.path}: ${error.value}`);
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    throw new ValidationError(`${field} already exists`, field);
  }

  // Log unexpected errors
  console.error("Unexpected error:", error);

  // Throw generic error (hide implementation details in production)
  throw new InternalServerError(
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : error.message,
  );
};

/**
 * Validation Helpers
 */

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === null || value === undefined || value === "") {
    throw new ValidationError(`${fieldName} is required`, fieldName);
  }
};

export const validateEmail = (email: string): void => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format", "email");
  }
};

export const validateRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string,
): void => {
  if (value < min || value > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max}`,
      fieldName,
    );
  }
};

export const validateLength = (
  value: string,
  min: number,
  max: number,
  fieldName: string,
): void => {
  if (value.length < min || value.length > max) {
    throw new ValidationError(
      `${fieldName} must be between ${min} and ${max} characters`,
      fieldName,
    );
  }
};

export const validateSlug = (slug: string): void => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(slug)) {
    throw new ValidationError(
      "Slug must be lowercase alphanumeric with hyphens only",
      "slug",
    );
  }
};

/**
 * Rate Limiting Helper
 * Check if action is rate limited based on IP and action type
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (
  ip: string,
  action: string,
  maxRequests: number,
  windowMs: number,
): void => {
  const key = `${ip}:${action}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetAt) {
    // No record or expired - create new
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return;
  }

  if (record.count >= maxRequests) {
    const remainingMs = record.resetAt - now;
    const remainingMin = Math.ceil(remainingMs / 60000);
    throw new RateLimitError(
      `Too many ${action} requests. Try again in ${remainingMin} minute(s)`,
    );
  }

  record.count++;
};

/**
 * Pagination Helper
 * Calculate offset and validate pagination input
 */
export const getPagination = (
  page: number = 1,
  limit: number = 10,
): { skip: number; limit: number } => {
  // Validate inputs
  if (page < 1) {
    throw new ValidationError("Page must be greater than 0", "page");
  }

  if (limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100", "limit");
  }

  return {
    skip: (page - 1) * limit,
    limit,
  };
};

/**
 * Build PageInfo for Relay-style pagination
 */
export const buildPageInfo = (
  totalCount: number,
  page: number,
  limit: number,
  edges: any[],
): any => {
  const totalPages = Math.ceil(totalCount / limit);

  return {
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startCursor: edges.length > 0 ? edges[0].cursor : null,
    endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
    currentPage: page,
    totalPages,
  };
};

/**
 * Build Connection (Relay-style pagination result)
 */
export const buildConnection = (
  nodes: any[],
  totalCount: number,
  page: number,
  limit: number,
): any => {
  const edges = nodes.map((node, index) => ({
    node,
    cursor: Buffer.from(`${page}:${index}`).toString("base64"),
  }));

  return {
    edges,
    pageInfo: buildPageInfo(totalCount, page, limit, edges),
    totalCount,
  };
};
