export class CSRFProtection {
  private static token: string | null = null;

  static initialize(): void {
    this.token = crypto.randomUUID();
    document.cookie = `csrf-token=${this.token}; path=/; samesite=strict`;
  }

  static getToken(): string {
    if (!this.token) {
      this.initialize();
    }
    return this.token!;
  }

  static validate(token: string): boolean {
    return token === this.token;
  }

  static getHeaders(): Record<string, string> {
    return {
      'X-CSRF-Token': this.getToken()
    };
  }
}