import { createClient } from 'redis';

// Redis client configuration
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Redis availability flag
let redisAvailable = true;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;
const CONNECTION_TIMEOUT = 5000; // 5 seconds
const OPERATION_TIMEOUT = 2000; // 2 seconds for individual operations

const connectToRedis = async () => {
  try {
    connectionAttempts++;

    // Set a timeout for the connection attempt
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), CONNECTION_TIMEOUT)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    redisAvailable = true;
    connectionAttempts = 0; // Reset on success
  } catch (error) {
    redisAvailable = false;

    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      setTimeout(connectToRedis, 1000);
    } else {
      redisAvailable = false;
    }
  }
};

// Connect to Redis
client.on('error', () => {
  redisAvailable = false;
});

client.on('ready', () => {
  redisAvailable = true;
});

client.on('end', () => {
  redisAvailable = false;
});

client.on('reconnecting', () => {
  // Silent
});

// Initial connection
connectToRedis();

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean;
  skipCache?: boolean; // Skip caching entirely if Redis is unavailable
}

export class CacheService {
  private static instance: CacheService;

  private constructor() {}

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  async get(key: string): Promise<string | null> {
    if (!redisAvailable) {
      return null;
    }
    try {
      const getPromise = client.get(key);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Redis get timeout')), OPERATION_TIMEOUT)
      );
      const result = await Promise.race([getPromise, timeoutPromise]);
      return result;
    } catch (error) {
      redisAvailable = false;
      return null;
    }
  }

  async set(key: string, value: string, options: CacheOptions = {}): Promise<void> {
    if (!redisAvailable) {
      return;
    }
    try {
      const { ttl, compress } = options;

      // Compress value if enabled (simple JSON compression for now)
      const finalValue = compress ? this.compress(value) : value;

      let setPromise;
      if (ttl) {
        setPromise = client.setEx(key, ttl, finalValue);
      } else {
        setPromise = client.set(key, finalValue);
      }

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Redis set timeout')), OPERATION_TIMEOUT)
      );

      await Promise.race([setPromise, timeoutPromise]);
    } catch (error) {
      redisAvailable = false;
    }
  }

  async del(key: string): Promise<void> {
    if (!redisAvailable) {
      return;
    }
    try {
      await client.del(key);
    } catch (error) {
      redisAvailable = false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!redisAvailable) {
      return false;
    }
    try {
      const existsPromise = client.exists(key);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Redis exists timeout')), OPERATION_TIMEOUT)
      );
      const result = await Promise.race([existsPromise, timeoutPromise]);
      return result === 1;
    } catch (error) {
      redisAvailable = false;
      return false;
    }
  }

  // Invalidate cache by pattern (simple implementation)
  async invalidate(pattern: string): Promise<void> {
    if (!redisAvailable) {
      return;
    }
    try {
      const keysPromise = client.keys(pattern);
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Redis keys timeout')), OPERATION_TIMEOUT)
      );
      const keys = await Promise.race([keysPromise, timeoutPromise]);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      redisAvailable = false;
    }
  }

  // Cache warming utility
  async warmCache(key: string, fetcher: () => Promise<any>, options: CacheOptions = {}): Promise<void> {
    if (!redisAvailable) {
      return;
    }
    try {
      const data = await fetcher();
      const value = JSON.stringify(data);
      await this.set(key, value, options);
    } catch (error) {
      redisAvailable = false;
    }
  }

  // Get cache stats
  async getStats(): Promise<any> {
    if (!redisAvailable) {
      return { available: false };
    }
    try {
      const infoPromise = client.info();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Redis info timeout')), OPERATION_TIMEOUT)
      );
      const info = await Promise.race([infoPromise, timeoutPromise]);
      return {
        available: true,
        info: info,
      };
    } catch (error) {
      redisAvailable = false;
      return { available: false, error: (error as Error).message };
    }
  }

  private compress(value: string): string {
    // Simple compression - in production, use proper compression library
    return Buffer.from(value).toString('base64');
  }

  private decompress(value: string): string {
    // Simple decompression
    return Buffer.from(value, 'base64').toString();
  }
}

// Export singleton instance
export const cache = CacheService.getInstance();

// Helper functions for common caching patterns
export const getCachedData = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  try {
    // If skipCache is enabled or Redis is not available, skip caching entirely
    if (options.skipCache || !redisAvailable) {
      return await fetcher();
    }

    const cached = await cache.get(key);
    if (cached) {
      const data = options.compress ? cache['decompress'](cached) : cached;
      return JSON.parse(data);
    }

    const data = await fetcher();
    const value = JSON.stringify(data);
    await cache.set(key, value, options);
    return data;
  } catch (error) {
    // If caching fails, disable Redis and fetch directly
    redisAvailable = false;
    return await fetcher();
  }
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  await cache.invalidate(pattern);
};

export default cache;