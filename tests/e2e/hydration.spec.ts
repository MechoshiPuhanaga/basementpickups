import { expect, test } from './fixtures';
import { markWindow, navigateTo, titleFor, windowMarked } from './helpers';

const ROUTES = ['/', '/shop', '/about', '/articles', '/faq', '/contact', '/cart'];

for (const route of ROUTES) {
  test(`${route} renders server-side and hydrates cleanly`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByTestId('site-header')).toBeVisible();
    await expect(page.getByTestId('main')).toBeVisible();
    await expect(page).toHaveTitle(titleFor(route));
    // React Router's SSR handoff payload is present and the strict CSP let it run.
    const hydrated = await page.evaluate(
      () => (window as { __staticRouterHydrationData?: unknown }).__staticRouterHydrationData,
    );
    expect(hydrated).toBeDefined();
  });
}

test('client-side navigation swaps pages without a full reload', async ({ page }) => {
  await page.goto('/');
  await markWindow(page);
  await navigateTo(page, 'shop');
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByTestId('shop-page')).toBeVisible();
  await expect(page).toHaveTitle(titleFor('/shop'));
  expect(await windowMarked(page)).toBe(true);

  await navigateTo(page, 'faq');
  await expect(page.getByTestId('faq-page')).toBeVisible();
  await expect(page).toHaveTitle(titleFor('/faq'));
  expect(await windowMarked(page)).toBe(true);
});

test('service worker registers under the strict CSP (Trusted Types)', async ({ page }) => {
  await page.goto('/');
  const active = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return registration.active !== null;
  });
  expect(active).toBe(true);
});

test('trailing slashes redirect to the canonical URL', async ({ page }) => {
  await page.goto('/shop/');
  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByTestId('shop-page')).toBeVisible();
});

test('unknown routes return a real 404 with the not-found page', async ({ page }) => {
  const response = await page.goto('/no-such-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByTestId('not-found')).toBeVisible();
  await page.getByTestId('not-found-shop').click();
  await expect(page.getByTestId('shop-page')).toBeVisible();
});

test('skip link moves focus to the main landmark', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByTestId('skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('main')).toBeFocused();
});
