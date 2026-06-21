# Architecture — Basement Pickups

This document defines the application architecture, runtime responsibilities, and folder structure.

The project is a custom React SSR application, not a React framework app.

---

# Stack

Use:

- React latest stable version
- React DOM server streaming SSR
- TypeScript strict mode
- Vite
- Express/Node SSR server
- React Router
- vanilla CSS
- CSS variables
- route-level code splitting

The app must be Docker-ready and Heroku-compatible.

---

# Runtime Overview

The application has two runtimes:

1. Server runtime

- receives HTTP requests
- resolves route intent
- resolves SEO metadata
- renders React using streaming SSR
- injects assets/head metadata into HTML
- serves static client assets in production

2. Client runtime

- hydrates server-rendered HTML
- handles client-side navigation
- loads route-level code-split bundles
- runs browser-only interactions

Server and client output must remain consistent.

---

# SSR Flow

Expected request flow:

```txt
HTTP request
  -> Node/Express server
  -> resolve URL/pathname
  -> resolve SEO metadata
  -> create React Router SSR context
  -> render React app with streaming SSR
  -> stream HTML response
  -> hydrate on client
```

SEO metadata must be known before streaming begins.

---

# Folder Structure

Recommended structure:

```txt
server/
  index.ts
  renderHtml.ts
  seo.ts

src/
  entry-client.tsx
  entry-server.tsx

  app/
    App.tsx
    routes.tsx
    router.ts

  data/
    products.ts
    articles.ts
    navigation.ts
    brandValues.ts

  design-system/
    tokens/
    atoms/
    molecules/
    organisms/
    layouts/

  pages/
    HomePage/
    ShopPage/
    ProductPage/
    ArticlePage/
    AboutPage/
    ContactPage/
    NotFoundPage/

  seo/
    getSeoForUrl.ts
    seoTypes.ts

  utils/
    invariant.ts
    exhaustive.ts
```

---

# Server Responsibilities

The server owns:

- request handling
- production static asset serving
- SSR rendering
- streaming response lifecycle
- SEO metadata injection
- Heroku `process.env.PORT` compatibility
- safe error handling

The server should not own:

- design-system logic
- business UI logic
- product rendering details
- client-only interactions

---

# Client Responsibilities

The client owns:

- hydration
- client-side route transitions
- browser interactions
- progressive enhancement
- event handling

The client should not own:

- initial SEO generation
- first meaningful HTML render
- route metadata resolution for initial request

---

# Routing Architecture

Use React Router.

Routes should be defined centrally.

Routes should support:

- static pages
- product detail pages
- article detail pages
- not found page
- route-level code splitting
- SSR compatibility

Pages should be lazy-loaded at the route level.

Shared layout and core design-system primitives should not be aggressively code-split.

---

# Route Types

Required routes:

```txt
/                 -> HomePage
/shop             -> ShopPage
/products/:slug   -> ProductPage
/articles/:slug   -> ArticlePage
/about            -> AboutPage
/contact          -> ContactPage
*                 -> NotFoundPage
```

Route definitions should remain explicit and readable.

---

# Code Splitting

Use route-level code splitting for page components.

Code split:

- pages
- large isolated feature sections if needed later

Do not code split:

- DS atoms
- core layout primitives
- shared tokens/global CSS
- header/footer unless a later performance issue proves it useful

The goal is reasonable bundle separation without excessive fragmentation.

---

# Data Architecture

Canonical product and article data models are defined in:

```txt
docs/ai/DATA_MODEL.md
```

Products and articles are local imported data files.

No CMS, database, or API is required for MVP.

Data files should be:

- typed
- explicit
- easy to replace later
- independent from rendering components

Example data ownership:

```txt
src/data/products.ts
src/data/articles.ts
src/data/navigation.ts
src/data/brandValues.ts
```

Product/article lookup utilities may live near the data layer if needed.

---

# SEO Architecture

SEO is resolved server-side before streaming.

SEO should use:

- route pathname
- product data
- article data
- static page metadata

SEO should support:

- title
- description
- canonical path
- Open Graph title
- Open Graph description
- Open Graph image where available

SEO should not rely on client-only rendering.

---

# Design System Architecture

The design system is the only place where visual styling decisions live.

The DS contains:

- tokens
- atoms
- molecules
- organisms
- layouts

Pages compose DS components.

Pages should not create their own styling conventions.

---

# Styling Architecture

Use:

- global reset CSS
- global token CSS
- component CSS files
- flat selectors
- CSS variables

Avoid:

- nested selectors
- Tailwind
- CSS-in-JS
- utility-class styling
- page-specific ad hoc CSS

CSS should be predictable and readable.

---

# Asset Architecture

Public assets should live under:

```txt
public/assets/
  logo/
  images/
  fonts/
```

Use stable paths for:

- logo
- product images
- article images
- Open Graph images
- fonts

Fonts may be self-hosted later.

---

# Environment Architecture

The app should support:

```txt
development
production
```

Development:

- Vite dev middleware or Vite dev server integration
- readable errors
- fast iteration

Production:

- built client assets
- built server bundle
- static asset serving
- streaming SSR
- Heroku-compatible port binding

---

# Heroku Compatibility

The server must listen on:

```ts
process.env.PORT;
```

with a local fallback.

Do not hardcode production ports.

Docker deployment is expected, but Docker setup may be handled separately.

---

# Error Handling

The architecture should support:

- SSR render errors
- route not found
- missing product/article slugs
- production-safe error output
- development-friendly diagnostics

Avoid leaking internal errors in production responses.

---

# Hydration Rules

Server-rendered output and client-rendered output must match.

Avoid:

- non-deterministic render output
- browser-only values during SSR render
- time/random values in initial render
- route mismatches
- data divergence between server and client

---

# Dependency Direction

Allowed dependency direction:

```txt
pages -> layouts/organisms/molecules/atoms/tokens
organisms -> molecules/atoms/tokens
molecules -> atoms/tokens
atoms -> tokens
server -> src/seo, src/data, src/entry-server
client entry -> app
```

Avoid circular dependencies.

Design-system atoms should not depend on pages or business features.

---

# Implementation Order

Recommended build order:

1. project tooling
2. SSR skeleton
3. routing skeleton
4. SEO resolution
5. CSS reset/tokens/fonts/global
6. DS atoms
7. DS molecules
8. DS organisms/layouts
9. pages
10. polish/accessibility/performance

---

# Architectural Principle

The application should remain explicit, small, and understandable.

Prefer a clear custom SSR architecture over framework-like hidden behavior.

The goal is a maintainable boutique ecommerce site with a strong design system foundation.

# Heroku Compatibility

The server must listen on:

```ts
process.env.PORT || 3000;
```

Use:

- `process.env.PORT` in production
- `3000` as the local development fallback

Do not hardcode production ports.

The app is deployed through Heroku Docker/container deployment.

Docker deployment is owned by the developer, but application code must remain compatible with that deployment model.

---

# Production Deployment Context

Production deployment is handled manually by the developer.

The production target is Heroku Docker/container deployment.

Expected production flow:

```txt
Cloudflare DNS/domain
  -> Heroku app
  -> Docker container
  -> Node SSR server
  -> React streaming SSR response
```

Production assumptions:

- the app runs inside Docker
- Docker base image uses Node `24.16.0-alpine`
- package manager is pnpm
- dependencies install from `pnpm-lock.yaml`
- server listens on `process.env.PORT || 3000`
- production command starts the Node SSR server
- static client assets are served by the Node SSR app unless changed later
- domain and DNS are managed externally through Cloudflare

Do not assume:

- Vercel
- Netlify
- Next.js hosting
- serverless runtime
- edge runtime
- CDN-managed SSR

Deployment files and Heroku container workflow are owned by the developer unless explicitly requested.

Application code must preserve Heroku compatibility:

- no hardcoded production ports
- no hardcoded hostnames
- no environment assumptions that conflict with Docker
- no dependency on serverless-only APIs
