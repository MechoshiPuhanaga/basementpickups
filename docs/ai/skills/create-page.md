# Skill — Create Page

This skill defines the rules for implementing a page component.

Pages are route-level composition layers.

Pages should:

- compose layouts
- compose organisms
- compose molecules
- define content structure
- define route intent
- preserve design-system consistency

Pages are not styling systems.

---

# Page Responsibilities

Pages may own:

- route composition
- page structure
- content hierarchy
- route-specific data lookup
- page-level SEO configuration
- route-level layout composition

Pages should not own:

- visual systems
- reusable styling systems
- low-level UI primitives
- duplicated interaction patterns
- global application architecture

Pages are composition layers.

---

# Page Structure

Preferred structure:

```txt
PageName/
  PageName.tsx
  PageName.types.ts
```

Pages should remain lightweight.

Avoid:

- large page-specific CSS files
- deeply coupled page logic
- duplicated layout systems

Most styling should already exist in the DS.

---

# Page Workflow

Before implementation:

1. identify route intent
2. identify required layouts
3. identify required organisms/molecules
4. identify SEO requirements
5. identify responsive structure
6. identify accessibility concerns

Pages should primarily solve:

- composition
- hierarchy
- content flow

---

# Page Composition Philosophy

Pages should compose:

- layouts
- organisms
- molecules
- atoms where appropriate

Preferred structure:

```tsx
<PageShell>
  <Hero />
  <FeaturedProducts />
  <ArticleGrid />
</PageShell>
```

Avoid:

- deeply nested render trees
- ad hoc layout structures
- repeated spacing systems
- duplicated composition logic

The page layer should remain readable.

---

# Styling Rules

Pages should not create:

- new visual systems
- utility-class styling
- duplicated spacing systems
- one-off styling conventions

Avoid:

- page-owned CSS unless absolutely necessary
- visual logic leaking from pages
- layout inconsistency

Styling belongs to the DS.

Pages should primarily compose existing primitives.

---

# Layout Rules

Pages should use:

- layout primitives
- PageShell
- Section
- Grid
- Stack
- Surface
- DS spacing systems

Avoid:

- arbitrary spacing
- inconsistent section rhythm
- manual layout duplication

The page should inherit visual rhythm naturally from the DS.

---

# Route Ownership

Pages own:

- route identity
- route composition
- route-level content hierarchy
- route-specific metadata
- route-level data lookup

Pages should not own:

- routing infrastructure
- router configuration
- navigation systems

Routing remains centralized.

---

# SEO Rules

Pages should support:

- title
- description
- canonical path
- Open Graph metadata

SEO should remain:

- SSR-compatible
- route-aware
- data-aware

SEO metadata should be resolved from:

- route
- products
- articles
- static page definitions

Avoid client-only metadata generation.

---

# Data Rules

Pages may:

- receive route params
- resolve local data
- map data into UI composition

Pages should not:

- fetch remote APIs for MVP
- mutate global application state
- contain unrelated business services

Data should remain:

- typed
- explicit
- predictable

---

# Product Page Philosophy

Product pages should feel:

- cinematic
- premium
- crafted
- immersive
- restrained

The product page should emphasize:

- photography
- typography
- spacing
- framing
- craftsmanship
- tone identity

Avoid:

- crowded ecommerce layouts
- marketplace aesthetics
- noisy comparison-style UI

The product should feel like:

- a crafted object
- a premium instrument component

---

# Article Page Philosophy

Article pages should feel:

- editorial
- atmospheric
- literary
- readable
- spacious

Reading experience is important.

Prioritize:

- typography rhythm
- hierarchy
- imagery
- whitespace
- composition

Avoid:

- noisy blog aesthetics
- aggressive sidebars
- content clutter

---

# Home Page Philosophy

The homepage should:

- establish brand identity
- establish atmosphere
- communicate craftsmanship
- communicate premium positioning

The homepage should feel:

- cinematic
- composed
- confident
- elegant

Avoid:

- generic hero sections
- startup-style layouts
- cluttered landing-page behavior

The homepage is a brand experience first.

---

# Shop Page Philosophy

The shop page should feel:

- curated
- premium
- restrained

Products should be presented with:

- breathing room
- elegant hierarchy
- framed presentation
- strong imagery

Avoid:

- marketplace density
- overly technical filtering UI
- cluttered product grids

The browsing experience should feel deliberate.

---

# About Page Philosophy

The about page should emphasize:

- craftsmanship
- philosophy
- atmosphere
- authenticity

The page should feel:

- intimate
- premium
- handcrafted

Avoid:

- corporate language
- startup storytelling clichés
- generic branding copy structure

---

# Contact Page Philosophy

The contact page should feel:

- calm
- elegant
- approachable
- minimal

The form should remain:

- spacious
- readable
- accessible

Avoid:

- aggressive form UX
- cluttered layouts
- unnecessary friction

---

# Responsive Rules

Pages should remain:

- stable
- readable
- visually balanced

Responsive behavior should prioritize:

- hierarchy
- readability
- spacing integrity
- compositional consistency

Avoid:

- layout instability
- breakpoint overload
- cramped mobile layouts

---

# Accessibility Rules

Pages must:

- maintain semantic heading hierarchy
- preserve keyboard navigation
- preserve readable contrast
- preserve semantic landmarks

Pages should use:

- semantic HTML structure
- accessible layout patterns
- meaningful hierarchy

Accessibility should emerge naturally from composition.

---

# Animation Rules

Page-level motion should remain:

- restrained
- cinematic
- elegant

Preferred:

- subtle reveals
- soft transitions
- restrained hover emphasis

Avoid:

- attention-seeking animation
- excessive motion
- page-level animation overload

Motion should support atmosphere, not dominate it.

---

# SSR Rules

Pages must remain SSR-safe.

Avoid:

- browser-only rendering assumptions
- hydration mismatches
- non-deterministic rendering

Page rendering must remain consistent between:

- server render
- client hydration

---

# Code Splitting Rules

Pages should be:

- route-level lazy loaded
- isolated into clean bundle boundaries

Avoid:

- importing all pages eagerly
- giant route bundles
- deeply fragmented page architecture

---

# Error Handling Rules

Pages should gracefully support:

- missing product slugs
- missing article slugs
- route fallback states
- empty data states

Fallback UX should remain:

- branded
- minimal
- visually consistent

---

# Output Expectations

When generating a page:

1. provide complete files
2. preserve DS conventions
3. preserve routing conventions
4. preserve SEO compatibility
5. preserve accessibility
6. preserve SSR compatibility
7. preserve visual-system consistency

Avoid placeholder implementations.

---

# Page Principle

Pages are composition layers.

Their role is to:

- structure experience
- express hierarchy
- compose the design system
- reinforce brand atmosphere

Pages should feel:

- elegant
- spacious
- deliberate
- cinematic
- consistent

```

```
