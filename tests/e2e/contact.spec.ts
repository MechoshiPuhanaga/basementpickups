import { expect, test } from './fixtures';

async function fillValid(page: Parameters<Parameters<typeof test>[2]>[0]['page']) {
  await page.getByTestId('contact-form-name').fill('Test Player');
  await page.getByTestId('contact-form-email').fill('player@example.com');
  await page.getByTestId('contact-form-message').fill('Hello from the e2e suite.');
}

test('a server validation error marks and focuses the field', async ({ page }) => {
  await page.goto('/contact');
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ ok: false, error: 'That email looks wrong.', field: 'email' }),
    }),
  );
  await fillValid(page);
  await page.getByTestId('contact-form-submit').click();
  await expect(page.getByTestId('contact-form-field-error-email')).toHaveText(
    'That email looks wrong.',
  );
  await expect(page.getByTestId('contact-form-email')).toBeFocused();
  await expect(page.getByTestId('contact-form-email')).toHaveAttribute('aria-invalid', 'true');
});

test('a server failure offers the mailto fallback (real unconfigured server)', async ({ page }) => {
  await page.goto('/contact');
  await fillValid(page);
  await page.getByTestId('contact-form-submit').click();
  await expect(page.getByTestId('contact-form-error')).toBeVisible();
  const mailto = page.getByTestId('contact-form-mailto');
  await expect(mailto).toHaveAttribute('href', /^mailto:contact@basementpickups\.com\?/);
  await expect(mailto).toHaveAttribute('href', /Hello%20from%20the%20e2e%20suite/);
});

test('a successful send clears the form and announces success', async ({ page }) => {
  await page.goto('/contact');
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
  );
  await fillValid(page);
  await page.getByTestId('contact-form-submit').click();
  await expect(page.getByTestId('contact-form-success')).toBeVisible();
  await expect(page.getByTestId('contact-form-status')).toHaveAttribute('data-status', 'success');
  await expect(page.getByTestId('contact-form-message')).toHaveValue('');
});

test('the honeypot field is present but hidden from visitors', async ({ page }) => {
  await page.goto('/contact');
  const honeypot = page.getByTestId('contact-form-company');
  await expect(honeypot).toHaveAttribute('tabindex', '-1');
  // Clipped to a 1px box by its wrapper: present for bots, invisible to people.
  await expect(honeypot).not.toBeInViewport();
});
