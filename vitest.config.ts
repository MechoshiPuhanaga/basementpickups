import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

/**
 * Three Vitest projects, one quality gate:
 *
 *   unit         node   — pure logic in src/data, src/seo, src/utils, server/*
 *   component    jsdom  — React components and pages via Testing Library
 *   integration  node   — the real Express app (production build in dist/)
 *
 * Browser journeys live in Playwright (see playwright.config.ts).
 */
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov', 'json-summary'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}', 'server/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'server/**/*.test.ts',
        // Browser bootstrap and the process entry: exercised by Playwright, not Vitest.
        'src/entry-client.tsx',
        'server/index.ts',
      ],
      // Gate: the suite currently sits at ~97% lines / ~92% branches. Thresholds
      // are set a little below so a small refactor doesn't flip the gate red,
      // but any real regression does.
      thresholds: {
        lines: 95,
        statements: 95,
        functions: 95,
        branches: 88,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.ts', 'server/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'component',
          environment: 'jsdom',
          include: ['src/**/*.test.tsx'],
          setupFiles: ['tests/setup/component.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          include: ['tests/integration/**/*.test.ts'],
          testTimeout: 30_000,
          hookTimeout: 60_000,
        },
      },
    ],
  },
});
