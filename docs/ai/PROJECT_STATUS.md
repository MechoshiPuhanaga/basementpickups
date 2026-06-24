# Project Status — Basement Pickups

This file is the operational memory of the project. Update it at the end of each meaningful session.

---

# Current Milestone

**MVP feature-complete + hardened (2026-06-20).**

All six pages + the enquiry cart, the full design system, the real product catalog with real photos, the real logo/favicon, server-driven SEO (absolute meta, robots, sitemap, JSON-LD structured data, `llms.txt`), security hardening (baseline headers, prod nonce-CSP + Trusted Types, COOP/CORP), the accessibility passes (color + keyboard/screen-reader), woff2 fonts, real 404s, latest-safe dependencies (React 19.2.7, React Router 8.0.1, Vite 8.0.16, TS 6.0.3, ESLint 9), and an offline **PWA** (hand-rolled SW, approach A). All checks green (typecheck / lint / stylelint / prettier / audit / build) in dev + prod.

**Not blocking, still open:**

- ~~Image optimization~~ — **done 2026-06-21**: AVIF/WebP responsive derivatives + DS `Image` atom (`<picture>`); ~2 MB PNGs now serve at ~6–55 KB. See session log.
- **Manual browser/AT testing** — accessibility (screen reader, keyboard, 200%/320px reflow) and PWA (install prompt, offline reload) need a real-browser pass; can't be done headless.
- Real **article photos** (still placeholder SVGs — they fall back to the default OG image in link previews until replaced).

**In progress (uncommitted, 2026-06-23):** responsive / mobile-nav pass + Art Deco separator. New `MobileMenu` organism (burger → full-screen dialog overlay) wired via `MobileNav` + a `NavIcon` atom; a `FilterDisclosure` molecule that collapses the shop filters behind a toggle ≤768px; responsive restacking across `ProductBrowser` / `ArticleBrowser` / `ProductGrid` / `Grid` / `ProductCard`; tighter `Section` top padding on mobile; and a new `DecoSeparator` `crest` variant now used as the header/footer/mobile-menu rule. See the 2026-06-23 session-log entry. Advances roadmap items 1 (responsive) and 2 (Art Deco). **Not yet committed; manual real-device verification still pending.**

Prior milestones (2026-05-23): infrastructure complete, then design-system complete.

---

# Completed Work

## Tooling

- `package.json` with pnpm@11.2.2, Node 24.16.0 engines, exact dependency versions
- `pnpm-workspace.yaml` (used by pnpm 11 for `allowBuilds`)
- `.npmrc` (exact versions, engine-strict, no auto peers)
- `.nvmrc` (24.16.0)
- `.editorconfig`, `.browserslistrc`, `.gitignore`, `.prettierrc`, `.prettierignore`
- TypeScript strictest setup (`tsconfig.json`, `tsconfig.node.json`) — TypeScript 6
- Vite 8 (`vite.config.ts`) with @vitejs/plugin-react 6
- ESLint 9 flat config with typescript-eslint strict-type-checked + stylistic-type-checked + react + react-hooks + prettier
- Stylelint 17 with stylelint-config-standard 40, nesting disabled
- Dockerfile fixed to use real `pnpm run build` / `pnpm start` scripts, base image `node:24.16.0-alpine`
- `src/vite-env.d.ts` for Vite client types (incl. CSS / CSS Modules)

## SSR + routing

- Custom Express SSR server in `server/index.ts`:
  - listens on `process.env.PORT || 3000`
  - dev: Vite middleware (`appType: 'custom'`) + `ssrLoadModule`
  - prod: serves `dist/client/assets` statically, imports `dist/server/entry-server.js`
  - streaming SSR via `renderToPipeableStream` + Writable sink that writes the head, pipes the React stream, then writes the tail in `_final` before `res.end()`
- `server/renderHtml.ts` — splits `index.html` template on `<!--ssr-head-->` and `<!--ssr-outlet-->`
- `server/seo.ts` — renders escaped SEO meta tags
- `src/entry-server.tsx` — React Router 7 `createStaticHandler` + `createStaticRouter` + `StaticRouterProvider`
- `src/entry-client.tsx` — `createBrowserRouter` + `RouterProvider` + `hydrateRoot`
- `src/app/routes.tsx` — single source of truth, every page uses `lazy: () => import(...)` for route-level code splitting (verified: each page is a separate chunk in `dist/client/assets/`)
- `src/app/App.tsx` — shared layout with nav + main + footer
- `index.html` — Vite SSR template with `<!--ssr-head-->` and `<!--ssr-outlet-->` placeholders

## Pages (placeholders only — no visual DS)

- `HomePage`, `ShopPage`, `ProductPage`, `ArticlePage`, `AboutPage`, `ContactPage`, `NotFoundPage`
- All render minimal semantic HTML; `ProductPage` and `ArticlePage` consume `useParams`

## SEO

- `src/seo/seoTypes.ts` — `SeoMeta` type (incl. `ogImageAlt` + optional `article` block: published/modified time, author, tags)
- `src/seo/getSeoForUrl.ts` — pathname-driven SEO resolution with product/article slug lookups against local data; also resolves OG image alt text and article OG metadata
- `src/seo/getJsonLdForUrl.ts` — pathname-driven JSON-LD: `Organization` + `WebSite` (home), `Product` with `Offer`/`AggregateOffer` (products + variants, EUR, `MadeToOrder`), `BlogPosting` (articles), and `BreadcrumbList` (products + articles)
- `server/seo.ts` — `renderSeoTags` (incl. `og:image:alt`, `twitter:image:alt`, `article:*`) + `renderJsonLd` (escaped non-executable data scripts; noindex pages emit none)
- `src/seo/Seo.tsx` — client updater keeps the dynamic subset (incl. image-alt + `article:*`, cleared on non-article routes) in sync on SPA navigation
- Server resolves SEO **before** streaming, injects head tags + JSON-LD into the HTML head
- `/robots.txt`, `/sitemap.xml`, `/llms.txt` served dynamically by the SSR server (`server/index.ts`) with absolute, request-derived origins

## Data

- Canonical typed data files in `src/data/`: `pickups.ts`, `articles.ts`, `navigation.ts`, `brandValues.ts` (each populated with brand-aligned mock content — see "Data realignment" below)

## Utils

- `src/utils/invariant.ts`
- `src/utils/exhaustive.ts`

## DS tokens skeleton (placeholders, no final visual)

- `src/design-system/tokens/reset.css` — modern reset (flat, no nesting)
- `src/design-system/tokens/tokens.css` — semantic CSS variables: colors, spacing, type scale, motion, layout, z-index
- `src/design-system/tokens/fonts.css` — `@font-face` declarations for Poiret One (400), Cormorant Garamond (400 / 400 italic / 500), Inter (400 / 500 / 600), all `font-display: swap`
- `src/design-system/tokens/global.css` — `html`/`body` baseline using tokens

DS folder structure (atoms, molecules, organisms, layouts) exists from prior session.

## DS atoms (completed 2026-05-23)

All 15 atoms in `src/design-system/atoms/`. Each follows the `Atom/{Atom.tsx, Atom.module.css, index.ts}` convention, exposes a semantic-variant API via `data-*` attribute selectors, uses CSS variables from `tokens.css`, native semantic HTML, accessible focus via the global `:focus-visible` ring, SSR-safe.

Decorative (built in earlier session):

- `DecoCorner` — variants `simple` / `stepped` / `double`, 4 positions
- `DecoFrame` — variants `panel` / `product-card` / `hero` / `image`; absolute overlay
- `DecoOrnament`, `DecoSeparator`

Layout primitives:

- `Box` — `padding` / `paddingInline` / `paddingBlock` (none/sm/md/lg/xl), polymorphic `as`
- `Stack` — `direction` (column/row), `gap` (none/xs/sm/md/lg/xl/2xl), `align`, `justify`, `wrap`
- `Grid` — `columns` (1-4), `gap`, `align`; collapses to 1 col under 768px
- `Surface` — `variant` (base/raised/sunken), `border` (none/line/gold)
- `Separator` — semantic `<hr>`, `orientation` horizontal/vertical, `tone` line/gold

Typography:

- `Heading` — `level` 1-6, `variant` (hero/display/section/editorial), `align`, `tone`; responsive size collapse at 768px
- `Text` — `variant` (body/lead/editorial/label/meta), `tone`, `align`, `weight`, `italic`, polymorphic `as`
- `Price` — `amount` + `currency`, `size`, `tone`; tabular numerals, small currency prefix glyph

Interactive:

- `Button` — `variant` (primary/ghost/solid), `size` sm/md/lg; uppercase Inter tracked label; hover swaps fill/border
- `IconButton` — square, required `label` → aria-label, `variant` ghost/outlined
- `Badge` — `variant` outline/soft/solid × `tone` gold/muted × `size` sm/md

Form:

- `Input` — `inputSize`, `invalid`; sunken sunken-tinted dark fill, gold focus border
- `Textarea` — `textareaSize`, `invalid`; same visual language as Input, vertical resize
- `Select` — wrapped native `<select>` with custom gold chevron overlay; `selectSize`, `invalid`

Decorative wrapper:

- `Frame` — composes `DecoFrame` over content with `padding` scale; `variant` mirrors DecoFrame

API conventions used consistently across all atoms:

- Variants/sizes via `data-variant`, `data-size`, etc. selectors inside the CSS Module (per `DESIGN_SYSTEM.md` § CSS Modules Convention)
- Optional props typed as `T | undefined` to satisfy `exactOptionalPropertyTypes`
- Native HTML attributes preserved via `Omit<HTMLAttributes<…>, 'className' | 'size'>` + explicit `className` slot
- No external dependencies beyond React

## DS molecules (completed 2026-05-23)

All six molecules in `src/design-system/molecules/`. Each composes atoms only (no organisms or business logic), follows the `Molecule/{Molecule.tsx, Molecule.module.css, index.ts}` convention, and renders the corresponding page-mock pattern from `design/references/`.

- `ProductCard` — `<Link>` (react-router) wrapping `Frame(variant='product-card')` with square image + caps `Heading` + `Price`; optional category label. Drives shop-page grid + home highlights. Hover lifts card slightly.
- `ArticleCard` — `<Link>` wrapping landscape (4:3) image + `Text(variant='label')` meta line (category · formatted date via `Intl.DateTimeFormat`) + `Heading(variant='editorial')` italic title + muted editorial summary. No frame — open editorial look. Hover scales image subtly.
- `BrandValueCard` — centered icon slot (`ReactNode` prop) + `Heading(variant='section')` + muted editorial description. Used in the About page brand-values row.
- `NewsletterSignup` — `<form>` with hidden `<label>` (clip-path inset), email `Input`, submit `Button`. Inline by default, stacks vertically under 540px. Optional `onSubmit(email)` callback; default no-op (visual demo).
- `ContactForm` — name / email / subject (Select with sensible defaults) / message (Textarea) / submit `Button`. Visible per-field labels styled as uppercase tracked Inter. Exposes `ContactFormData` type. Optional `onSubmit(data)` callback.
- `ProductGallery` — `Frame(variant='image')` main image + thumbnail tablist (`role="tablist"` / `role="tab"` / `aria-selected`). Active index is local `useState`, defaults to 0 — SSR renders the first image, hydration takes over for clicks.

Data-type extensions originally made for these molecules (`Product` with price/imageUrl/category, `Article` with imageUrl/publishedAt/category) were **superseded the same day** by the canonical types in `DATA_MODEL.md` — see § "Data realignment" below.

Form-handler typing: `FormEvent` / `FormEventHandler` are flagged deprecated in the current `@types/react`. Both forms (`NewsletterSignup`, `ContactForm`) use inline arrow handlers on the `<form onSubmit>` prop so TS infers the parameter type from JSX context — no explicit React event type needed. `FormData.get()` is narrowed via a small `readField(formData, key)` helper to handle the `File | string` union safely (no `[object Object]` stringification).

## Data realignment to canonical models (completed 2026-05-23)

Before starting organisms, the in-flight data shapes were realigned to match the canonical models in `docs/ai/DATA_MODEL.md`.

Data files (in `src/data/`):

- `pickups.ts` (replaces `products.ts`) — canonical `Pickup` type with `id`, `slug`, `name`, `description`, `type` (humbucker/single/p90), `magnet` (alnico-2/3/4/5/8/ceramic/neodymium), `price`, `positions[]`, `colors[]`, `conductors[]`, `potting`, `specs {inductance?, dcr?}`, `images {main, gallery?}`, optional recursive `variants[]`. Six top-level mock pickups: `black-dog`, `cathedral`, `aurora`, `silver-bell`, `mojave`, `workshop-one` — three of which carry `variants[]` to exercise the canonical variant pattern: `black-dog` has neck/bridge calibrated pair + cosmetic `aged-nickel` variant; `silver-bell` has a 3-piece Strat-style set (neck / middle RWRP / bridge); `workshop-one` has a matched neck-and-bridge pair. The other three (`cathedral`, `aurora`, `mojave`) intentionally have no variants — the mocks exercise both rendering paths. `getPickupBySlug(slug)` flattens parent + variant slugs into a single lookup, so `/products/black-dog-neck`, `/products/silver-bell-middle`, `/products/workshop-one-bridge`, `/products/black-dog-aged-nickel` etc. all resolve directly through the SEO layer. Position variants reuse the parent's main SVG path; the one cosmetic variant has its own SVG file under `/assets/images/products/black-dog-aged-nickel/main.svg` (warmer/dimmer gold tone using `--color-accent-gold-soft`).
- `articles.ts` — canonical `Article` with `headline` (not `title`), `subheadline?`, `excerpt` (not `summary`), `body`, `keywords[]`, `mainImage: ArticleImage`, optional `images[]`, `metadata: {publishedAt, updatedAt?, author?}`. Four mock articles: `the-language-of-paf`, `scatter-winding-by-hand`, `aging-an-alnico-magnet`, `installation-without-regret`. `getArticleBySlug(slug)` lookup.
- `brandValues.ts` — added `icon: BrandValueIcon` (union of `'handwound' | 'materials' | 'tone' | 'workshop'`) to the shape. Three mock values, one per icon (handwound + materials + tone — workshop reserved for future).
- `navigation.ts` — extended to five entries to match the reference's nav (`Home`, `About`, `Shop`, `Articles`, `Contact`).

`DATA_MODEL.md` updated with new canonical sections for `BrandValue` (including the `BrandValueIcon` union) and `NavLink`. These were missing from the doc but referenced from `ARCHITECTURE.md`.

Image placeholders (in `public/assets/images/`):

- Ten per-item Art Deco SVG placeholders (one per pickup, one per article) — dark surface fill, gold linework, corner ornaments, item-specific central motif (humbucker silhouette / single-coil rail / P90 with dog-ears / concentric coil rings for scatter-winding / Alnico bar magnets / control-cavity wiring diagram). Each ~1–2 KB. Real photography slots in later by replacing the file in place.

Routing + SEO:

- New `/articles` index route + `pages/ArticlesIndexPage` stub (currently a placeholder, like the other pages — gets real content during the page-implementation milestone)
- `getSeoForUrl.ts` switched to `getPickupBySlug` and reads `pickup.name`/`pickup.description`; for articles it now reads `article.headline`/`article.excerpt`; new `/articles` SSR title resolves
- Verified SSR titles: `/products/black-dog` → `Black Dog | Basement Pickups`, `/articles/the-language-of-paf` → `The Language of PAF | Basement Pickups`, `/articles` → `Articles | Basement Pickups`. Unknown slugs (`/products/sample-product`, etc.) still fall through to the Not Found SEO fallback as expected.

Molecule refactors:

- `ProductCard` — prop renamed `product → pickup: Pickup`. Image source is now `pickup.images.main`. The category-style label above the heading is derived from `pickup.type` via a tiny `TYPE_LABEL` record (`humbucker → "Humbucker"`, `single → "Single Coil"`, `p90 → "P-90"`).
- `ArticleCard` — reads `article.headline`/`article.excerpt`/`article.mainImage.src`/`article.metadata.publishedAt`. Meta line is just the formatted date now (the previous `category` field is gone; keywords are not categorical in the same way).
- `BrandValueCard` — `icon: ReactNode` prop dropped; instead the molecule maps `value.icon` (one of the `BrandValueIcon` identifiers) to a small inline SVG via an internal `renderIcon()` switch. The icon SVGs are restrained Art Deco motifs (concentric coil for `handwound`, segmented bar magnet for `materials`, dual sine wave for `tone`, diamond + cross for `workshop`). All draw in `currentColor` so the molecule can tint via CSS.
- `ProductGallery` — no refactor needed. Its API already takes a generic `ProductGalleryImage[]`, so the page can build the array from `Pickup.images.main` + `Pickup.images.gallery` when the page-implementation milestone arrives.

All checks (`typecheck`, `lint`, `stylelint`, `build`, `dev SSR`) clean post-realignment.

## DS organisms (completed 2026-05-23)

All five organisms in `src/design-system/organisms/`. Each composes molecules + atoms only; no business logic, no page ownership.

- `Header` — centered Poiret wordmark (`<Link to="/">`) over a `<nav aria-label="Primary">` driven by `navigation.ts`. Uses React Router `NavLink` with `end={true}` on `/` so the home-active state doesn't stick on every route. Active state via a `styles.navLinkActive` class from NavLink's `className` callback. Between nav items: a small CSS-rendered diamond ornament via `.navItem + .navItem::before` sibling combinator. Below the nav: a thin gold separator bracketed by two `DecoCorner` atoms (`bottom-left` / `bottom-right`, size 16). Nav items have `flex-shrink: 0` per the `feedback-responsive-no-shrink` memory — they wrap to a new line on narrow widths rather than compressing. Sub-540px the wordmark drops to 1.5rem and ornament margins tighten.
- `Footer` — mirrors the header's separator at the top (this time with `top-left` / `top-right` corners). `Grid columns={3}` with three columns: brand block (smaller wordmark + short editorial line) / Stay-in-tune (`NewsletterSignup` molecule + heading + lead) / Navigate (vertical list of nav links). Bottom row is a centered copyright line above a thin muted top-border. The 3-col Grid collapses to one column under 768px via the atom's built-in media query.
- `Hero` — section with two flex columns (image | content). `data-image-position` attribute swaps to `row-reverse` when `imagePosition="right"`. Image side uses `Frame variant="hero"`. Content stack: optional gold-tone eyebrow / `Heading level={1} variant="hero"` (drops to display size under 768px via the Heading atom) / Cormorant lead / CTA row. Both columns set `flex-grow: 0; flex-shrink: 0; flex-basis: ~47%` so they don't shrink-fit; under 768px the layout becomes `flex-direction: column` with `inline-size: 100%`. CTA row is wrapping flex with `flex-shrink: 0` on children. CTAs use `<Button linkTo="…" />`.
- `ProductGrid` — optional header (eyebrow / centered display heading / centered lead) + `Grid columns={3}` of `ProductCard` molecules. `columns` prop is overridable. Drives `/shop` and home featured-products.
- `ArticleGrid` — same header pattern + `Grid` of `ArticleCard` molecules. Drives home latest-articles and `/articles` index.

Button refactor: added optional `linkTo?: string` prop. When present, Button renders a `<Link>` (react-router) instead of `<button>`, identical visual styling. Original discriminated-union shape was tried and reverted in favor of a single `ButtonProps` interface with `linkTo` as one more optional prop — cleaner component code, no ESLint suppressions. Trade-off: native HTML button-only props (onClick, disabled, etc.) remain spreadable when `linkTo` is set, but they're harmlessly dropped at runtime.

Responsive guidance (new memory `feedback-responsive-no-shrink`): for substantive flex layouts in this project, prefer `flex-shrink: 0` on direct children plus `flex-wrap` / breakpoint-driven `flex-direction: column` over compression. The Grid atom path is unaffected — `minmax(0, 1fr)` cells already preserve proportions and collapse to one column under 768px.

All checks clean. Organisms not yet wired into pages.

## DS layouts (completed 2026-05-23)

Four layouts in `src/design-system/layouts/`. Layouts own page-level structural composition only — no business logic, no DS atoms reinvented.

- `PageShell` — flex-column root with `min-block-size: 100vh`, contains `<Header />` + `<main id="main">{children}</main>` + `<Footer />`. Main flexes to push the footer to viewport bottom on short pages. The shared route shell `src/app/App.tsx` was simplified to `<PageShell><Outlet /></PageShell>` — the inline nav/footer/header markup previously living in App.tsx is gone. Every route now SSR-renders with the real Header + Footer.
- `Section` — vertical-rhythm primitive used by pages to group blocks. Props: `spacing` (sm/md/lg/xl → space-6 / space-7 / space-8 / space-9 vertical padding, with under-768px softening for lg/xl), `maxWidth` (narrow=40rem / default=`var(--layout-max-inline)` / wide=90rem / full=no-cap), `as` for polymorphic element. Horizontal `--layout-gutter` padding always present. Inner div carries the max-width inset.
- `ProductLayout` — two-column flex layout for the product detail page. Slot-based: `gallery` (left/52%) and `details` (right/42%). Both sides set `flex-grow: 0; flex-shrink: 0; flex-basis: 52%|42%` per the no-shrink rule. Restacks to a single column under 900px (slightly wider breakpoint than Hero — product details get cramped earlier).
- `ArticleLayout` — editorial reading layout for article detail. Slot-based: optional `hero` (max-width = layout max), required `header` (max-width = 48rem for headline + meta), required `body` (max-width = 40rem editorial reading width), optional `aside` (max-width = layout max). Each slot self-centers via `margin-inline: auto`. No global responsive collapse needed — single column already.

All checks (typecheck, lint, stylelint, build, dev SSR) clean. Verified SSR HTML now contains the rendered Header wordmark + Footer copyright across all seven routes (`/`, `/shop`, `/about`, `/contact`, `/articles`, `/products/:slug`, `/articles/:slug`).

## Page composition (completed 2026-05-23)

All eight pages (`HomePage`, `ShopPage`, `ProductPage`, `ArticlePage`, `AboutPage`, `ContactPage`, `ArticlesIndexPage`, `NotFoundPage`) replaced with DS-driven compositions. The old `<h1>placeholder</h1>` stubs are gone. All pages now compose Section + organisms + molecules + atoms, no page-level CSS escape hatches.

- `HomePage` — Hero (`Tone that's built different` / two CTAs) → ProductGrid featured trio → ArticleGrid latest trio.
- `ShopPage` — single Section + ProductGrid over all 6 top-level pickups.
- `ProductPage` — ProductLayout (gallery / details), built from `getPickupAndParent(slug)`. Gallery is `ProductGallery` over `[main, ...gallery]`. Details column: gold type label, display heading, large Price, editorial description, position Badge row, VariantSelector (renders `Base` + variant Buttons with `linkTo` to each variant slug; active variant is `primary`, others are `ghost`), 2-column specs grid (collapses to 1 col under 540px), solid `Add to cart` Button. Renders a graceful "Pickup not found" Section if the slug doesn't resolve.
- `ArticlePage` — ArticleLayout with hero (16:9 image + optional caption), header (gold meta line `date · author` + display headline + Cormorant lead subheadline), body (article body string `.split(/\n{2,}/)` → array of editorial paragraphs). Falls back to a friendly Not Found Section for unknown slugs.
- `AboutPage` — two Sections: narrow editorial intro ("The art of handwound"), then Grid of three `BrandValueCard` molecules.
- `ContactPage` — section heading + two-column layout (`ContactForm` 58% / contact-info aside 36%, stacks under 768px).
- `ArticlesIndexPage` — Section + ArticleGrid over all 4 articles.
- `NotFoundPage` — branded 404 inside narrow Section: gold `404` eyebrow → "Off the bench" display heading → editorial lead → two-button row (Return home / Shop pickups).

Page-level CSS lives only in `*.module.css` files colocated with the page (ProductPage, ArticlePage, ContactPage), and contains only layout glue that wasn't worth lifting into a DS primitive (the specs grid, hero aspect ratio, contact two-column split).

## SEO + client-side metadata (completed 2026-05-23)

- Added `src/seo/Seo.tsx` — uses React Router's `useLocation()` + the existing `getSeoForUrl(pathname)` and renders `<title>`, `<meta name=description>`, `<link rel=canonical>`, `<meta property=og:title>`, `<meta property=og:description>`, `<meta property=og:type>`, optional `<meta property=og:image>` as JSX.
- Mounted once at the top of `PageShell`, so every route triggers a re-render on navigation. React 19's built-in document metadata hoisting then updates `<head>` on the client. **No `react-helmet` dependency.**
- Server-side template injection (existing `server/seo.ts` + `<!--ssr-head-->` placeholder) is intentionally **kept** as the SEO source-of-truth for the initial HTML — non-JS crawlers and the first paint always have the right `<head>` tags without depending on hydration.
- Known SSR behavior: the same `<title>`/`<meta>` tags appear twice in the initial HTML stream — once in `<head>` (server template) and once inside `<div id="root">` (React's metadata JSX). This is the documented trade-off of pairing custom-template SSR with React 19 metadata hoisting in a setup where React doesn't render the full `<html>` document. After hydration, React 19's resource manager consolidates them in `<head>`. The duplicates are inert during initial render (browsers and crawlers use the head copy). Verified across `/`, `/shop`, `/about`, `/contact`, `/articles`, `/products/black-dog`, `/products/black-dog-neck`, `/products/black-dog-aged-nickel`, `/articles/the-language-of-paf` — all return correct SSR titles + meta.

## Variant lookup helper (completed 2026-05-23)

`src/data/pickups.ts` gained `getPickupAndParent(slug)` returning `{ pickup, parent }`. Used by `ProductPage` to detect whether the current slug is a variant and render the parent's full variant family in the selector. `getPickupBySlug` still works as before.

## SSR hydration fix (completed 2026-05-23)

After the first end-to-end test, every route rendered the layout twice — the top copy was dead SSR HTML (links did full reloads) and the bottom was the live React tree. Root cause: `routes.tsx` used `lazy: () => import('../pages/...')` on every route, **and** `createAppBrowserRouter()` called `createBrowserRouter(routes)` without forwarding `window.__staticRouterHydrationData`. So on the client the matched route's `Component` was undefined while the dynamic import was in flight, the SSR DOM had the fully rendered page already, and React 19 bailed out of hydration cleanup — appending a fresh client tree alongside the SSR HTML instead of replacing it.

Fix applied (Option A — drop lazy, wire hydrationData):

- `src/app/routes.tsx` — all eight routes switched from `lazy: () => import(...)` to direct `Component:` imports.
- `src/app/router.ts` — reads `window.__staticRouterHydrationData` and forwards it as `hydrationData` to `createBrowserRouter`. Uses TS type extraction (`NonNullable<Parameters<typeof createBrowserRouter>[1]>['hydrationData']`) to get the right shape without manually reaching into RR internals.
- `src/vite-env.d.ts` — added a global `Window.__staticRouterHydrationData?: unknown` declaration.

Bundle impact: route-level code splitting is gone for now. Main client bundle went from ~286 kB → ~330 kB raw (~91 kB → ~103 kB gzipped). Negligible at this size; the seven page modules were under 1 kB each. Component-level code-splitting (`React.lazy` + `<Suspense>` inside large pages) remains an option if a single page grows large later — re-adding route-level `lazy` is the trap that bit us and would need preload links + Suspense boundaries to redo correctly. Recorded in `memory/project-ssr-router-pattern.md`.

Verified post-fix: each route emits exactly one PageShell in SSR HTML; `window.__staticRouterHydrationData` script is present; SPA navigation works (developer confirmed in-browser).

---

# Verified

- `pnpm install` — clean (esbuild postinstall allowed via `pnpm-workspace.yaml` `allowBuilds`)
- `pnpm run typecheck` — passes (TypeScript 6 strict)
- `pnpm run lint` — passes (ESLint 9 + typescript-eslint strict-type-checked)
- `pnpm run stylelint` — passes (post-atom-batch: `--fix` corrected legacy `currentColor` → `currentcolor` in DecoFrame/DecoSeparator and migrated two media queries to range notation)
- `pnpm run build` — passes. After the hydration fix, route-level code-splitting was removed; the seven pages now ship in the single main client bundle (~330 kB raw / ~103 kB gzipped). Server bundle ~201 kB / ~46 kB gzipped.
- `pnpm run dev` — `http://localhost:3000` serves all 8 routes (now incl. `/articles`) with correct SSR HTML, route-aware SEO head tags, and clean single-tree hydration (verified by the developer in-browser).
- `pnpm start` (prod) — serves built assets + SSR-renders pages with injected JS/CSS asset paths

---

# CSS Strategy Decision (carry into next session)

- DS component styles: **CSS Modules** (`.module.css`), one per component, colocated, flat selectors only
- Global CSS (token / reset / fonts / global): plain `.css` in `src/design-system/tokens/`
- Variant differentiation via `data-*` attribute selectors inside the module
- No nesting, no `:global`, no `composes` (unless explicitly justified)
- Documented in `docs/ai/IMPLEMENTATION_RULES.md` + `docs/ai/DESIGN_SYSTEM.md` + `CLAUDE.MD` + `CLAUDE_SESSION_START.md`

---

# Version Pins

- Node: 24.16.0 (use via nvm; default shell 22.12.0 is too old for pnpm)
- pnpm: 11.2.2
- React: 19.2.7 / react-dom: 19.2.7
- React Router: 8.0.1 (library mode, not framework mode)
- Vite: 8.0.16 / @vitejs/plugin-react: 6.0.2
- TypeScript: 6.0.3 (ceiling: typescript-eslint peer is `<6.1.0`)
- typescript-eslint: 8.61.1
- ESLint: 9.39.4 (held on 9.x because `eslint-plugin-react@7.37.5` peer is `<= ^9.7`; bump to ESLint 10 when plugin updates)
- Express: 5.2.1
- Stylelint: 17.13.0 / stylelint-config-standard: 40.0.0
- Prettier: 3.8.4
- tsx: 4.22.4 (in `dependencies` because used in `pnpm start`)
- @types/node 24.13.2 (kept on 24.x to match Node 24 runtime; 26.x available)
- pnpm-workspace.yaml `overrides` (exact security pins): esbuild 0.28.1 / js-yaml 4.2.0 / @babel/core 7.29.7

---

# Open Notes / Carry-Forward

- ~~The `*` catch-all returns 200~~ — **resolved**: `getStatusForUrl` now sends real 404s for the splat route + unknown slugs.
- React Router's `StaticRouterProvider` emits an inline hydration `<script>` (`window.__staticRouterHydrationData`); it now carries the per-request CSP **nonce**. Revisit serialization/escaping only if/when real loader data is added.
- No route-level code splitting (direct imports + hydrationData — see memory `project-ssr-router-pattern`); the client ships as one main bundle (re-adding `lazy` needs preloads + Suspense, the trap noted in that memory).
- ~~Pickup prices are placeholders~~ — **resolved 2026-06-21**: real euro prices edited directly into `pickups.ts` by the developer (e.g. €125 / €140).
- `data/svg-art-source` was briefly used (Magnific Art Deco vectors) but reverted at the developer's request — see the 2026-06-20 session entry. **The Magnific sheets were deleted 2026-06-21.** The developer has since **repopulated `public/assets/svg-art/` with a new vector library (2026-06-23)** — Noun Project Art Deco corners/dividers/frames/stamps/patterns + brand `noun-logo-*` marks. These are the developer-provided replacements, **not** the rejected Magnific sheets. First use: the `DecoSeparator` `crest` variant tints `noun-art-deco-3292686.svg` as its centre emblem via CSS `mask` + `currentColor`. These assets are a _source palette_ — keep ornamentation expressed through the in-house `Deco*` atoms (mask/inline + `currentColor`), do **not** drop raw `<img>` vectors into pages. See memory `feedback-magnific-vectors-rejected`.

---

# Remaining Work (not in this milestone)

## Design system implementation — remaining

Pulling visual decisions from `design/references/basement-pickups-web-app-concept-design.png`.

1. ~~DS atoms~~ — **done 2026-05-23**
2. ~~DS molecules~~ — **done 2026-05-23**
3. ~~DS organisms~~ — **done 2026-05-23**
4. ~~DS layouts~~ — **done 2026-05-23**
5. ~~Page visual implementations~~ — **done 2026-05-23**
6. ~~Real product data + photos~~ — **done 2026-06-20** (article copy real; article _images_ still placeholder SVGs)
7. ~~Open Graph imagery~~ — **done 2026-06-21**: optimizer emits a 1200×630 JPEG (`<name>-og.jpg`) per photo; `og:image` (+ secure_url/type/width/height) points at it. Fixes photo-less link previews (heavy PNG was over scraper size caps).
8. ~~Accessibility audit~~ — **done 2026-06-20** (color + keyboard/SR); **manual browser/AT pass still TODO**
9. Performance pass — **woff2 fonts done**; **image optimization done 2026-06-21** (AVIF/WebP responsive `<picture>`); bundle is reasonable

## Open infrastructure follow-ups

- `eslint-plugin-react` ESLint 10 compatibility — still blocking the ESLint 9→10 bump; revisit when upstream updates the peer
- ~~Logo / favicon~~ — **done** (favicon = `BP_Gold_logo.svg`; header/footer use `BP_Gold_horizont.svg`)
- ~~robots.txt / sitemap~~ — **done** (served dynamically by the SSR server)
- ~~404 status for the splat route~~ — **done** (`getStatusForUrl` → real 404s)
- Consider compiling `server/index.ts` to JS for production instead of running via tsx (small perf gain; current setup keeps `tsx` in `dependencies`)
- **PWA SW**: bump `VERSION` in `public/sw.js` on any worker change; needs a real-browser install/offline test before launch
- **Cloudflare: turn Email Obfuscation OFF** (Scrape Shield) — it rewrites the `/contact` email + injects a decode script that Trusted Types blocks → React #418 hydration error + broken email for users. Keep Rocket Loader / Mirage off too. See memory `project-cloudflare-ssr-conflicts`.

## Roadmap (next)

1. **Responsive design pass** — _in progress (2026-06-23, uncommitted)_: mobile nav overlay, collapsible filters, browser/grid restacking, and tighter mobile section padding landed. **Still to do:** real-device verification of breakpoints, touch-target sizes, and 320px/200% reflow. Follow the no-shrink-flex rule (memory `feedback-responsive-no-shrink`) — restack/wrap at breakpoints rather than compress.
2. **Art Deco SVG ornamentation** — _in progress (2026-06-23)_: new `DecoSeparator` `crest` variant now rules the header/footer/mobile menu. **Still to do:** expand the **in-house** `DecoCorner` / `DecoFrame` / `DecoSeparator` / `DecoOrnament` atoms across the site (section corners, panel/hero frames, editorial separators, CTA/footer ornaments). Derive from `design/references/` + `SVG_SYSTEM.md`, drawing from the new `svg-art` palette. **In-house only — do NOT reintroduce the rejected Magnific vectors** (memory `feedback-magnific-vectors-rejected`).
3. **Prefetch all resources on load (non-blocking) for offline** — after first paint and while the connection is idle, warm the cache with the rest of the site's assets (route chunks, product/spirit images + their AVIF/WebP derivatives, fonts) so a subsequent offline visit has everything. Must be **non-blocking**: kick off after `load`, ideally gated on `requestIdleCallback` and `navigator.connection` (skip on save-data / slow links). Coordinate with the existing hand-rolled service worker (`public/sw.js`, approach A) — bump its `VERSION` and decide between SW-side precache vs. client-driven `fetch`/`<link rel=prefetch>`. Respect the CSP and don't regress LCP/TBT.
4. **Bobbin colour selection in the enquiry** — _data + display done (2026-06-24): `pickup.hardware.bobbinColors` holds **name tokens** (not hex); `bobbinColorLabel` (`src/data/bobbinColors.ts`) is the single token→label source; the `Swatch` atom shows them as Art Deco chips (hex lives only in its CSS). See session log._ **Still to do:** a DS **colour-picker widget** (built on `Swatch`) to choose a bobbin colour **before** adding to the enquiry; store the chosen colour on the enquiry-cart line; show the swatch next to each pickup in the enquiry and let the user **switch** it there. The prefilled contact mailto must list **human-readable colour names** (via `bobbinColorLabel`), never hex. Stays within the no-payments enquiry model (memory `project-enquiry-cart`). Touches the cart line shape, ProductPage (selector), and CartPage (per-line swatch + edit). The chosen configuration is stored on the enquiry-cart line and is **editable in the enquiry per configured pickup**. Stays within the no-payments enquiry-cart model (memory `project-enquiry-cart`): the selection just enriches the prefilled contact mailto. Touches `DATA_MODEL.md` (pickup colour options), the cart line shape, ProductCard/ProductBrowser (selector), and the CartPage (per-line edit).
5. ~~**Q&A / FAQ page**~~ — **done 2026-06-24**: `/faq` page (`src/pages/FaqPage`) renders `FAQ_ITEMS` (`src/data/faq.ts`) with the in-house Art Deco `FaqIcon` atom, composed from DS primitives (no page CSS). Wired into routing, `primaryNav` (label "Q&A", with a new `faq` `NavIcon` glyph for the mobile menu), SSR SEO (`getSeoForUrl` + `STATIC_PATHS`), sitemap, `llms.txt`, and **`FAQPage` JSON-LD** + breadcrumb in `getJsonLdForUrl.ts` (expandable rich-result eligible). Copy stays editorial, < 50 words each; **the list is extensible — more entries may be added** by appending to `FAQ_ITEMS`.
6. **Shop facets — spacing, then position** _(deferred; revisit when the catalog grows or singles/middle land)_. Both are pure `ProductBrowser` additions — the data model already carries `hardware.spacingMm` and `positions`. **String spacing is the higher-value facet** (a fitment/compatibility decision, and it actually narrows the list: current values 49.2 / 50 / 52 mm) — do it first. **Position** (neck / bridge, plus `middle` once single-coils exist) is lower value while every product has a bridge option (a "bridge" filter would match everything). Build notes for both: a pickup must match if **any** of its values — including variants — falls in the bucket (e.g. White Pearl appears under both 50 and 52 mm; Twin Bliss's `[50, 52]` matches both). Consider friendly labels for spacing (e.g. note 52 mm = F-spaced). Skip while the catalog is ~7 items and fits on one screen; the brand stays deliberately restrained. _Why deferred: low narrowing payoff on a tiny catalog + set/variant matching semantics to maintain._

---

# Session Log

## 2026-06-24 — Q&A / FAQ page (content, Art Deco icons, full wiring)

Built the FAQ as a real page (roadmap item 5, now done).

- **Content**: `src/data/faq.ts` (`FAQ_ITEMS`) — 10 restrained, editorial Q&As (< 50 words each), British spelling, extensible by appending. Covers made-to-order/lead time, the marks of handwork, batch-to-batch material/colour variation, measurement conditions (18–22 °C / 40–50% RH), specs-are-averages, per-build measurement, elegant packaging (with measured values printed), the baseplate wiring label, custom/signature builds (enquiry, case-by-case pricing), and the standard four-conductor wiring colour code.
- **Icons**: new `FaqIcon` DS atom — 10 in-house Art Deco line icons (wound bobbin, fingerprint whorl, three lozenges, thermometer + droplet, bell curve, gauge dial, wrapped parcel, baseplate + colour-coded leads, pen-nib signature, two-coil series link), NavIcon conventions (24×24, `currentColor`, non-scaling stroke).
- **Page**: `src/pages/FaqPage` — pure DS composition (Section/Stack/Heading/Text/DecoSeparator + FaqIcon), **no page CSS**. Eyebrow + display H1 + medallion separator, then each item as icon + H2 question + muted answer.
- **Wiring**: route (`/faq`, direct import), `primaryNav` ("Q&A") + new `faq` `NavIcon` glyph mapped in `MobileMenu`, SSR SEO (`getSeoForUrl` + `STATIC_PATHS`), sitemap, `llms.txt`, and **`FAQPage` JSON-LD** + breadcrumb (`getJsonLdForUrl.ts`).
- **Verified**: typecheck/lint/stylelint/format/build green; `/faq` 200, title, 10 questions, FAQPage JSON-LD with 10 `Question`s, present in sitemap + llms.txt + nav. **Note:** desktop header now has 6 nav links — eyeball the header at desktop width.

## 2026-06-24 — Pickup hardware/config: data + model + JSON-LD + Art Deco swatches

Extended every product with its real build/configuration spec (string spacing, bobbin colors, pole pieces, cover, 7-string) across the whole stack.

- **Raw data** (`data/pickups-data.txt`): added a "Configuration" block per pickup, fully spelled out (no cross-references).
- **Model** (`src/data/pickups.ts`): new `PickupHardware` type (`spacingMm?`, `bobbinColors`, `polepieces`, `cover?`, `sevenString?`) + `PickupPolepiece`. The old free-form `colors: string[]` was **superseded by `hardware`** (it was only displayed on ProductPage). Shared `STANDARD_BOBBIN_COLORS` palette (black, white + 8 hex) reused by Rockroach / Little Karakonjul / Twin Bliss.
- **JSON-LD** (`getJsonLdForUrl.ts`): Product now emits `material` (magnet) + `additionalProperty[]` (magnet, pole pieces, string spacing w/ `unitCode: MMT`, cover, 7-string, bobbin colours, DCR, inductance).
- **View**: new **`Swatch` DS atom** — Art Deco **chamfered-octagon** color chip with a gold deco frame. CSP-safe: fills come from `data-color` CSS rules (no inline `style`), so the atom's CSS module enumerates the palette (kept in sync with the data const). ProductPage specs now show String spacing / Pole pieces / Cover / 7-string rows + a bobbin-colour swatch row (`SwatchRow`, reusing the existing `specRow` grid).
- **Quality**: typecheck / lint / stylelint / format / prod build all green; verified on the dev server (specs render, 10 swatches on Rockroach, JSON-LD `additionalProperty` populated, cover/spacing correct).
- **Advances roadmap item 4** (bobbin/colour selection): the data-model + display half is done; the per-line _selector_ in the enquiry cart is still open.

**Follow-up same day — bobbin colors are now name tokens, not hex.** The hex values were only approximations, so the data/model speak in **name tokens** (`black`, `white`, `cream`, `coral`, `red`, `blue`, `light-blue`, `pink`, `green`, `orange`). New `src/data/bobbinColors.ts` (`BOBBIN_COLOR_LABELS` + `bobbinColorLabel`) is the single token→label source, reused by ProductPage, JSON-LD, and the future enquiry widget. Hex now lives **only** in `Swatch.module.css` (`data-color="<token>"` → fill), keeping it purely a visual approximation. The token set is mirrored in three places (bobbinColors.ts, `STANDARD_BOBBIN_COLORS`, Swatch CSS) — noted in DATA_MODEL.md. Raw `pickups-data.txt` Configuration blocks updated to names too. Sets up roadmap item 4's colour picker + human-readable enquiry message.

## 2026-06-24 — JSON-LD structured data, `llms.txt`, richer OG metadata

Confirmed `/robots.txt` + `/sitemap.xml` were already served by the SSR server; added structured data and discovery surfaces on top. SSR is the source of truth; the client `Seo` updater keeps the new tags in sync on SPA navigation.

- **JSON-LD** (new `src/seo/getJsonLdForUrl.ts` + `renderJsonLd` in `server/seo.ts`): `Organization` + `WebSite` on home, `Product` with single `Offer` (variant/simple) or `AggregateOffer` (base-with-variants), `BlogPosting` on articles, and `BreadcrumbList` on every product (variant-aware via `getPickupAndParent`) and article page. Availability `MadeToOrder`, currency `EUR` (matches the enquiry model + the `Price` atom default). Rendered as non-executable `application/ld+json` data scripts — not subject to `script-src`, so no nonce; `<` escaped to prevent breakout. noindex pages (e.g. `/cart`) emit zero blocks.
- **`/llms.txt`** (new route + `buildLlmsTxt` in `server/index.ts`): curated brand summary + page/product/article map, request-derived absolute origin.
- **OG/Twitter `image:alt`** on all pages; **`article:*`** OG tags (published/modified time, author, one `article:tag` per keyword) on article pages, with client-side cleanup on non-article routes. `SeoMeta` gained `ogImageAlt` + optional `article`.
- **Quality**: typecheck / lint clean; prod build + smoke test confirmed all endpoints, meta tags, and JSON-LD (2 blocks each on home/product/variant/article, 0 on `/cart`); all JSON-LD parses.
- **Not done (developer's call)**: variant canonical strategy (neck/bridge are self-canonical near-dupes of the base); off-site SEO (Search Console / Bing submission, backlinks); `FAQPage` schema; shorter SERP meta descriptions; `sameAs`/review schema; product `lastmod` in sitemap; RSS feed.

## 2026-06-23 — Responsive / mobile-nav pass + Art Deco `crest` separator

Large uncommitted working set (responsive design pass, roadmap item 1) plus a new Art Deco rule (roadmap item 2). Developer to commit + push after this doc sync; a11y of the changes to be discussed next.

**Mobile navigation**

- New **`MobileMenu` organism** — burger trigger → full-screen `role="dialog"` `aria-modal` overlay with scroll-lock, focus-trap, Esc-to-close, and close-on-route-change. Wired through `MobileNav` (cart-count aware) and passed to `Header` via the new `mobileNav` prop / `PageShell`.
- New **`NavIcon` atom** (per-link glyphs) and a **`FilterDisclosure` molecule** that collapses the shop filter controls behind a toggle ≤768px (selected filters shown as chips), inline on larger screens.
- `Header` now shows the desktop `.nav` and the `.mobileNav` burger mutually exclusively at the 1024px breakpoint (`display:none` either side — no duplicate tab stops/landmarks).

**Responsive layout**

- Restacking / breakpoint work across `ProductBrowser`, `ArticleBrowser`, `ProductGrid`, `Grid`, `ProductCard`, `Frame`, `DecoCorner`, `DecoOrnament`.
- `Section` — trimmed **top** padding one step on mobile (≤768px) via the two-value `padding-block` shorthand, keeping bottom padding for inter-section rhythm. More vertical real estate.

**Art Deco `crest` separator**

- New `DecoSeparator` **`crest`** variant: centre emblem (`noun-art-deco-3292686.svg`, tinted via CSS `mask` + `currentColor`) flanked by gold lines ending in tiny solid rotated-square diamonds (matching the nav-link diamonds). Replaced the old `DecoCorner` corner-line-corner border rows in `Header` (bottom) and `Footer` (top), and added under the `MobileMenu` logo bar.
- Header logo bar and the mobile-menu top bar given the same `min-block-size: 5rem` + `--space-5` bottom gap so the logo and separator **don't shift** when the menu opens; the menu separator drops its own inline padding (`padding-inline:0`) to avoid a double inset and stay centred; +20px (`1.25rem`) breather above the menu nav.
- `medallion` separator shrunk 100px → **76px**. `AboutPage` gained a `medallion` under the H1 and the "Roumen Kirov" signature bumped `editorial` → `lead`.
- `public/assets/svg-art/` repopulated by the developer with a new vector palette (see Carry-Forward) — the `crest` emblem is its first use.

**Quality**

- eslint / stylelint / prettier clean on the touched files (fixed a `-webkit-mask` vendor-prefix flag + a duplicate `mask` declaration the auto-fixer left). Typecheck green; prod build green. Visual checks via headless Chrome at 390px (header, open menu, shop).
- a11y review of the changes: decorative separators correctly `aria-hidden`; no new focusable elements; nav not duplicated to AT. Note carried forward: the `MobileMenu` dialog relies on `aria-modal` without `inert`/`aria-hidden` on background content (pre-existing) — to discuss.

## 2026-06-21 — Full Lighthouse audit + fixes + audit tooling

Ran Lighthouse across all 17 live pages (sitemap-driven). **A11y 100 everywhere; SEO 100** (cart 69 = intentional `noindex`); **Best Practices 100** (contact 93); **Performance 83–98**.

Fixes applied (code):

- **Article hero was a lazy LCP** (all 4 article pages) — added `priority` to the `ArticlePage` hero `<Image>` (eager + fetchpriority=high).
- **Logo `unsized-images`** (all 17 pages) — added `width`/`height` (2735×1001, ~2.73:1) to the header/footer logo `<img>`.
- **`label-content-name-mismatch`** (card grids) — removed the custom `aria-label` from ProductCard/ArticleCard links so the accessible name contains the visible text. (a11y was already 100; this clears the flagged audit.)

Not in code (action items):

- **Contact best-practices 93 = Cloudflare Email Obfuscation.** It rewrites the email + injects a decode script Trusted Types blocks → React #418 hydration error **and a broken email for users**. Fix is a Cloudflare toggle (see follow-ups + memory `project-cloudflare-ssr-conflicts`).
- Perf hints (render-blocking CSS, unused JS) are known SSR trade-offs.

New tooling: `scripts/audit-lighthouse.mjs` + `pnpm run audit:lighthouse [baseUrl]` (sitemap-driven; pulls Lighthouse via npx, no dependency added) + skill `docs/ai/skills/audit-lighthouse.md`. Verified typecheck/lint/stylelint/format/build green.

## 2026-06-21 — Open Graph link-preview images (photo-less previews fixed)

Pasting a product/home link showed text but no photo: `og:image` pointed at the ~2 MB original PNG, which scrapers drop (WhatsApp caps ~300 KB) — and it was square, not the 1.91:1 platforms want. Scrapers also can't use the AVIF/WebP derivatives (JPEG/PNG only) and ignore `srcset`/`<picture>`.

- **Optimizer** (`scripts/optimize-images.mjs`) now also emits one **`<name>-og.jpg`** (1200×630, mozjpeg q80) per source: wide photos (ratio ≥ 1.7) covered, square photos (products) centered on charcoal `#0e0c0a` so nothing is cropped. ~27 KB (product) / ~100 KB (spirit). Generated OG files are skipped when scanning for sources (`-og.jpg` regex). Not in the image manifest.
- **SEO** (`getSeoForUrl.ts`) — `toOgImage()` maps `…/name.png` → `…/name-og.jpg` by convention; SVG sources (article placeholders) fall back to the site default OG. `SeoMeta` gained `ogImageWidth`/`Height`/`Type` (constant 1200×630 / image/jpeg). `server/seo.ts` now emits `og:image:secure_url` / `:type` / `:width` / `:height`.
- **Browser experience unchanged** — OG image is scraper-only; on-page images still use the `Image` atom (AVIF/WebP).
- **Skill** `docs/ai/skills/optimize-images.md` updated (new Open Graph section; fixed the now-wrong "point og:image at the original PNG" rule).
- Verified: typecheck/lint/format/build green; prod smoke test shows `og:image` → `…-og.jpg` + dimension tags, files serve as image/jpeg at 28 KB / 100 KB. Article previews still use the default OG until real article photos land.

## 2026-06-21 — Lighthouse best-practices: HSTS + CSP hardening

From a prod Lighthouse "Trust and Safety" audit (`server/index.ts`):

- **HSTS** was `max-age=15552000` (180d), no `includeSubDomains`/`preload` → flagged (max-age too low / missing directives). Now **`max-age=63072000; includeSubDomains; preload`** (prod only). NB: the `preload` directive is the prerequisite, but enrolling in the browser preload list is a **separate manual submission at hstspreload.org** and is hard to reverse; `includeSubDomains` forces HTTPS on every subdomain (fine behind Cloudflare).
- **CSP** flagged "consider adding `unsafe-inline` for backward compatibility". Added **`'unsafe-inline'` to `script-src`** — CSP3 browsers ignore it when a nonce is present (modern security unchanged), pre-nonce browsers degrade gracefully. Deliberately **did not add `'strict-dynamic'`**: it makes `'self'` ignored and would block the Vite-injected module `<script>` tags (allowed via `'self'`, not a nonce).
- Verified: typecheck/lint/format/build green; prod headers confirmed via smoke test (`Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, `script-src 'self' 'nonce-…' 'unsafe-inline'`). Re-run Lighthouse after deploy to confirm green. See memory `project-security-seo`.

## 2026-06-21 — Image optimization (AVIF/WebP responsive `<picture>`)

The big remaining perf item. All built in the design system; originals kept as fallback + re-encode source.

- **Build-time optimizer** `scripts/optimize-images.mjs` (sharp, **devDependency** `0.35.2`, exact-pinned). Scans `public/assets/images/{product-photos,spirit-photos}`, emits `<name>-<w>.avif` + `<name>-<w>.webp` siblings on a non-upscaling width ladder `[480,768,1200,1600]` (source width always included). **Idempotent** (skips derivatives newer than source), so adding one photo only processes that photo. `pnpm run optimize:images`. AVIF q50/effort4, WebP q74/effort4.
- **Generated typed manifest** `src/assets/imageManifest.ts` (+ hand-written `imageManifest.types.ts`): original URL → intrinsic `width`/`height` + `avif[]`/`webp[]` variants. **Do not hand-edit**; regenerate.
- **DS atom `src/design-system/atoms/Image`** — emits `<picture>` (AVIF → WebP → original `<img>`) from the manifest, with `srcset`/`sizes`, intrinsic `width`/`height` (CLS), `decoding=async`, and `priority` → `loading=eager` + `fetchPriority=high`. **Sources not in the manifest (SVG logos, placeholder article art) fall back to a plain `<img>`** — safe everywhere. Picture wrapper is `display:contents` so existing absolute-positioned image CSS is untouched.
- **Routed 6 `<img>` sites** through `Image`: ProductCard, ProductGallery (main = priority, thumbs), ArticleCard, Hero (priority), FramedImage (new `sizes` prop), ArticlePage hero. Per-slot `sizes` documented in the skill.
- **Results**: white-pearl 2008 KB PNG → 42 KB full-res AVIF (~98%); a product card loads the 480px AVIF at ~6 KB. All-widths derivative footprint: AVIF 1.17 MB + WebP 1.66 MB total (browser fetches one width per image).
- **Kept**: `og:image` still points at PNG originals (social scrapers); SW still caches images on-demand (smaller files shrink the cache). Originals committed alongside derivatives + manifest.
- **Skill**: `docs/ai/skills/optimize-images.md` (added to the CLAUDE.md skill index) — the repeatable add-a-photo contract.
- **Fixed a latent ESLint-config bug**: the `**/*.{js,mjs}` block spread `disableTypeChecked` _after_ `languageOptions`, clobbering `globals.node` (so node globals never applied to any `.mjs`). Split into two flat-config entries so `parserOptions` + `globals` both survive. Surfaced because the optimizer is the first `.mjs` using `console`/`process`.
- **Docker note**: sharp's musl + glibc prebuilt variants are in `pnpm-lock.yaml`, so the alpine `--frozen-lockfile` build resolves. sharp is dev-only and never used at deploy/runtime (derivatives are committed). Recommend a `docker build` before the next deploy to confirm.
- Verified (Node 24.16.0): typecheck / lint / stylelint / format:check / build all green; prod SSR renders `<picture>` + avif/webp/srcset/sizes across all 7 products, home hero serves AVIF eagerly with `fetchPriority=high`; routes 200, unknown 404.

## 2026-06-21 — Trusted Types blocked SW registration (prod PWA fix)

- **Bug from live deploy console**: `entry-client.tsx` — `Failed to execute 'register' on 'ServiceWorkerContainer': This document requires 'TrustedScriptURL' assignment.` The prod-only CSP's `require-trusted-types-for 'script'` makes `serviceWorker.register()`'s URL a TrustedScriptURL sink, so the raw string `'/sw.js'` was blocked — meaning **the PWA service worker never registered in production** (no offline, no install). This was the "verify TT in a real browser" carry-forward; now confirmed failing and fixed.
- **Fix** (`src/entry-client.tsx`): wrap the SW URL in a `bp-sw` Trusted Types policy (`createPolicy(...).createScriptURL('/sw.js')`) before `register()`, falling back to the raw string where `window.trustedTypes` is absent. No server/CSP change needed — the CSP deliberately sets no `trusted-types` allowlist, so policy creation is permitted.
- **Types**: TS 6.0.3's DOM lib has no Trusted Types globals; added minimal `TrustedScriptURL`/`TrustedTypePolicy`/`TrustedTypePolicyFactory` + `Window.trustedTypes?` declarations to `src/vite-env.d.ts`. `register()` is still typed `string | URL`, so the trusted object is passed via `as unknown as string` (runtime honors it).
- The other live-console lines (`ObjectMultiplex`, `app-init-liveness`/`background-liveness`, `MaxListenersExceededWarning`, "Failed to get subsystem status") are **MetaMask browser-extension noise**, not our app.
- Verified: typecheck / lint / stylelint / format:check / build all green; `bp-sw` + `createScriptURL` present in the built client bundle. **Still needs a real-browser prod check** that the SW now registers + serves offline.

## 2026-06-21 — v2 → production repo migration (this is now THE repo)

- The v2 codebase (built in the `basementpickups_v2` scratch dir) was moved **into the production repo** `basementpickups` (GitHub `MechoshiPuhanaga/basementpickups`, deploy → Heroku Docker). The old v1 webpack/yarn/SCSS app was wiped; **only `.git/` and `.github/` were preserved**. From now on, all work happens in this repo.
- **Deploy is unchanged**: `.github/workflows/deploy.yml` (akhileshns/heroku-deploy, `usedocker: true`) triggers on push to **`main`** (NOT `master`) → Heroku builds the root `Dockerfile`.
- **`package.json` metadata** kept from v1 (`name: basement_pickups_web_site`, description, repository, homepage, author, contributors, `private: true`); **`version` → `2.0.0`**; scripts/deps/engines/`type`/`packageManager` are v2's.
- **Dockerfile fixes** (were latent bugs that would have broken the Heroku build):
  - Added `pnpm-workspace.yaml` to the pre-install `COPY` (it holds `overrides` + `allowBuilds: esbuild`; without it `--frozen-lockfile` rejects or esbuild's build script is blocked).
  - Added a real **`.dockerignore`** (excludes `node_modules`, `dist`, `.git`) so `COPY . .` doesn't overwrite the in-image Alpine/musl install with the host's glibc `node_modules`.
- **Lockfile fix**: `pnpm-lock.yaml` did not record the `overrides` declared in `pnpm-workspace.yaml`, so `pnpm install --frozen-lockfile` failed (`ERR_PNPM_LOCKFILE_CONFIG_MISMATCH`) — and the Docker build uses `--frozen-lockfile`. Regenerated the lockfile (`--no-frozen-lockfile`); only the overrides metadata was added, resolved versions unchanged. Frozen install now passes.
- **Prettier**: added `.github` to `.prettierignore` (keep the deploy file verbatim); formatted `docs/ai/PROJECT_STATUS.md`.
- **Verified (Node 24.16.0 via nvm)**: `typecheck` / `lint` / `stylelint` / `format:check` / `build` all green. Prod server smoke test (routes 200, unknown 404, `$PORT` honored). **Full `docker build` succeeded**, and the container served correctly with a Heroku-style injected `PORT` (`/`, `/shop`, `/products/white-pearl` → 200; `/nope` → 404; `/sw.js` → 200).
- **Port**: `server/index.ts` reads `Number(process.env['PORT']) || 3000` — confirmed Heroku-compatible.

## 2026-05-23 — Infrastructure milestone

- Wrote all tooling configs, SSR server, app shell, SEO module, data/util stubs, DS token CSS, 7 placeholder pages
- Bumped Node 22.12.0 → 24.16.0 (latest LTS) and all deps to latest majors compatible with each other
- Switched server streaming sink from `Transform` to `Writable` (Transform 'end' never fired without a downstream consumer)
- Established CSS Modules convention for DS components (documented across IMPLEMENTATION_RULES, DESIGN_SYSTEM, CLAUDE.MD, CLAUDE_SESSION_START)
- All checks pass: typecheck, lint, stylelint, build, dev SSR, prod SSR

## 2026-05-23 — DS atom layer

- Decided on bottom-up build order (all atoms first, then molecules) over a vertical Home-page slice
- Implemented the remaining 11 atoms (`Box`, `Stack`, `Grid`, `Surface`, `Separator`, `Heading`, `Text`, `Price`, `Button`, `IconButton`, `Badge`, `Input`, `Textarea`, `Select`, `Frame`) following the variant-via-`data-*`-attribute convention seen in the existing Deco atoms
- Variant choices driven directly by what the six page mocks in `design/references/` visibly need (e.g. Heading variants = hero/display/section/editorial because that's the typographic split observable in the reference; Button variants = primary/ghost/solid for the gold-bordered CTA, the text-only sub-CTA, and the rare filled CTA)
- Stylelint `--fix` migrated two pre-existing `currentColor` usages to lowercase and rewrote two media queries to range notation; no behavioral change
- typecheck / lint / stylelint / build / dev SSR all clean. None of the atoms are wired into pages yet

## 2026-05-23 — DS molecule layer

- Built all six molecules in one sequential pass: `ProductCard`, `ArticleCard`, `BrandValueCard`, `NewsletterSignup`, `ContactForm`, `ProductGallery`
- Each molecule's composition mirrors what the corresponding reference page mock shows (card framing, image aspect ratios, typography roles, label placement)
- Extended `Product` and `Article` data types with the fields the cards/gallery actually need (price, imageUrl, publishedAt, optional category) — kept narrow, no speculative fields
- `react-router`'s `<Link>` is used for navigational cards (already established as the project's link primitive in `App.tsx`)
- Resolved current `@types/react` deprecation noise for `FormEvent`/`FormEventHandler` by inlining the `<form onSubmit>` handlers so TS infers the parameter from JSX context
- Resolved typescript-eslint `no-base-to-string` on `FormData.get()` by introducing a tiny `readField(formData, key)` helper that narrows the `File | string` union
- Stylelint `--fix` previously-flagged: replaced deprecated `clip: rect(0,0,0,0)` with `clip-path: inset(50%)` for visually-hidden labels
- typecheck / lint / stylelint / build / dev SSR all clean. Molecules are not yet wired into pages

## 2026-06-20 — Real product data, real photos, spirit imagery

- **Real catalog**: rebuilt `src/data/pickups.ts` from `data/pickups-data.txt`.
  Seven real products replace the mocks: `white-pearl`, `macho-heaven`,
  `chow-chow` (neck + bridge sets, each with per-position `variants[]`), plus
  `rockroach`, `karakonjul`, `little-karakonjul`, `twin-bliss` (single-pickup,
  no variants). Descriptions/magnets/DCR/inductance/resonant peaks taken from
  the source verbatim. Extended `PickupSpecs` with `selfResonantPeak` /
  `loadedResonantPeak` (DATA_MODEL.md updated); set parents show DCR/inductance
  as ranges, variants show exact figures. Prices are placeholders (source has
  none). `ProductPage` now formats the magnet (`Alnico 5`) and renders the two
  resonant-peak rows.
- **Real product photos**: pickup `images.main` now points at
  `/assets/images/product-photos/<slug>.png` (square cinematic shots). Removed
  the obsolete per-product placeholder SVGs under
  `public/assets/images/products/`.
- **Spirit (mood) photos**: home hero → `spirit-photos/bp-spirit-1.png`; About
  page gained a framed mood image (`bp-spirit-2.png`) via a new `FramedImage`
  molecule (image inside the in-house `Frame`/DecoFrame, `landscape`/`square`
  ratios). Hero image box widened to 3:2 to suit the landscape photo.
  `bp-spirit-3.png` is available, currently unused.
- **Magnific Art Deco vectors — evaluated, then reverted.** The provided
  `svg-art` sheets (dividers / frame-corners / frames / style-frames) were
  cropped → background-stripped → recolored to `currentColor` via a coordinate
  bounding-box extraction script, and wired in as `ArtFrame` (product/hero
  frames), `ArtDivider`, `ArtCorner` (+ a `<symbol>` sprite). The developer
  rejected the new frames ("use the old frames"), then chose to drop the
  divider and page corners too. All `Art*` atoms, the extracted
  `assets/svg/*.svg`, and the footer attribution were removed; the UI is back to
  the original `DecoFrame`/`DecoSeparator`/`DecoCorner`. **The Magnific sheets
  were deleted 2026-06-21** (`public/assets/svg-art/` now empty); the developer
  will provide new SVGs for the Art Deco ornamentation roadmap task.
  - **If any Magnific vector is reused later**, their free license requires a
    visible footer credit "Designed by Magnific" linking www.magnific.com, and
    the original files must not be publicly downloadable (move them out of
    `public/`). Premium removes the attribution requirement.
- Verified: typecheck / eslint / stylelint / `pnpm build` / dev SSR all clean;
  every route 200s with real names, photos, and specs. Dev server runs under
  Node 24.16.0 (nvm) — pnpm refuses Node 22.12.0.

## 2026-06-20 — Content + UX follow-ups

- **Newsletter removed from UI**: the Footer "Stay in tune" column (NewsletterSignup) is no longer rendered; the `NewsletterSignup` molecule is kept in code for later. Footer grid is now 2-up.
- **Product base magnet**: `ProductPage` `formatMagnet()` lists per-position magnets on the base view when neck/bridge differ (e.g. "Alnico 3 (neck) · Alnico 4 (bridge)").
- **Articles expanded**: all four article bodies rewritten to ~920–1016 words of real, technically accurate editorial content (PAF, scatter winding, aging alnico, installation). Article photos are still placeholder SVGs.
- **FOUC fix**: `server/index.ts` inlines the four global token CSS files (`fonts/reset/tokens/global`) into the SSR head **in dev** (`criticalTokenStyle()`), so first paint is themed instead of a white flash. Prod already ships a render-blocking `<link>`, so the inline is dev-only. NB: in dev, per-component CSS-module styles still load via Vite JS injection a beat later — the major white flash is gone, component layout settles instantly on localhost.
- **Shop sort + filter**: new `ProductBrowser` organism (client `useState`) adds an Art Deco `Select`-based Sort (Featured / Name A–Z / Inductance ↑ / ↓) and Magnet filter (a model matches if its own or any variant's magnet conforms), with a live model count. `ShopPage` renders the header + `ProductBrowser`. SSR renders the default (featured, all) and hydration enables the controls.
- **About page**: placeholder copy replaced with the real founder story (Roumen Kirov), signature included; spirit image + brand-value cards retained.

## 2026-06-20 — Content polish, commerce-lite, SEO & security hardening

Content/UX:

- Footer newsletter ("Stay in tune") removed from UI (molecule kept in code); footer is 2-up.
- Product base view lists per-position magnets when neck/bridge differ; resonant-peak specs shown.
- Articles expanded to ~1000 words each (real content). Article dates set to today; article index gained an `ArticleBrowser` (keyword/topic filter + date sort) and reading-time ("X min read", `src/utils/readingTime.ts`).
- Shop gained `ProductBrowser` (sort: featured/name A–Z/Z–A/price ↑↓/inductance ↑↓; filters: type + magnet, matching parent or any variant) — Art Deco `Select`.
- Long-form copy switched from serif `editorial` to Inter `body` variant; `body` size tuned to 15px. About page uses the real founder story (Roumen Kirov); opening line styled as a lead subheadline.
- Prices are euro everywhere (Price atom default `€`).
- Real brand logo wired: gold horizontal logo in header (left-aligned, nav right) + footer; stacked gold mark as favicon (`public/assets/logo/`).
- Contact "Send message" opens the visitor's mail client (new tab) to `contact@basementpickups.com` with subject + body; visible email link in the aside; contact content width capped.

FOUC fix: dev SSR inlines the **full** compiled app CSS (Vite `?direct`, scoped names match markup) into `<head>` so first paint is styled. Prod already ships a render-blocking `<link>`.

SEO (server-driven): server `<head>` is the source of truth; absolute canonical/`og:url`/`og:image`, og:site_name + Twitter card; client `<Seo>` is now imperative (renders null in SSR — no duplicate tags). `SeoMeta.robots` added. `/robots.txt` + `/sitemap.xml` served dynamically from the SSR server (data-driven, absolute URLs, `/cart` excluded). See memory `project-security-seo`.

Security headers (`server/index.ts`): baseline on all responses (nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, COOP+CORP same-origin; HSTS prod). **Prod-only** strict nonce-based CSP + `require-trusted-types-for 'script'` (Trusted Types). Vite modulepreload polyfill disabled so no un-nonced inline script. CSP/TT are dev-skipped (Vite HMR). **Verify TT once in a real browser against a prod build.**

Commerce-lite — enquiry cart (no payments): `src/cart/` `CartProvider`/`useCart` (localStorage), "Add to enquiry" on product pages (base-with-variants intentionally not addable), `/cart` page with qty steppers + subtotal → "Send enquiry" prefills the contact form (router state) → existing mailto. See memory `project-enquiry-cart`.

## 2026-06-20 — 404, woff2 fonts, dependency security

- **Real 404s**: `getStatusForUrl()` (in `src/seo/getSeoForUrl.ts`) drives the SSR HTTP status — splat route and unknown product/article slugs now return **404** (not soft-200) while still rendering the friendly not-found UI; not-found SEO is `noindex, nofollow`. Wired in `entry-server.tsx`.
- **Fonts → woff2**: converted the local `.ttf` to `.woff2` with `fonttools`+`brotli` (no CDN), updated `tokens/fonts.css` (woff2 only), and **deleted all `.ttf`** (full families were being shipped). `public/assets/fonts/` is now ~740 KB (woff2 + OFL licenses only).
- **Dependency security**: `pnpm audit` was clean afterward. Bumped `vite` 8.0.14 → **8.0.16** (fixes the high `server.fs.deny` bypass + a moderate). Transitive advisories fixed via **overrides in `pnpm-workspace.yaml`** (NB: pnpm 11 ignores `pnpm.overrides` in package.json): `esbuild >=0.28.1`, `js-yaml >=4.1.2`, `@babel/core >=7.29.1 <8` (kept on 7.x to avoid breaking eslint-plugin-react-hooks). typecheck/lint/stylelint/build/dev all green.
- Remaining planned polish: **image optimization** (multi-MB product/spirit PNGs — biggest item), accessibility audit pass, dedicated 1200×630 OG art, optional "related products".

## 2026-06-20 — Lint/format toolchain to latest-safe

- Bumped `typescript-eslint` 8.59.4 → **8.61.1**, `prettier` 3.8.3 → **3.8.4**, `stylelint` 17.12.0 → **17.13.0**. `pnpm audit` still clean.
- **ESLint stays on 9.39.4 (latest 9.x), NOT 10** — `eslint-plugin-react@7.37.5` (its latest) still peers `^9.7`; ESLint 10 is unsafe until that plugin supports it. `eslint-plugin-react(-hooks)`, `eslint-config-prettier`, `globals`, `stylelint-config-standard` were already at latest.
- Ran `prettier --write` across the repo: the codebase had **never been fully Prettier-formatted** (`eslint-config-prettier` only disables conflicting rules; `format:check` wasn't in the verify loop). Now `pnpm run format:check` passes. **Add `format:check` to the standard verify loop** (typecheck / lint / stylelint / format:check / build).

## 2026-06-20 — Runtime deps + React types to latest-safe

- Bumped: `react`/`react-dom` 19.2.6 → **19.2.7**, `react-router` 7.15.1 → **7.18.0**, `tsx` 4.22.3 → **4.22.4**, `@types/react` 19.2.15 → **19.2.17**, `@types/node` 24.12.4 → **24.13.2**. `pnpm audit` clean; typecheck/lint/stylelint/format/build/dev all green.
- Held back deliberately: **react-router 8.0.1** (major — would need a deliberate SSR-API migration + testing; staying on 7.x), **@types/node 26** (kept on **24.x** to match the Node 24 runtime), **typescript** (6.0.3 is latest and the ceiling under typescript-eslint's `<6.1.0` peer), **ESLint 10** (eslint-plugin-react still `^9.7`). `express`, `@types/react-dom`, `@types/express`, `@vitejs/plugin-react` already at latest.

## 2026-06-20 — React Router 8 upgrade

- `react-router` 7.18.0 → **8.0.1**. **Zero code changes needed.** The one v8 breaking change (DOM exports move to `react-router/dom`, `react-router-dom` removed) didn't affect us — we import `RouterProvider`/`createBrowserRouter`/`Link`/`NavLink` from `react-router` (never `react-router-dom`), and v8 still exports those from `react-router`. All other v8 breaks (future flags, `meta` `data` param, `hasErrorBoundary`, middleware/`getLoadContext`, adapters) are framework-mode features we don't use.
- v8 version floors already met: Node ≥22.22 (24.16), React ≥19.2.7 (19.2.7), Vite ≥7 (8.0.16), ES2022.
- Verified: typecheck/lint/stylelint/format/audit/build clean; dev + **prod** SSR both serve (routes 200/404), hydration data present, and the CSP nonce on the hydration `<script>` still matches under v8.
- Note (carry-forward): RR 7.18.0+ CSRF check validates against request `host` — only relevant if we adopt RR actions/`<Form>` behind the Cloudflare→Heroku proxy (would need `allowedActionOrigins`). We don't use RR actions today.

## 2026-06-20 — Fixed versions everywhere

- **Policy: exact/fixed versions everywhere.** `package.json` deps are all exact; `.npmrc` has `save-exact=true`; the `pnpm-workspace.yaml` overrides were changed from ranges to **exact pins**: `esbuild 0.28.1`, `js-yaml 4.2.0`, `@babel/core 7.29.7`.
- Verified the overrides are no longer strictly required — after the dep updates, removing them and reinstalling leaves the tree unchanged and `pnpm audit` clean (the tree resolves to those safe versions natively). They're kept as an **exact-version security guard** against resolution drift; bump deliberately.
- `@babel/core` stays on **7.x** (7.29.7 = latest patched) because `eslint-plugin-react-hooks` requires `@babel/core ^7.24.4`; 8.x is a compat ceiling, not a security issue. `js-yaml` 4.2.0 is the absolute latest.

## 2026-06-20 — Color-contrast accessibility audit (WCAG AA)

- Audited every text-on-background and UI-color pair we use. **All text combinations pass AA** (most by a wide margin: text-primary ~15–16:1, gold 8.1:1, muted ~6:1; dark-on-gold buttons/badges 8.1:1; primary-button-hover/`::selection` 5.65:1). Gold UI (focus ring, gold borders, frames) all ≥5.6:1.
- **One gap fixed**: resting form-field borders used `--color-line` (#2a2520 = 1.29:1 vs page), too faint to delineate the control (WCAG 1.4.11). Added `--color-line-strong` (#6b6253 = **3.25:1** vs page, 3.36:1 vs the sunken field fill) and pointed Input/Textarea/Select resting borders at it. Decorative hairlines/separators keep `--color-line` (exempt as decorative). Focus state still turns gold (#c9a24a, 8.1:1).
- Remaining accessibility work (item #8) beyond color: keyboard-navigation sweep and screen-reader pass.

## 2026-06-20 — Accessibility: keyboard + screen-reader pass

Completes the accessibility audit (color was done earlier). All styling added in the design system per code-style (see memory `feedback-styling-in-design-system`):

- **New DS atom `VisuallyHidden`** (`atoms/VisuallyHidden`) — polymorphic `as`, spreads `role`/`aria-live`; the reusable sr-only primitive. Used for hidden headings + the cart live region (no local/page CSS).
- **Skip-to-content link** + focusable `<main tabindex="-1">` in `PageShell` (link styling in `PageShell.module.css`; off-screen until `:focus`). Fixes 2.4.1.
- **Route focus + scroll reset** on client navigation in `App.tsx` (focuses `#main`, scrolls top; skips initial load). Fixes 2.4.3.
- **Heading hierarchy**: `ProductBrowser`/`ArticleBrowser` render a `VisuallyHidden as="h2"` so Shop/Articles go h1→h2→h3 (was h1→h3). Fixes 1.3.1.
- **`prefers-reduced-motion`** reset in `tokens/global.css`. 2.3.3.
- **Footer** links wrapped in `<nav aria-label="Footer">` landmark.
- **Cart `aria-live`**: `src/cart/CartAnnouncer.tsx` (renders via `VisuallyHidden`) announces enquiry count changes politely.
- **Status messages (4.1.3)**: Shop/Articles result-count is now a `role="status"` `aria-live="polite"` region, so filter/sort changes (incl. the empty state) are announced. The cart announcer is the page-wide one; the count region is per-browser.
- Deferred (dormant): `ProductGallery` full ARIA tabs keyboard pattern — only renders with multiple images; all products currently have one.
- **Code-level AA work is complete.** Remaining accessibility = manual browser/AT testing only: screen-reader walkthrough (NVDA/VoiceOver), keyboard-only walkthrough, 200% zoom + 320px reflow (1.4.10), text-spacing (1.4.12), focus-not-obscured (2.4.11).
- Verified: typecheck/lint/stylelint/format/build clean; dev routes 200/404; heading order on /shop is h1→h2→h3. (A mid-session 500 was a stale Vite module cache after adding new files — fixed by a clean restart; not a code issue.)

## 2026-06-20 — PWA (offline) — approach A (hand-rolled SW)

- **Installable + offline** via a hand-rolled runtime-cache service worker (no new dependency). `public/sw.js`: navigations network-first (fresh HTML when online) → cache → `offline.html`; same-origin assets cache-first; versioned cache (`bp-v1`) cleared on activate; **no `skipWaiting`** (silent update on next load). Bump `VERSION` in `sw.js` on a meaningful SW change.
- `public/manifest.webmanifest` (standalone, charcoal theme), `public/offline.html` (branded, self-contained inline CSS), and PWA icons in `public/icons/` (192 / 512 / maskable-512) generated from `BP_Gold_logo.svg` (the mark).
- **Favicon** switched to `BP_Gold_logo.svg` (the icon mark, not the stacked logo) + `apple-touch-icon`. `index.html` head gained the manifest link + `theme-color`.
- SW **registered in production only** (`entry-client.tsx`, gated on `import.meta.env.PROD`) — dev is untouched so Vite HMR isn't affected. Express serves `/sw.js` from root scope with `Cache-Control: no-cache` + `Service-Worker-Allowed: /` (before the 1y static handler).
- Plays nicely with the strict CSP: SW reg is same-origin (covered by `default-src 'self'`/worker-src), not a Trusted-Types sink; cached HTML responses carry their own matching CSP+nonce header, so offline replay stays consistent.
- Contact `mailto` left as-is (works offline; mail client queues + sends on reconnect).
- **Deploy updates**: SSR HTML now sends `Cache-Control: no-cache` (revalidate every navigation), so new deploys' HTML — and the new content-hashed asset URLs it references — are picked up immediately. Hashed assets cache-miss → fetched fresh; old entries are cruft until a `VERSION` bump. No `VERSION` bump is needed for assets to update, only for cache cleanup.
- Images cached **on demand** (cache-first), not precached — avoids bloating storage with the heavy ~2 MB photos (still the open image-optimization item).
- Verified (prod build): `/sw.js` (no-cache, correct MIME), manifest, icons, offline page all 200; SW registration present in the client bundle. **Not yet verified in a real browser**: install prompt, offline reload, SW cache behavior — needs a manual browser pass.

## Data

- canonical data models live in `docs/ai/DATA_MODEL.md`
- mock data must be guitar pickup relevant
- no lorem ipsum
- products and articles are local imported data for MVP
