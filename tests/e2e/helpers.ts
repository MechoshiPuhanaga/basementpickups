import type { Page } from '@playwright/test';

import { getSeoForUrl } from '../../src/seo/getSeoForUrl';

export type NavName = 'home' | 'shop' | 'about' | 'articles' | 'faq' | 'contact';

/** Expected document title for a path, from the same resolver the server uses. */
export function titleFor(pathname: string): string {
  return getSeoForUrl(pathname).title;
}

/**
 * Client-side navigate through the header. Desktop shows the primary nav;
 * phone/tablet widths hide it behind the mobile menu.
 */
export async function navigateTo(page: Page, name: NavName): Promise<void> {
  const desktopLink = page.getByTestId(`nav-link-${name}`);
  if (await desktopLink.isVisible()) {
    await desktopLink.click();
    return;
  }
  await page.getByTestId('mobile-menu-trigger').click();
  await page.getByTestId(`mobile-menu-link-${name}`).click();
}

/** Open the product "Configure" disclosure when it is collapsed (phone widths). */
export async function ensureConfiguratorOpen(page: Page): Promise<void> {
  const trigger = page.getByTestId('product-configure-trigger');
  if ((await trigger.count()) > 0 && (await trigger.isVisible())) {
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
  }
}

/** Mirror of `cartLineTestId` in CartPage: line keys are made attribute-safe. */
export function cartLineTestId(lineKey: string): string {
  return lineKey.replace(/[#:,]/g, '-');
}

/** Mark the window so a later check can prove no full reload happened. */
export async function markWindow(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as { __e2eMarker?: number }).__e2eMarker = 1;
  });
}

export function windowMarked(page: Page): Promise<boolean> {
  return page.evaluate(() => (window as unknown as { __e2eMarker?: number }).__e2eMarker === 1);
}
