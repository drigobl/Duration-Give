import { Logger } from '../logger';

interface CacheConfig {
  maxSize: number;
  ttl: number;
  staleWhileRevalidate: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry<any>>;
  private readonly config: CacheConfig = {
    maxSize: 100,
    ttl: 5 * 60 * 1000, // 5 minutes
    staleWhileRevalidate: 30 * 60 * 1000 // 30 minutes
  };

  private constructor() {
    this.cache = new Map();
    // Cleanup expired entries periodically
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  static getInstance(config?: Partial<CacheConfig>): CacheManager {
    if (!this.instance) {
      this.instance = new CacheManager();
      if (config) {
        this.instance.config = { ...this.instance.config, ...config };
      }
    }
    return this.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);
    const now = Date.now();

    if (!entry) return null;

    // Return fresh data
    if (now < entry.expiresAt) {
      return entry.data;
    }

    // Return stale data if within staleWhileRevalidate window
    if (now < entry.expiresAt + this.config.staleWhileRevalidate) {
      Logger.info('Serving stale data', { key, age: now - entry.timestamp });
      return entry.data;
    }

    // Data is too old, remove it
    this.cache.delete(key);
    return null;
  }

  set<T>(key: string, data: T): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + this.config.ttl
    });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidateAll(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt + this.config.staleWhileRevalidate) {
        this.cache.delete(key);
      }
    }
  }
}