import { Logger } from '../logger';

export class InputSanitizer {
  private static instance: InputSanitizer;
  
  private readonly allowedTags = [
    'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li'
  ];

  private readonly allowedAttributes = {
    a: ['href', 'title', 'target']
  };

  private readonly maxLengths = {
    title: 100,
    description: 1000,
    name: 50,
    comment: 500
  };

  private readonly patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    wallet: /^0x[a-fA-F0-9]{40}$/,
    url: /^https:\/\/[^\s/$.?#].[^\s]*$/,
    amount: /^\d+(\.\d{1,18})?$/
  };

  private constructor() {}

  static getInstance(): InputSanitizer {
    if (!this.instance) {
      this.instance = new InputSanitizer();
    }
    return this.instance;
  }

  sanitizeHTML(input: string): string {
    try {
      const doc = new DOMParser().parseFromString(input, 'text/html');
      this.sanitizeNode(doc.body);
      return doc.body.innerHTML;
    } catch (error) {
      Logger.error('HTML sanitization failed', { error });
      return '';
    }
  }

  private sanitizeNode(node: Node): void {
    const children = Array.from(node.childNodes);
    
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        
        if (!this.allowedTags.includes(element.tagName.toLowerCase())) {
          node.removeChild(child);
          return;
        }

        // Remove disallowed attributes
        Array.from(element.attributes).forEach(attr => {
          const tagAllowedAttrs = this.allowedAttributes[element.tagName.toLowerCase()];
          if (!tagAllowedAttrs || !tagAllowedAttrs.includes(attr.name)) {
            element.removeAttribute(attr.name);
          }
        });

        this.sanitizeNode(child);
      }
    });
  }

  sanitizeText(input: string, field: keyof typeof this.maxLengths): string {
    if (!input) return '';

    let sanitized = input
      .trim()
      .slice(0, this.maxLengths[field])
      .replace(/[<>]/g, '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return sanitized;
  }

  validatePattern(input: string, pattern: keyof typeof this.patterns): boolean {
    return this.patterns[pattern].test(input);
  }

  sanitizeObject<T extends Record<string, any>>(
    obj: T,
    schema: Record<keyof T, string>
  ): T {
    const sanitized = {} as T;

    for (const [key, value] of Object.entries(obj)) {
      if (schema[key] === 'html') {
        sanitized[key] = this.sanitizeHTML(value);
      } else if (schema[key] === 'text') {
        sanitized[key] = this.sanitizeText(value, key as any);
      } else if (this.patterns[schema[key]]) {
        sanitized[key] = this.validatePattern(value, schema[key]) ? value : '';
      }
    }

    return sanitized;
  }
}