# Routing and SEO — Basement Pickups

This document defines the routing architecture, SEO strategy, metadata flow, and URL conventions for the application.

Routing and SEO must remain:

- SSR-compatible
- explicit
- maintainable
- framework-independent
- predictable

SEO is a first-class architectural concern.

---

# Routing Philosophy

Routing should feel:

- simple
- explicit
- readable
- centralized
- maintainable

Avoid:

- hidden routing behavior
- magic route generation
- deeply nested route complexity
- scattered route definitions

Routes should remain easy to understand and audit.

---

# Router

Use React Router.

The router should support:

- SSR rendering
- hydration compatibility
- route-level code splitting
- predictable navigation
- explicit route ownership

Routing logic should remain centralized.

---

# Route Structure

Primary routes:

```txt
/                 -> HomePage
/shop             -> ShopPage
/products/:slug   -> ProductPage
/articles/:slug   -> ArticlePage
/about            -> AboutPage
/contact          -> ContactPage
*                 -> NotFoundPage
```

Routes should remain human-readable and SEO-friendly.

---

# URL Philosophy

URLs should be:

- stable
- descriptive
- readable
- lowercase
- hyphen-separated

Preferred:

```txt
/products/vintage-paf
/articles/how-pickups-affect-tone
```

Avoid:

- IDs in URLs
- query-driven routing
- unnecessary nesting
- inconsistent casing

URLs are part of the brand experience.

---

# Slug Rules

Product and article slugs should:

- be unique
- remain stable
- use lowercase hyphenated format
- avoid special characters

Preferred:

```txt
the-1964
vintage-jazz-humbucker
```

Avoid:

```txt
Product123
The1964Pickup
```

---

# Route-Level Code Splitting

Pages should be lazy-loaded at the route level.

Code split:

- page components
- large isolated route features

Do not aggressively split:

- DS atoms
- shared layouts
- global styling
- core app shell

The goal is:

- reasonable bundle separation
- predictable hydration
- maintainable architecture

Avoid excessive fragmentation.

---

# Route Ownership

Pages own:

- route composition
- route-specific data lookup
- route-level SEO metadata
- page structure

The design system owns:

- styling
- layout primitives
- UI behavior
- visual consistency

Routes should not create ad hoc visual systems.

---

# Navigation Philosophy

Navigation should feel:

- calm
- elegant
- minimal
- premium

Navigation structure should remain:

- shallow
- readable
- intentional

Avoid:

- crowded menus
- excessive navigation depth
- overly complex hierarchy

The site should feel curated.

---

# SEO Philosophy

SEO must be:

- server-rendered
- route-aware
- content-aware
- framework-independent

SEO should be generated before streaming begins.

Avoid:

- client-only SEO generation
- delayed metadata injection
- hydration-dependent metadata

Metadata must exist in the initial HTML response.

---

# SEO Ownership

SEO metadata should be resolved from:

- route pathname
- product data
- article data
- static page definitions

SEO generation should remain centralized and predictable.

---

# SEO Resolution Flow

Expected SEO flow:

```txt
request
  -> route resolution
  -> route data lookup
  -> SEO metadata generation
  -> HTML render
  -> stream response
```

SEO must be known before streaming begins.

---

# SEO Metadata Requirements

Each page should support:

```txt
title
description
canonical URL
Open Graph title
Open Graph description
Open Graph image
```

Optional later additions:

- Twitter cards
- structured data
- product schema
- article schema

The MVP should establish a clean foundation.

---

# Title Philosophy

Titles should:

- feel premium
- remain readable
- avoid spammy SEO formatting

Preferred:

```txt
The 1964 Humbucker | Basement Pickups
```

Avoid:

```txt
BUY BEST VINTAGE HUMBUCKER PICKUPS ONLINE
```

Titles should balance:

- SEO clarity
- brand tone
- elegance

---

# Description Philosophy

Descriptions should:

- remain concise
- feel editorial
- sound human
- reinforce craftsmanship

Avoid:

- keyword stuffing
- robotic phrasing
- aggressive marketing language

The tone should remain premium and restrained.

---

# Canonical URLs

All pages should support canonical URLs.

Canonical URLs should:

- use production domain structure
- remain stable
- avoid duplicate-path ambiguity

Canonical generation should be centralized.

---

# Open Graph Philosophy

Open Graph metadata should:

- support premium social sharing
- preserve brand aesthetics
- use cinematic imagery where available

Product pages should prioritize:

- product imagery
- clean titles
- restrained descriptions

Article pages should prioritize:

- editorial imagery
- readable titles
- premium presentation

---

# Product SEO

Product pages should:

- use product-specific metadata
- include tone/product descriptions
- use product imagery
- remain indexable
- support direct sharing

Product metadata should come from local product data files.

---

# Article SEO

Article pages should:

- use article-specific metadata
- support editorial presentation
- expose readable descriptions
- support social sharing

Articles should feel like premium editorial content.

---

# Home Page SEO

The home page should:

- establish brand identity
- communicate handcrafted positioning
- support discovery
- reinforce visual uniqueness

The homepage metadata should feel:

- premium
- concise
- atmospheric

---

# Not Found Handling

The app should support:

- SSR-safe 404 rendering
- readable fallback UX
- proper HTTP status handling

The not-found page should remain:

- visually consistent
- minimal
- branded

Avoid generic framework-style 404 experiences.

---

# Hydration Safety

Route rendering must remain deterministic between:

- server render
- client hydration

Avoid:

- route-dependent randomness
- browser-only values during SSR
- non-deterministic route rendering

Hydration stability is required.

---

# Internal Linking Philosophy

Internal links should:

- reinforce navigation clarity
- support SEO structure
- remain semantically meaningful

Avoid:

- excessive hidden links
- repetitive linking spam
- unclear navigation intent

---

# Future SEO Expansion

The architecture should later support:

- structured data
- sitemap generation
- robots configuration
- dynamic OG image generation
- CMS integration
- richer metadata systems

without architectural rewrites.

---

# Routing and SEO Principle

Routing and SEO should remain:

- explicit
- predictable
- SSR-first
- maintainable
- visually aligned with the brand

The routing system should support both:

- excellent UX
- strong discoverability

without introducing unnecessary complexity.
