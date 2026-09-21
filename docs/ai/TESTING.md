# Testing — Basement Pickups

The quality gate has four tiers. Every change must keep all of them green.

| Tier        | Tool                                         | Where                                     | Env                                                         |
| ----------- | -------------------------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| static      | tsc, ESLint, Stylelint, Prettier             | whole repo                                | —                                                           |
| unit        | Vitest project `unit`                        | `src/**/*.test.ts`, `server/**/*.test.ts` | node                                                        |
| component   | Vitest project `component` + Testing Library | `src/**/*.test.tsx`                       | jsdom                                                       |
| integration | Vitest project `integration`                 | `tests/integration/**`                    | node, real Express app from `server/app.ts` against `dist/` |
| e2e         | Playwright                                   | `tests/e2e/**`                            | Chromium desktop + Pixel 7, prod server on :3100            |

---

# Commands

```sh
pnpm run test               # unit + component (fast, no build needed)
pnpm run test:watch         # same, watch mode
pnpm run test:unit
pnpm run test:component
pnpm run build && pnpm run test:integration
pnpm run test:coverage      # all Vitest projects + coverage report (needs a build)
pnpm run test:e2e           # Playwright (needs a build; starts the server on :3100)
pnpm run test:e2e:ui        # Playwright UI mode
pnpm run check              # the full gate, in order
```

Reports:

- `coverage/index.html` — v8 coverage (also `lcov.info`, `coverage-summary.json`)
- `playwright-report/index.html` — e2e report; `test-results/` holds traces/screenshots of failures

---

# Rules

## Selectors: `data-testid` only

Tests locate elements **only** via `data-testid`:

- Vitest: `screen.getByTestId('…')`, `within(el).getByTestId('…')`
- Playwright: `page.getByTestId('…')`

Roles, labels and text may be **asserted** afterwards, never used to locate.

Every design-system component exposes an optional `data-testid` prop through the shared
`TestIdProps` type (`src/design-system/testing.ts`) and forwards it to its root element.
Fixed internal parts carry stable kebab-case ids (`${testId}-trigger`, `cart-line-<id>`, …).
Singletons use fixed ids (`site-header`, `main`, `cart-link`, …).

Naming:

- kebab-case, semantic, stable across copy/markup changes
- instance ids include the entity key: `product-card-<slug>`, `cart-line-<lineKey>`
- keep ids in the component, not in pages, unless the page owns the element

## What goes where

- Pure logic (data helpers, SEO resolvers, parsers, builders) → **unit**
- React behaviour (interaction, a11y attributes, state) → **component**, wrapped in
  `MemoryRouter`/`createMemoryRouter` and `CartProvider` when needed
- Anything that only exists with the real server (headers, CSP nonce, redirects, streaming,
  crawler files, API status codes) → **integration**
- Anything that only exists in a real browser (hydration, Trusted Types, service worker,
  localStorage across navigations, focus, layout at mobile width) → **e2e**

## SSR safety

`src/app/routes.ssr.test.ts` (unit project) renders every route to a string in a **node** environment
(no `window`/`document`). A component that touches the DOM during render breaks this test.
Keep it that way: browser-only work belongs in effects.

## Conventions

- explicit imports from `vitest` (no globals)
- `userEvent` for interaction, not `fireEvent`
- no snapshot tests
- mock at the boundary (`fetch`, `resend`, env via `vi.stubEnv`), never internal modules
- each test file starts its own server instance on port 0 (integration)
- e2e tests use the shared fixture in `tests/e2e/fixtures.ts`, which fails a test on any
  page or console error

## Coverage

Coverage is collected for `src/**` and `server/**` (entries excluded). New code is expected
to arrive with tests in the matching tier; check `coverage/index.html` before finishing.
