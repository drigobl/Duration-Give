import type LogLevel from 'loglevel';
import * as Sentry from '@sentry/react';

type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

export class Logger {
  private static readonly MAX_LOG_SIZE = 1000;
  private static logs: LogEntry[] = [];

  private static serializeValue(value: any): any {
    if (value === undefined) {
      return 'undefined';
    }
    
    if (value === null) {
      return null;
    }
    
    if (typeof value === 'bigint') {
      return value.toString();
    }
    
    if (Array.isArray(value)) {
      return value.map(item => this.serializeValue(item));
    }
    
    if (value && typeof value === 'object') {
      try {
        if (value instanceof Error) {
          return {
            message: value.message,
            stack: value.stack,
            name: value.name
          };
        }
        
        return Object.fromEntries(
          Object.entries(value).map(([key, val]) => [
            key,
            this.serializeValue(val)
          ])
        );
      } catch (err) {
        return `[Unserializable Object: ${err instanceof Error ? err.message : String(err)}]`;
      }
    }
    
    return value;
  }

  private static log(level: LogLevel, message: string, metadata?: Record<string, any>) {
    try {
      const serializedMetadata = metadata ? this.serializeValue(metadata) : metadata;

      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        metadata: serializedMetadata,
      };

      this.logs.push(entry);
      if (this.logs.length > this.MAX_LOG_SIZE) {
        this.logs.shift();
      }

      // Send to monitoring service in production
      if (import.meta.env.PROD) {
        this.sendToMonitoring(entry);
      }

      // Console output in development
      if (import.meta.env.DEV) {
        const metadataStr = serializedMetadata ? ` ${JSON.stringify(serializedMetadata)}` : '';
        console[level](`[${level.toUpperCase()}] ${message}${metadataStr}`);
      }
    } catch (e) {
      // Fallback logging if something goes wrong
      console.error('Logger error:', e);
      console[level](message, metadata);
    }
  }

  static info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, metadata);
  }

  static warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, metadata);
  }

  static error(message: string, metadata?: Record<string, any>) {
    this.log('error', message, metadata);
  }

  private static async sendToMonitoring(entry: LogEntry) {
    try {
      const sentryLevel = entry.level === 'warn' ? 'warning' : entry.level;

      if (entry.level === 'error') {
        Sentry.captureException(entry.metadata?.error || new Error(entry.message), {
          level: sentryLevel,
          extra: entry.metadata,
        });
      } else {
        Sentry.captureMessage(entry.message, {
          level: sentryLevel,
          extra: entry.metadata,
        });
      }
    } catch (error) {
      console.error('Failed to send log to Sentry:', error);
    }
  }

  static getLogs(): LogEntry[] {
    return [...this.logs];
  }
}