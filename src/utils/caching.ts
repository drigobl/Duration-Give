interface CacheConfig {
  maxSize?: number;
  ttl?: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { value: any; timestamp: number }> = new Map();
  private readonly maxSize: number;
  private readonly ttl: number;

  private constructor(config: CacheConfig = {}) {
    this.maxSize = config.maxSize || 100;
    this.ttl = config.ttl || 5 * 60 * 1000; // 5 minutes default
  }

  static getInstance(config?: CacheConfig): CacheManager {
    if (!this.instance) {
      this.instance = new CacheManager(config);
    }
    return this.instance;
  }

  set(key: string, value: any): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }
}