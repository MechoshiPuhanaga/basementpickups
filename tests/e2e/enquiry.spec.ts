import { cartLineKey, resolveConfig } from '../../src/data/pickupConfig';
import { getPickupBySlug } from '../../src/data/pickups';
import { expect, test } from './fixtures';
import { cartLineTestId, ensureConfiguratorOpen } from './helpers';

const SLUG = 'rockroach';
const pickup = getPickupBySlug(SLUG);
if (pickup === undefined) throw new Error(`catalog no longer has ${SLUG}`);

const coveredLine = cartLineTestId(cartLineKey(SLUG, resolveConfig(pickup, { cover: 'nickel' })));

test('shop → product → configure → enquiry cart → contact form', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId(`product-card-${SLUG}`).click();
  await expect(page).toHaveURL(new RegExp(`/products/${SLUG}$`));
  await expect(page.getByTestId('product-title')).toHaveText(pickup.name);

  await ensureConfiguratorOpen(page);
  await page.getByTestId('pickup-configurator-cover-select').selectOption('nickel');
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('add-to-cart')).toHaveText('Added to enquiry (1)');
  await expect(page.getByTestId('cart-announcer')).toHaveText('1 item in your enquiry');

  // Same build again aggregates into the same line.
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-announcer')).toHaveText('2 items in your enquiry');

  await page.goto('/cart');
  const line = page.getByTestId(`cart-line-${coveredLine}`);
  await expect(line).toBeVisible();
  await expect(page.getByTestId(`cart-qty-${coveredLine}`)).toHaveText('2');
  await page.getByTestId(`cart-qty-dec-${coveredLine}`).click();
  await expect(page.getByTestId(`cart-qty-${coveredLine}`)).toHaveText('1');
  await expect(page.getByTestId('cart-subtotal')).toContainText(String(pickup.price));

  // The cart survives a reload (localStorage) and re-keys to the same line.
  await page.reload();
  await expect(page.getByTestId(`cart-line-${coveredLine}`)).toBeVisible();

  await page.route('**/api/contact', async (route) => {
    const body = route.request().postDataJSON() as { items?: { name: string }[] };
    expect(body.items?.[0]?.name).toBe(pickup.name);
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });

  await page.getByTestId('cart-send-enquiry').click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByTestId('enquiry-summary')).toBeVisible();
  await page.getByTestId('contact-form-name').fill('Test Player');
  await page.getByTestId('contact-form-email').fill('player@example.com');
  await page.getByTestId('contact-form-submit').click();
  await expect(page.getByTestId('contact-form-success')).toBeVisible();
  await expect(page.getByTestId('cart-announcer')).toHaveText('Your enquiry list is empty');
});

test('removing the last line shows the empty state', async ({ page }) => {
  await page.goto(`/products/${SLUG}`);
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-announcer')).toHaveText('1 item in your enquiry');
  const defaultLine = cartLineTestId(cartLineKey(SLUG, resolveConfig(pickup, undefined)));

  await page.goto('/cart');
  await page.getByTestId(`cart-remove-${defaultLine}`).click();
  await expect(page.getByTestId('cart-empty')).toBeVisible();
  await page.getByTestId('cart-empty-shop').click();
  await expect(page.getByTestId('shop-page')).toBeVisible();
});

test('a set with variants is not addable until a variant is chosen', async ({ page }) => {
  await page.goto('/products/white-pearl');
  await expect(page.getByTestId('product-variants')).toBeVisible();
  await expect(page.getByTestId('add-to-cart')).toHaveCount(0);
  await page.getByTestId('variant-link-white-pearl-neck').click();
  await expect(page).toHaveURL(/\/products\/white-pearl-neck$/);
  await expect(page.getByTestId('add-to-cart')).toBeVisible();
});
