import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { configDefaults } from 'vitest/config';

export default defineConfig(() => ({
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: 'build', // CRA's default build output
  },
  server: {
    host: process.env.HOST || 'localhost',
    port: 443,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [...configDefaults.exclude, 'e2e', 'cypress'],
  },
}));
