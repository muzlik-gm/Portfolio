import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMITS = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes for auth routes
  api: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes for general API
  admin: { maxRequests: 1000, windowMs: 60 * 60 * 1000 }, // 1000 requests per hour for admin routes
};

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute

function getRateLimitConfig(pathname: string) {
  if (pathname.startsWith('/api/auth/') || pathname === '/api/admin/login') {
    return RATE_LIMITS.auth;
  }
  if (pathname.startsWith('/api/admin/')) {
    return RATE_LIMITS.admin;
  }
  if (pathname.startsWith('/api/')) {
    return RATE_LIMITS.api;
  }
  return null; // No rate limiting for non-API routes
}

function checkRateLimit(identifier: string, config: { maxRequests: number; windowMs: number }) {
  const now = Date.now();
  const key = `${identifier}:${Math.floor(now / config.windowMs)}`;

  const current = rateLimitStore.get(key) || { count: 0, resetTime: now + config.windowMs };

  if (current.resetTime < now) {
    // Reset if window has passed
    current.count = 0;
    current.resetTime = now + config.windowMs;
  }

  current.count++;
  rateLimitStore.set(key, current);

  const remaining = Math.max(0, config.maxRequests - current.count);
  const resetTime = Math.ceil((current.resetTime - now) / 1000); // seconds

  return {
    allowed: current.count <= config.maxRequests,
    remaining,
    resetTime,
  };
}

export function rateLimitMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const config = getRateLimitConfig(pathname);

  if (!config) {
    return NextResponse.next();
  }

  // Use IP address as identifier (in production, consider user ID for authenticated routes)
  const identifier = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

  const rateLimit = checkRateLimit(identifier, config);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'RateLimitError',
          message: 'Too many requests',
          details: { retryAfter: rateLimit.resetTime },
          timestamp: new Date().toISOString(),
          path: pathname,
        },
      },
      {
        status: 429,
        headers: {
          'Retry-After': rateLimit.resetTime.toString(),
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetTime.toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
  response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
  response.headers.set('X-RateLimit-Reset', rateLimit.resetTime.toString());

  return response;
}

// Input sanitization middleware
export function sanitizationMiddleware(request: NextRequest) {
  // This would be more comprehensive in a full implementation
  // For now, we'll rely on the validation utilities in individual routes

  // Basic request size limit
  const contentLength = parseInt(request.headers.get('content-length') || '0');
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (contentLength > maxSize) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'PayloadTooLargeError',
          message: 'Request payload too large',
          timestamp: new Date().toISOString(),
          path: request.nextUrl.pathname,
        },
      },
      { status: 413 }
    );
  }

  return NextResponse.next();
}