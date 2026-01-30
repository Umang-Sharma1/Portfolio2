import { defineConfig } from 'vitest/config';
// Note: Vitest brings its own Vite types; avoid plugin type mismatches by omitting plugins here.
// If needed later, consider aligning Vite versions or using a local vite config.
// import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@portfolio/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@portfolio/types': path.resolve(__dirname, '../../packages/types/src'),
      '@portfolio/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
});
