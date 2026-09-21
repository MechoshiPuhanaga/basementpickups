import { articles } from '../../src/data/articles';
import { pickups } from '../../src/data/pickups';
import { expect, test } from './fixtures';
import { titleFor } from './helpers';

test('the shop lists every catalog set and filters by magnet', async ({ page }) => {
  await page.goto('/shop');
  for (const pickup of pickups) {
    await expect(page.getByTestId(`product-card-${pickup.slug}`)).toBeVisible();
  }
  // Pick a magnet some sets lack, so the filter visibly removes cards.
  const magnet = pickups.map((p) => p.magnet).find((m) => pickups.some((p) => p.magnet !== m));
  if (magnet === undefined) throw new Error('catalog has a single magnet; nothing to filter');

  const filters = page.getByTestId('product-browser-filters-trigger');
  if ((await filters.count()) > 0 && (await filters.isVisible())) await filters.click();
  await page.getByTestId('product-browser-magnet-select').selectOption(magnet);
  for (const pickup of pickups) {
    const card = page.getByTestId(`product-card-${pickup.slug}`);
    if (pickup.magnet === magnet) await expect(card).toBeVisible();
    else await expect(card).toHaveCount(0);
  }
});

test('an article opens from the index with its SEO title', async ({ page }) => {
  const article = articles[0];
  if (article === undefined) throw new Error('no articles in data');
  await page.goto('/articles');
  await page.getByTestId(`article-card-${article.slug}`).click();
  await expect(page).toHaveURL(new RegExp(`/articles/${article.slug}$`));
  await expect(page.getByTestId('article-body')).toBeVisible();
  await expect(page).toHaveTitle(titleFor(`/articles/${article.slug}`));
});

test('FAQ deep links scroll the entry into view', async ({ page }) => {
  await page.goto('/faq#option-availability');
  await expect(page.getByTestId('faq-item-option-availability')).toBeInViewport();
});

test('the configurator help link lands on the FAQ entry client-side', async ({ page }) => {
  await page.goto('/products/rockroach');
  const trigger = page.getByTestId('product-configure-trigger');
  if ((await trigger.count()) > 0 && (await trigger.isVisible())) await trigger.click();
  await page.getByTestId('pickup-configurator-help').click();
  await expect(page).toHaveURL(/\/faq#option-availability$/);
  await expect(page.getByTestId('faq-item-option-availability')).toBeInViewport();
});
