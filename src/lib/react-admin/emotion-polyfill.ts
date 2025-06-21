// Polyfill for Emotion initialization issues
// This ensures React's useInsertionEffect is available for Emotion

import React from 'react';

// Polyfill useInsertionEffect for React 17 compatibility
if (!React.useInsertionEffect) {
  (React as any).useInsertionEffect = React.useLayoutEffect;
}

// Ensure DOM is ready before Emotion initializes
export const ensureDOMReady = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => resolve());
    } else {
      resolve();
    }
  });
};

// Initialize emotion with proper error handling
export const initializeEmotion = async (): Promise<void> => {
  await ensureDOMReady();
  
  try {
    // Ensure emotion cache is properly initialized
    if (typeof window !== 'undefined') {
      // Set process.env.NODE_ENV if not already set
      if (!window.process?.env?.NODE_ENV) {
        window.process = window.process || { env: {} };
        window.process.env.NODE_ENV = import.meta.env.MODE;
      }
    }
  } catch (error) {
    console.warn('Emotion initialization warning:', error);
  }
};

// Early synchronous initialization for main.tsx
export const ensureEmotionInitialized = (): void => {
  try {
    if (typeof window !== 'undefined') {
      // Set process.env.NODE_ENV early
      if (!window.process?.env?.NODE_ENV) {
        window.process = window.process || { env: {} };
        window.process.env.NODE_ENV = import.meta.env.MODE;
      }
    }
  } catch (error) {
    console.warn('Early emotion initialization warning:', error);
  }
};