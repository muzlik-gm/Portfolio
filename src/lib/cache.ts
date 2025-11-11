import { createClient } from 'redis';

// Redis client configuration
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Connect to Redis
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  compress?: boolean;
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
    try {
      return await client.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: string, options: CacheOptions = {}): Promise<void> {
    try {
      const { ttl, compress } = options;

      // Compress value if enabled (simple JSON compression for now)
      const finalValue = compress ? this.compress(value) : value;

      if (ttl) {
        await client.setEx(key, ttl, finalValue);
      } else {
        await client.set(key, finalValue);
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Cache del error:', error);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await client.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Cache exists error:', error);
      return false;
    }
  }

  // Invalidate cache by pattern (simple implementation)
  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error('Cache invalidate error:', error);
    }
  }

  // Cache warming utility
  async warmCache(key: string, fetcher: () => Promise<any>, options: CacheOptions = {}): Promise<void> {
    try {
      const data = await fetcher();
      const value = JSON.stringify(data);
      await this.set(key, value, options);
    } catch (error) {
      console.error('Cache warm error:', error);
    }
  }

  // Get cache stats
  async getStats(): Promise<any> {
    try {
      const info = await client.info();
      return {
        connected: client.isOpen,
        info: info,
      };
    } catch (error) {
      console.error('Cache stats error:', error);
      return { connected: false, error: (error as Error).message };
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
  const cached = await cache.get(key);
  if (cached) {
    const data = options.compress ? cache['decompress'](cached) : cached;
    return JSON.parse(data);
  }

  const data = await fetcher();
  const value = JSON.stringify(data);
  await cache.set(key, value, options);
  return data;
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  await cache.invalidate(pattern);
};

export default cache;