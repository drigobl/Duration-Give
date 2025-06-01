import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Create dist directory
mkdirSync('dist', { recursive: true });

// Copy index.html
copyFileSync('index.html', join('dist', 'index.html'));

// Build the app
esbuild.build({
  entryPoints: ['src/main.tsx'],
  bundle: true,
  outfile: 'dist/main.js',
  loader: {
    '.ts': 'ts',
    '.tsx': 'tsx',
    '.css': 'css'
  },
  target: 'es2020',
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': '"production"'
  }
}).then(() => {
  console.log('Build complete!');
}).catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});