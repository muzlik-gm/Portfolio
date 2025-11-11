import { NextRequest, NextResponse } from 'next/server';
import { cache } from './cache';

// Cache middleware for API routes
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    ttl?: number;
    keyGenerator?: (request: NextRequest) => string;
    compress?: boolean;
  } = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { ttl = 300, keyGenerator, compress = false } = options;

    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return handler(request);
    }

    // Generate cache key
    const cacheKey = keyGenerator
      ? keyGenerator(request)
      : `${request.nextUrl.pathname}${request.nextUrl.search}`;

    try {
      // Try to get from cache
      const cached = await cache.get(cacheKey);
      if (cached) {
        const data = compress ? cache['decompress'](cached) : cached;
        const parsed = JSON.parse(data);

        // Return cached response
        return NextResponse.json(parsed);
      }
    } catch (error) {
      console.error('Cache retrieval error:', error);
      // Continue to handler if cache fails
    }

    // Execute handler
    const response = await handler(request);

    try {
      // Cache the response if successful
      if (response.ok) {
        const responseClone = response.clone();
        const data = await responseClone.json();
        const value = JSON.stringify(data);
        const finalValue = compress ? cache['compress'](value) : value;
        await cache.set(cacheKey, finalValue, { ttl, compress });
      }
    } catch (error) {
      console.error('Cache storage error:', error);
    }

    return response;
  };
}

// Rate limiting middleware
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    windowMs?: number; // Time window in milliseconds
    maxRequests?: number; // Max requests per window
    keyGenerator?: (request: NextRequest) => string;
  } = {}
) {
  const { windowMs = 15 * 60 * 1000, maxRequests = 100 } = options;

  return async (request: NextRequest): Promise<NextResponse> => {
    const keyGenerator = options.keyGenerator || ((req) => `ratelimit:global`);

    const key = keyGenerator(request);
    const now = Date.now();
    const windowKey = `${key}:${Math.floor(now / windowMs)}`;

    try {
      const current = await cache.get(windowKey);
      const requests = current ? parseInt(current) : 0;

      if (requests >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: { 'Retry-After': windowMs.toString() } }
        );
      }

      // Increment counter
      await cache.set(windowKey, (requests + 1).toString(), { ttl: Math.ceil(windowMs / 1000) });

    } catch (error) {
      console.error('Rate limit error:', error);
      // Continue if rate limiting fails
    }

    return handler(request);
  };
}

// Cache invalidation utility
export async function invalidateApiCache(patterns: string[]) {
  for (const pattern of patterns) {
    await cache.invalidate(pattern);
  }
}

// Warm up cache for frequently accessed endpoints
export async function warmCache(
  endpoints: Array<{
    url: string;
    method?: string;
    headers?: Record<string, string>;
    ttl?: number;
  }>
) {
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method || 'GET',
        headers: {
          ...endpoint.headers,
          'User-Agent': 'Cache-Warmer/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const cacheKey = endpoint.url;
        await cache.set(cacheKey, JSON.stringify(data), {
          ttl: endpoint.ttl || 300
        });
      }
    } catch (error) {
      console.error(`Cache warm error for ${endpoint.url}:`, error);
    }
  }
}

export default { withCache, withRateLimit, invalidateApiCache, warmCache };