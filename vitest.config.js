import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Auto import jest-dom matchers
    setupFiles: ['./vitest.setup.js'],
  },
});
