import { Buffer } from 'buffer';

// Polyfill for Buffer
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  
  // Also set on globalThis for better compatibility
  globalThis.Buffer = globalThis.Buffer || Buffer;
}

// Export to ensure the module is imported
export {};