import { z } from 'zod';
import { ValidationError } from './errors';

// Utility to sanitize string input
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic XSS prevention
    .slice(0, 10000); // Prevent extremely long inputs
};

// Utility to sanitize HTML content (basic)
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove all HTML tags (for plain text fields)
    .trim()
    .slice(0, 50000); // Reasonable limit for content
};

// Enhanced email validation
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .toLowerCase()
  .trim()
  .max(254, 'Email too long'); // RFC 5321 limit

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password too long')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// Common validation helpers
export const validateData = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  sanitize: boolean = true
): T => {
  try {
    // Sanitize strings if requested
    let processedData = data;
    if (sanitize && typeof data === 'object' && data !== null) {
      processedData = sanitizeObject(data as Record<string, any>);
    }

    return schema.parse(processedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string[]> = {};
      error.issues.forEach((err) => {
        const field = err.path.join('.');
        if (!fieldErrors[field]) {
          fieldErrors[field] = [];
        }
        fieldErrors[field].push(err.message);
      });
      throw new ValidationError(fieldErrors, 'Validation failed');
    }
    throw error;
  }
};

// Recursively sanitize object strings
const sanitizeObject = (obj: Record<string, any>): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item =>
        typeof item === 'string' ? sanitizeString(item) :
        (typeof item === 'object' && item !== null ? sanitizeObject(item) : item)
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// URL validation helper
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2000, 'URL too long'); // Reasonable URL length limit

// MongoDB ObjectId validation
export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// Pagination validation
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Search and filter validation
export const searchSchema = z.object({
  query: z.string().max(100).optional(),
  filters: z.record(z.string(), z.unknown()).optional(),
  ...paginationSchema.shape,
});

// Common API response validation
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
      timestamp: z.string(),
      path: z.string().optional(),
    }).optional(),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }).optional(),
  });