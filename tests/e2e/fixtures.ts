import { expect, test as base } from '@playwright/test';

/**
 * Shared e2e fixtures.
 *
 * `errors` collects uncaught page errors and console errors for the whole
 * test; every test asserts it is empty at the end, so a hydration mismatch,
 * a CSP violation or a Trusted Types rejection fails the run even when the UI
 * still looks fine.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, provide) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      errors.push(`pageerror: ${err.message}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
    });
    await provide(errors);
    expect(errors, 'page and console errors').toEqual([]);
  },
});

export { expect };
