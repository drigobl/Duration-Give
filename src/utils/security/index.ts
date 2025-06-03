import { CSRFProtection } from './csrf';
import { InputSanitizer } from './sanitizer';
import { RateLimiter } from './rateLimiter';
import { Logger } from '../logger';
import { ENV } from '@/config/env';

interface SecurityHeaders {
  'Content-Security-Policy': string;
  'X-Content-Type-Options': string;
  'X-Frame-Options': string;
  'X-XSS-Protection': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
  'Strict-Transport-Security': string;
}

export class SecurityManager {
  private static instance: SecurityManager;
  private csrf: CSRFProtection;
  private sanitizer: InputSanitizer;
  private rateLimiter: RateLimiter;
  private readonly trustedDomains: string[];
  private readonly securityHeaders: SecurityHeaders;

  private constructor() {
    this.csrf = CSRFProtection.getInstance();
    this.sanitizer = InputSanitizer.getInstance();
    this.rateLimiter = RateLimiter.getInstance();
    this.trustedDomains = this.initializeTrustedDomains();
    this.securityHeaders = this.initializeSecurityHeaders();
  }

  static getInstance(): SecurityManager {
    if (!this.instance) {
      this.instance = new SecurityManager();
    }
    return this.instance;
  }

  private initializeTrustedDomains(): string[] {
    return [
      ENV.APP_DOMAIN,
      `app.${ENV.APP_DOMAIN}`,
      'etqbojasfmpieigeefdj.supabase.co',
      'westend-rpc.polkadot.io',
      'api.giveprotocol.io',
      'images.unsplash.com'
    ];
  }

  private initializeSecurityHeaders(): SecurityHeaders {
    const trustedDomainsList = this.trustedDomains.join(' ');
    
    return {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' ${trustedDomainsList};
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https: blob:;
        font-src 'self';
        connect-src 'self' ${trustedDomainsList};
        frame-ancestors 'none';
        form-action 'self';
        base-uri 'self';
        upgrade-insecure-requests;
      `.replace(/\s+/g, ' ').trim(),
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
    };
  }

  initialize(): void {
    try {
      this.csrf.initialize();
      this.addSecurityHeaders();
      this.startSecurityMonitoring();
      Logger.info('Security manager initialized');
    } catch (error) {
      Logger.error('Failed to initialize security manager', { error });
      throw error;
    }
  }

  private addSecurityHeaders(): void {
    Object.entries(this.securityHeaders).forEach(([header, value]) => {
      if (typeof document !== 'undefined') {
        Logger.info('Security header defined', { header, value });
      }
    });
  }

  private startSecurityMonitoring(): void {
    window.addEventListener('error', this.handleError.bind(this));
    this.monitorDOMManipulation();
    this.monitorNetworkRequests();
  }

  private handleError(event: ErrorEvent): void {
    const suspiciousPatterns = [
      'script error',
      'eval',
      'fromCharCode',
      'javascript:',
      'data:',
      '<script'
    ];

    if (suspiciousPatterns.some(pattern => 
      event.message.toLowerCase().includes(pattern) ||
      (event.error?.stack || '').toLowerCase().includes(pattern)
    )) {
      this.handleSuspiciousActivity('Potential XSS attempt detected', {
        message: event.message,
        filename: event.filename,
        lineNumber: event.lineno,
        timestamp: new Date().toISOString()
      });
    }
  }

  private monitorDOMManipulation(): void {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              this.validateDOMElement(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private validateDOMElement(element: HTMLElement): void {
    const dangerousAttributes = ['onclick', 'onerror', 'onload', 'onmouseover'];
    const dangerousTags = ['script', 'object', 'embed', 'base'];

    if (dangerousTags.includes(element.tagName.toLowerCase())) {
      element.remove();
      this.handleSuspiciousActivity('Dangerous HTML element blocked', {
        tag: element.tagName,
        timestamp: new Date().toISOString()
      });
    }

    dangerousAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
        this.handleSuspiciousActivity('Dangerous attribute removed', {
          attribute: attr,
          element: element.tagName,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  private monitorNetworkRequests(): void {
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = input instanceof Request ? input.url : input.toString();
      
      if (!this.isUrlTrusted(url)) {
        this.handleSuspiciousActivity('Untrusted network request blocked', {
          url,
          timestamp: new Date().toISOString()
        });
        throw new Error('Request to untrusted domain blocked');
      }

      return originalFetch(input, {
        ...init,
        headers: {
          ...init?.headers,
          ...this.csrf.getHeaders()
        }
      });
    };
  }

  private isUrlTrusted(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return this.trustedDomains.some(domain => 
        urlObj.hostname === domain || 
        urlObj.hostname.endsWith(`.${domain}`)
      );
    } catch {
      return false;
    }
  }

  private handleSuspiciousActivity(type: string, details: Record<string, any>): void {
    Logger.warn('Suspicious activity detected', {
      type,
      ...details,
      url: window.location.href
    });

    if (this.shouldBlockRequest(type, details)) {
      this.rateLimiter.isRateLimited(details.ip || 'unknown', true);
    }
  }

  private shouldBlockRequest(type: string, details: Record<string, any>): boolean {
    const highRiskPatterns = [
      'sql injection',
      'xss attempt',
      'csrf attempt',
      'path traversal'
    ];

    return highRiskPatterns.some(pattern => 
      type.toLowerCase().includes(pattern) ||
      JSON.stringify(details).toLowerCase().includes(pattern)
    );
  }

  public validateRequest(req: Request): boolean {
    return (
      this.csrf.validate(req.headers.get('X-CSRF-Token') || '') &&
      !this.rateLimiter.isRateLimited(req.headers.get('X-Forwarded-For') || 'unknown') &&
      this.isUrlTrusted(req.url)
    );
  }

  public sanitizeInput(input: string, context: string): string {
    return this.sanitizer.sanitizeText(input, context);
  }
}