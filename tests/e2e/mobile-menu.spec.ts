import { expect, test } from './fixtures';

test.describe('mobile menu', () => {
  test.beforeEach(({ isMobile }) => {
    test.skip(!isMobile, 'phone/tablet layout only');
  });

  test('opens, traps focus, closes on Escape and navigates', async ({ page }) => {
    await page.goto('/');
    const trigger = page.getByTestId('mobile-menu-trigger');
    await expect(trigger).toBeVisible();
    await expect(page.getByTestId('primary-nav')).toBeHidden();

    await trigger.click();
    const dialog = page.getByTestId('mobile-menu-dialog');
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const mainInert = () =>
      page.getByTestId('main').evaluate((el) => el.closest('[inert]') !== null);
    expect(await mainInert()).toBe(true);

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(await mainInert()).toBe(false);

    await trigger.click();
    await page.getByTestId('mobile-menu-close').click();
    await expect(dialog).toBeHidden();

    await trigger.click();
    await page.getByTestId('mobile-menu-link-shop').click();
    await expect(page).toHaveURL(/\/shop$/);
    await expect(dialog).toBeHidden();
  });

  test('the enquiry badge reflects the cart', async ({ page }) => {
    await page.goto('/products/rockroach');
    await page.getByTestId('add-to-cart').click();
    await page.getByTestId('mobile-menu-trigger').click();
    await expect(page.getByTestId('mobile-menu-badge')).toHaveText('1');
    await page.getByTestId('mobile-menu-enquiry').click();
    await expect(page).toHaveURL(/\/cart$/);
  });
});
