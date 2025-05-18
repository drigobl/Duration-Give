import { Logger } from '../logger';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: PerformanceMetric[] = [];
  private readonly MAX_METRICS = 1000;

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMetrics {
    if (!this.instance) {
      this.instance = new PerformanceMetrics();
    }
    return this.instance;
  }

  measureTime(name: string, startTime: number): void {
    const duration = performance.now() - startTime;
    this.addMetric(name, duration);

    // Log slow operations
    if (duration > 1000) {
      Logger.warn('Slow operation detected', {
        operation: name,
        duration,
        timestamp: new Date().toISOString()
      });
    }
  }

  private addMetric(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      timestamp: Date.now()
    });

    // Keep only last N metrics
    if (this.metrics.length > this.MAX_METRICS) {
      this.metrics.shift();
    }
  }

  private initializeObservers(): void {
    // Performance Observer for long tasks
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) {
      new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.addMetric('LongTask', entry.duration);
        });
      }).observe({ entryTypes: ['longtask'] });
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return this.metrics;
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }
}