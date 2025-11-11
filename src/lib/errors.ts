export class ValidationError extends Error {
  public readonly statusCode: number;
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>, message: string = 'Validation failed') {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

export class AuthenticationError extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Authentication required') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  public readonly statusCode: number;

  constructor(resource: string = 'Resource') {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  public readonly statusCode: number;

  constructor(message: string = 'Resource already exists') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

export class DatabaseError extends Error {
  public readonly statusCode: number;
  public readonly originalError?: Error;

  constructor(message: string = 'Database operation failed', originalError?: Error) {
    super(message);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.originalError = originalError;
  }
}

export class RateLimitError extends Error {
  public readonly statusCode: number;
  public readonly retryAfter?: number;

  constructor(message: string = 'Too many requests', retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.retryAfter = retryAfter;
  }
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path?: string;
  };
}

export const createErrorResponse = (
  error: Error,
  path?: string
): ErrorResponse => {
  const baseResponse: ErrorResponse = {
    success: false,
    error: {
      code: error.name,
      message: error.message,
      timestamp: new Date().toISOString(),
      path,
    },
  };

  // Add specific details for different error types
  if (error instanceof ValidationError) {
    baseResponse.error.details = error.errors;
  } else if (error instanceof RateLimitError && error.retryAfter) {
    baseResponse.error.details = { retryAfter: error.retryAfter };
  }

  return baseResponse;
};