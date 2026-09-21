# Skill — Write Tests

Use this whenever code is added or changed. Read `docs/ai/TESTING.md` first.

---

# Steps

1. **Pick the tier** (unit / component / integration / e2e) per `TESTING.md`.
   Most changes need two: the logic tier and the UI tier it surfaces in.
2. **Add test ids** to any new element a test must find. DS components: extend
   `TestIdProps` and forward `'data-testid': testId` to the root (see
   `src/design-system/atoms/Button/Button.tsx`). Internal parts: `${testId}-part` or a
   fixed singleton id.
3. **Write the test next to the code** (`Component.test.tsx`, `module.test.ts`) or in
   `tests/integration` / `tests/e2e`.
4. **Locate by test id, assert behaviour**: aria attributes, text, navigation, storage,
   network calls (mock `fetch` at the boundary).
5. **Run the tier** (`pnpm run test`, or `pnpm run build && pnpm run test:integration`,
   `pnpm run test:e2e`), then `pnpm exec prettier --write` and `pnpm exec eslint` on the
   touched files and `pnpm run typecheck`.
6. **Check coverage** (`pnpm run test:coverage`, open `coverage/index.html`) for the files
   you touched; cover the branches you added.

---

# Templates

Component:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Thing } from './Thing';

describe('Thing', () => {
  it('opens on click', async () => {
    render(
      <MemoryRouter>
        <Thing data-testid="thing" />
      </MemoryRouter>,
    );
    await userEvent.click(screen.getByTestId('thing-trigger'));
    expect(screen.getByTestId('thing-panel')).toBeVisible();
  });
});
```

E2E:

```ts
import { expect, test } from './fixtures';

test('adds a pickup to the enquiry', async ({ page }) => {
  await page.goto('/shop');
  await page.getByTestId('product-card-link').first().click();
  await page.getByTestId('add-to-cart').click();
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

---

# Don'ts

- no text/role/CSS locators
- no snapshots
- no mocking of internal modules
- no `window`/`document` access during render (breaks the SSR-safety test)
- no new test dependencies without approval
