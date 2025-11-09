/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
    proxy: {
      '/auth': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        // Ensure Set-Cookie from backend applies to current origin
        cookieDomainRewrite: 'localhost',
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  // base: '/productivity-hub-frontend/',
});
