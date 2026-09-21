import { defineConfig, devices } from '@playwright/test';

/**
 * Real-browser tests against the production build (`pnpm run build` first).
 * The server runs on its own port so the dev server on :3000 is left alone.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${String(PORT)}`;
const isCI = process.env['CI'] !== undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASE_URL,
    testIdAttribute: 'data-testid',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'pnpm run start',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 60_000,
    env: { PORT: String(PORT), PUBLIC_ORIGIN: BASE_URL },
  },
});
