import { SecurityManager } from '../utils/security';
import { Logger } from '../utils/logger';

export function initializeSecurity(): void {
  try {
    const securityManager = SecurityManager.getInstance();
    securityManager.initialize();
  } catch (error) {
    Logger.error('Failed to initialize security middleware', { error });
    throw error;
  }
}

export function withSecurity<T extends (...args: any[]) => Promise<any>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    const csrf = CSRFProtection.getInstance();
    const sanitizer = InputSanitizer.getInstance();
    const rateLimiter = RateLimiter.getInstance();

    try {
      // Rate limiting check
      const clientId = args[0]?.headers?.['x-client-id'] || 'anonymous';
      if (rateLimiter.isRateLimited(clientId)) {
        throw new Error('Too many requests');
      }

      // CSRF validation
      const token = args[0]?.headers?.[csrf.getHeaders()['X-CSRF-Token']];
      if (!csrf.validate(token)) {
        throw new Error('Invalid CSRF token');
      }

      // Sanitize input
      const sanitizedArgs = args.map(arg => {
        if (typeof arg === 'object') {
          return sanitizer.sanitizeObject(arg, {
            // Define schema based on expected input
            text: 'text',
            html: 'html',
            email: 'email',
            url: 'url'
          });
        }
        return arg;
      });

      // Execute handler with sanitized arguments
      const result = await handler(...sanitizedArgs);
      return result;
    } catch (error) {
      Logger.error('Security middleware error', { error });
      throw error;
    }
  }) as T;
}