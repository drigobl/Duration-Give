import { Logger } from './logger';

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private readonly SAMPLE_SIZE = 100;

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  measureTime(operation: string, duration: number): void {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }

    const samples = this.metrics.get(operation)!;
    samples.push(duration);

    // Keep only last N samples
    if (samples.length > this.SAMPLE_SIZE) {
      samples.shift();
    }

    // Log slow operations
    if (duration > 1000) {
      Logger.warn('Slow operation detected', {
        operation,
        duration,
        timestamp: new Date().toISOString()
      });
    }
  }

  getMetrics(operation: string): {
    avg: number;
    p95: number;
    max: number;
  } | null {
    const samples = this.metrics.get(operation);
    if (!samples || samples.length === 0) return null;

    const sorted = [...samples].sort((a, b) => a - b);
    const p95Index = Math.floor(samples.length * 0.95);

    return {
      avg: samples.reduce((a, b) => a + b) / samples.length,
      p95: sorted[p95Index],
      max: sorted[sorted.length - 1]
    };
  }
}