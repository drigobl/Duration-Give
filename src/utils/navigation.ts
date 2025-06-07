import { ENV } from '@/config/env';

/**
 * Allowed redirect paths to prevent open redirect vulnerabilities
 */
const ALLOWED_PATHS = [
  '/give-dashboard',
  '/charity-portal',
  '/login',
  '/register',
  '/auth/callback',
  '/reset-password',
  '/'
] as const;

type AllowedPath = typeof ALLOWED_PATHS[number];

/**
 * Validates that a path is in the allowed list
 */
const isAllowedPath = (path: string): path is AllowedPath => {
  return ALLOWED_PATHS.includes(path as AllowedPath);
};

/**
 * Validates and sanitizes a redirect URL
 */
const validateRedirectUrl = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow same origin redirects
    if (parsedUrl.origin !== window.location.origin) {
      return null;
    }
    
    // Check if path is in allowed list
    if (!isAllowedPath(parsedUrl.pathname)) {
      return null;
    }
    
    return url;
  } catch {
    // If URL parsing fails, check if it's a relative path
    if (url.startsWith('/') && isAllowedPath(url)) {
      return url;
    }
    return null;
  }
};

/**
 * Safely redirects to a URL, validating against open redirect attacks
 */
export const safeRedirect = (path: string, fallback: string = '/'): void => {
  const validatedPath = validateRedirectUrl(path);
  const finalPath = validatedPath || fallback;
  
  // Use router navigation instead of window.location for SPA
  if (window.history && window.history.pushState) {
    window.history.pushState(null, '', finalPath);
    // Trigger a popstate event to notify React Router
    window.dispatchEvent(new PopStateEvent('popstate'));
  } else {
    window.location.href = finalPath;
  }
};

/**
 * Builds a secure URL for the current domain
 */
export const buildSecureUrl = (path: string): string => {
  if (!isAllowedPath(path)) {
    throw new Error(`Invalid path: ${path}. Path not in allowed list.`);
  }
  
  const isDevelopment = ENV.APP_DOMAIN === 'localhost';
  const protocol = isDevelopment ? 'http' : 'https';
  const domain = isDevelopment ? 'localhost:5173' : ENV.APP_DOMAIN;
  
  return `${protocol}://${domain}${path}`;
};

/**
 * Builds a secure app URL (for subdomain routing)
 */
export const buildAppUrl = (path: string): string => {
  if (!isAllowedPath(path)) {
    throw new Error(`Invalid path: ${path}. Path not in allowed list.`);
  }
  
  const isDevelopment = ENV.APP_DOMAIN === 'localhost';
  
  if (isDevelopment) {
    return `http://localhost:5173${path}`;
  }
  
  return `https://app.${ENV.APP_DOMAIN}${path}`;
};

/**
 * Gets the appropriate redirect path based on user type
 */
export const getRedirectPath = (userType: 'donor' | 'charity'): AllowedPath => {
  return userType === 'charity' ? '/charity-portal' : '/give-dashboard';
};

export { ALLOWED_PATHS, type AllowedPath };