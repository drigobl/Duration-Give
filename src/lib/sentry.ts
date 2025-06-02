import * as Sentry from '@sentry/react';

  export function initSentry() {
    if (!import.meta.env.PROD) return;
    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) return;
    Sentry.init({ dsn });
  }

  export function setSentryUser(user: any) {
    if (!import.meta.env.PROD) return;
    Sentry.setUser(user);
  }

  export function clearSentryUser() {
    if (!import.meta.env.PROD) return;
    Sentry.setUser(null);
  }

  export function trackTransaction(name: string, data: any) {
    if (!import.meta.env.PROD) return { finish: () => {} };
    return { finish: () => {} };
  }

  export function captureCustomEvent(name: string, data: any, level = 'info') {
    if (!import.meta.env.PROD) return;
    Sentry.captureMessage(name, { level, extra: data });
  }