import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    })
  ],
  define: {
    global: 'globalThis',
    'process.env': {},
    // Fix for Emotion useInsertionEffect compatibility
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  build: {
    target: 'es2020',
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Emotion and MUI must be in the same chunk to avoid initialization issues
            if (id.includes('@emotion') || id.includes('@mui')) {
              return 'vendor-emotion';
            }
            // React-Admin should be in its own chunk but load after emotion
            if (id.includes('react-admin') || id.includes('ra-')) {
              return 'vendor-admin';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@polkadot')) {
              return 'vendor-web3';
            }
            if (id.includes('lucide-react') || id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'vendor-ui';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            return 'vendor';
          }
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: 'buffer',
      stream: 'readable-stream',
      util: 'util',
      events: 'events',
      // Fix for Emotion package resolution
      '@emotion/use-insertion-effect-with-fallbacks': path.resolve(
        __dirname,
        'node_modules/@emotion/use-insertion-effect-with-fallbacks'
      )
    }
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true
  },
  esbuild: {
    target: 'es2020'
  },
  envDir: '.',
  envPrefix: 'VITE_',
  mode: mode === 'app' ? 'app' : 'production',
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'ethers',
      'viem',
      'buffer',
      'readable-stream',
      'util',
      'events',
      'react-admin',
      'ra-supabase',
      '@emotion/react',
      '@emotion/styled',
      '@emotion/cache',
      '@emotion/use-insertion-effect-with-fallbacks',
      '@mui/material',
      '@mui/system',
      '@mui/styled-engine'
    ],
    exclude: ['@polkadot/api'],
    force: true,
    esbuildOptions: {
      target: 'es2020',
      // Fix for emotion circular dependency issues
      mainFields: ['module', 'main'],
      conditions: ['import', 'module', 'browser', 'default']
    }
  }
}));