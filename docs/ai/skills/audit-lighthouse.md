# Skill — Lighthouse Audit

Use this to measure quality (performance, accessibility, best-practices, SEO)
across the whole site, or after a change that could affect them.

It is a measurement tool, not a fix list — run it, read the results, then decide.

---

# How to run

```sh
pnpm run audit:lighthouse                      # audits the live production site
pnpm run audit:lighthouse http://localhost:3000   # audits a local prod build
```

- Discovers every URL from `<base>/sitemap.xml`, so new products/articles are
  covered automatically (no list to maintain). `/cart` is excluded (it's
  `noindex`, so it isn't in the sitemap).
- Runs Lighthouse on each page and prints a **score table** + a **consolidated
  issue list** (each issue → how many pages it affects).
- Requirements: **Chrome/Chromium installed**. Lighthouse is pulled via `npx`
  on demand — deliberately **not a dependency** (heavy tree, used only here).

Audit the **live site** for the true picture (real Cloudflare headers, HTTPS,
HSTS, compression). Audit a **local build** to check the working tree before
pushing. `localhost` can't show HSTS (HTTP only).

---

# What it covers vs not

**Covers (automated):** performance metrics, accessibility (axe-equivalent
checks: contrast, ARIA, labels, landmarks, heading order, alt text),
best-practices (CSP/HSTS/console errors), SEO.

**Does NOT cover — still needs a human or Playwright:**

- **Offline / PWA / service worker** — modern Lighthouse dropped the PWA
  category. Use a Playwright test for SW registration + offline reload.
- **Real screen-reader** behavior (NVDA/VoiceOver) — automation catches the
  mechanical ~30–50% of WCAG; reading-order-as-heard is human judgment.
- The OS **install-prompt** flow and subjective "is focus obscured" checks.

---

# Reading the results — known non-issues

- **`/cart` SEO low / "blocked from indexing"** — intentional (`noindex`).
- **`render-blocking resources` / `unused JavaScript`** — expected: prod ships a
  render-blocking CSS `<link>` and one bundle (no route code-splitting, per the
  SSR architecture decision). Only chase with critical-CSS inlining / splitting
  if perf becomes a real problem.
- **Console errors on a page that look like `/cdn-cgi/...`** — that's Cloudflare,
  not our code. See `project-cloudflare-ssr-conflicts` memory: keep Cloudflare
  Email Obfuscation / Rocket Loader OFF (they rewrite HTML/JS and break SSR
  hydration + Trusted Types).

# Common real findings + fixes

- **LCP image lazily loaded** → add `priority` to that `Image` (eager +
  fetchpriority=high). Only the one above-the-fold LCP image per route.
- **Image without width/height** (`unsized-images`) → add `width`/`height`
  attributes. Photos via the `Image` atom already have them; watch for plain
  `<img>` (e.g. logos).
- **Label in name mismatch** (`label-content-name-mismatch`) → a link/button's
  visible text must be contained in its accessible name. For rich card links,
  prefer letting the content be the name over a custom `aria-label`.

---

# Workflow

1. Run against the target (live for truth, local before a push).
2. Triage: separate real findings from the known non-issues above.
3. Fix in the design system (see other skills); re-run to confirm.
4. Report; leave the commit to the developer.
