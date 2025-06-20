import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';

// Initialize Emotion polyfill early to prevent initialization issues
import { ensureEmotionInitialized } from './lib/react-admin/emotion-polyfill';
ensureEmotionInitialized();

import App from './App';
import './index.css';
import './i18n';
import { initSentry } from './lib/sentry';

// Set up Buffer polyfill for Web3 libraries
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

  // Initialize Sentry before rendering
  initSentry();
// Create container
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);