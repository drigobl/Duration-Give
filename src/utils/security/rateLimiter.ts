import { Logger } from '../logger';

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
  blockDuration: number;
}

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private static instance: RateLimiter;
  private store: Map<string, RateLimitRecord> = new Map();
  
  private readonly authConfig: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,
    blockDuration: 30 * 60 * 1000 // 30 minutes
  };

  private constructor() {
    // Clean up expired records periodically
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  static getInstance(): RateLimiter {
    if (!this.instance) {
      this.instance = new RateLimiter();
    }
    return this.instance;
  }

  isRateLimited(key: string, isAuth: boolean = false): boolean {
    const config = isAuth ? this.authConfig : this.authConfig;
    const now = Date.now();
    const record = this.store.get(key);

    if (!record) {
      this.store.set(key, {
        attempts: 0,
        resetAt: now + config.windowMs
      });
      return false;
    }

    // Check if blocked
    if (record.blockedUntil && now < record.blockedUntil) {
      return true;
    }

    // Reset if window expired
    if (now > record.resetAt) {
      record.attempts = 0;
      record.resetAt = now + config.windowMs;
      delete record.blockedUntil;
    }

    return record.attempts >= config.maxAttempts;
  }

  increment(key: string): void {
    const record = this.store.get(key);
    if (!record) return;

    record.attempts++;

    // Block if max attempts exceeded
    if (record.attempts >= this.authConfig.maxAttempts) {
      record.blockedUntil = Date.now() + this.authConfig.blockDuration;
      Logger.warn('Rate limit exceeded', {
        key,
        attempts: record.attempts,
        blockedUntil: new Date(record.blockedUntil)
      });
    }
  }

  reset(key: string): void {
    this.store.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.resetAt < now && (!record.blockedUntil || record.blockedUntil < now)) {
        this.store.delete(key);
      }
    }
  }
}