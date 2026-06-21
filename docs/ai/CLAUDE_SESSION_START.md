# Claude Session Start — Basement Pickups

You are helping build the Basement Pickups website.

Read this file first, then read the relevant files in `docs/ai/` before implementing anything.

---

# Project Summary

Basement Pickups is a boutique guitar pickup brand website.

The brand aesthetic must feel:

- premium
- dark
- handcrafted
- Art Deco inspired
- guitar-focused
- warm
- cinematic
- elegant
- restrained

The MVP includes:

1. Home page with latest news/articles
2. Shop page with products
3. Single product page
4. Single article page
5. About page
6. Contact form page

---

# Technical Stack

Use:

- React latest stable version
- React streaming SSR APIs
- TypeScript with strictest practical settings
- Vite
- Node server for SSR
- React Router
- Docker-ready architecture
- Heroku-compatible runtime behavior
- vanilla CSS
- CSS Modules (`.module.css`) for all DS component styles
- plain global CSS only for `src/design-system/tokens/*.css`
- CSS variables
- no selector nesting
- support for last 2 versions of major browsers

---

# Tooling

Use:

- ESLint
- Prettier
- Stylelint

Requirements:

- ESLint for TypeScript, TSX, JavaScript, HTML, and Markdown
- Prettier integrated with ESLint
- Stylelint for all CSS
- strict formatting consistency

All generated code must:

- pass TypeScript strict mode
- pass ESLint
- pass Stylelint
- format correctly with Prettier
- avoid unused code
- avoid unnecessary abstractions
- preserve SSR compatibility

---

# Forbidden Technologies

Do not use:

- Next.js
- Remix
- Tailwind
- CSS-in-JS
- styled-components
- Emotion
- utility-class styling approaches
- UI component libraries
- unnecessary third-party abstractions

Do not introduce dependencies unless explicitly approved.

Prefer platform-native and React-native solutions.

---

# AI Documentation Reading Order

Always read files in this order:

1. `CLAUDE_SESSION_START.md`
   - master project rules and workflow

2. `PROJECT_OVERVIEW.md`
   - business goals, product identity, target audience

3. `VISUAL_LANGUAGE.md`
   - visual direction, typography mood, photography direction, composition philosophy

4. `IMPLEMENTATION_RULES.md`
   - technical constraints, CSS rules, React conventions, architecture boundaries

5. `ARCHITECTURE.md`
   - application structure, SSR flow, routing, data flow, folder structure

6. `DESIGN_SYSTEM.md`
   - DS philosophy, tokens, atomic structure, component hierarchy

Then read additional files only if relevant to the current task.

Examples:

- routing work → read `ROUTING_AND_SEO.md`
- accessibility work → read `ACCESSIBILITY.md`
- creating atoms → read `skills/create-atom.md`
- creating molecules → read `skills/create-molecule.md`

---

# Routing

Use React Router.

Routing should remain:

- simple
- explicit
- SSR-compatible
- predictable
- maintainable
- code-split by route

Use route-level code splitting for page components.

Preferred approach:

- lazy-load page modules at the route level
- keep shared layouts and design-system components reusable
- avoid putting large page-specific code in the initial bundle
- keep critical shell/navigation available early
- ensure SSR rendering and client hydration remain aligned

Avoid:

- unnecessary routing abstractions
- eager importing every page into the initial client bundle
- code splitting design-system atoms that are used everywhere
- code splitting so aggressively that UX becomes fragmented

---

# Design System Rule

The design system owns styling.

Business/page components should compose design-system components and pass semantic props.

Pages should not contain:

- ad hoc CSS
- utility classes
- visual styling decisions
- duplicated layout patterns

Preferred usage:

```tsx
<Button variant="primary" size="large">
  Shop Pickups
</Button>

<Text variant="body">
  Handwound pickups built for timeless tone.
</Text>
```

Avoid:

```tsx
<div className="custom-page-title">...</div>
```

---

# CSS Rules

Use:

- flat vanilla CSS selectors
- CSS variables for tokens
- semantic component class names inside DS components
- predictable modifier naming where useful

Do not use:

- nested selectors
- utility-class styling
- inline styles except for unavoidable dynamic CSS variables
- global styling leaks

All styling should live inside the design system.

---

# Typography System

The design system uses three font roles:

1. Display font

- Art Deco headings
- navigation
- decorative labels
- hero typography

2. Supporting font

- elegant headings
- subheadings
- premium descriptive copy

3. UI/body font

- readable body text
- forms
- metadata
- prices
- technical UI

Typography must be exposed through semantic DS props, not manually selected in pages.

---

# Visual Direction

Use:

- dark charcoal / near-black backgrounds
- warm gold linework
- cream typography
- Art Deco SVG frames
- geometric separators
- luxurious product-card borders
- cinematic product photography
- restrained animation
- spacious layout
- symmetry where appropriate
- premium editorial composition

Avoid:

- generic SaaS aesthetics
- bright ecommerce styling
- Amazon-style product presentation
- flat layouts
- over-decoration
- noisy UI
- excessive animation

The visual language should feel like:

- boutique luthier workshop
- luxury audio equipment
- vintage cinema
- elegant industrial design
- handcrafted premium products

---

# Product Photography Direction

Photography should feel:

- cinematic
- warm
- shadow-driven
- luxurious
- handcrafted

Use:

- dark backgrounds
- controlled reflections
- warm highlights
- selective lighting
- negative fill
- shallow depth of field
- geometric compositions

Avoid:

- bright white ecommerce photography
- flat lighting
- shadowless presentation
- overly clinical imagery

---

# Data Model

Products and articles are local imported TypeScript/JSON data files.

No CMS or database for MVP.

SEO should be resolved server-side from route and local data before streaming.

---

# SEO

SEO should:

- be SSR-generated
- use route-aware metadata
- use product/article data
- generate proper titles and descriptions
- support Open Graph metadata
- remain framework-independent

Use server-side SEO resolution before streaming.

---

# Accessibility

All components must:

- use semantic HTML
- support keyboard navigation
- maintain accessible contrast
- support screen readers where appropriate
- avoid accessibility regressions

Accessibility is required, not optional.

---

# Workflow Rules

Before writing code:

1. Identify which AI docs are relevant.
2. Summarize the intended change.
3. Propose files to create or edit.
4. Wait for approval if the change is architectural or large.

When implementing:

- work in small focused steps
- implement one concern at a time
- preserve existing architecture
- avoid rewriting unrelated files
- keep components SSR-safe
- keep components accessible
- keep TypeScript strict
- avoid speculative abstractions

When adding a new page or route:

- add it through the central route configuration
- use route-level code splitting
- ensure SSR can resolve the same route
- ensure SEO metadata can be resolved for that route
- avoid importing the page directly into the main app bundle

---

# Output Preference

Prefer:

- concise implementation explanations
- maintainable code
- explicit architecture
- readability over cleverness

When generating code:

- provide complete files unless patches are requested
- preserve existing conventions
- avoid placeholder implementations

When reviewing code:
focus on:

- architecture consistency
- design-system boundaries
- accessibility
- SSR safety
- TypeScript correctness
- CSS consistency
- visual-system consistency
- unnecessary complexity

---

# Important Principle

Architecture and design decisions are owned by the developer.

Claude should:

- implement constrained decisions
- preserve system consistency
- accelerate development
- avoid introducing unrelated architectural changes
- avoid drifting from the established visual language

# Session Setup Check

At the beginning of an implementation session, Claude should check whether the project setup is already in place before generating feature code.

If the project is still incomplete or partially scaffolded, first verify the required foundation files and tooling.

Check for:

```txt
package.json
pnpm-lock.yaml
.npmrc
.nvmrc
tsconfig.json
tsconfig.node.json
vite.config.ts
eslint config
prettier config
stylelint config
index.html
server/
src/entry-client.tsx
src/entry-server.tsx
src/app/
src/design-system/
src/design-system/tokens/
```

Also verify that:

```txt
Node version is 24.16.0
pnpm version is pinned
dependencies use exact versions
scripts are present
TypeScript strict mode is enabled
React SSR setup exists
React Router setup exists
ESLint covers TS, TSX, JS, HTML, and Markdown
Prettier is configured
Stylelint is configured for CSS
CSS rules match project constraints
Docker/Heroku assumptions are preserved
```

If required foundation files are missing, Claude should:

1. report what is missing
2. propose a setup plan
3. ask for approval before creating multiple files
4. implement setup incrementally

Do not assume the project setup is complete.

Do not start feature/component work before confirming the foundation is sufficient for that task.

# Initial Implementation Milestone

Before building design-system components or page content, complete the project infrastructure milestone.

The first implementation goal is:

```txt
A working local SSR app available at http://localhost:3000
```

This milestone must include:

- package manager setup
- fixed Node/pnpm versions
- TypeScript strict setup
- Vite setup
- React setup
- React Router setup
- streaming SSR setup
- Node server setup
- development server flow
- production build scripts
- ESLint setup
- Prettier setup
- Stylelint setup
- empty route pages
- route-level code splitting
- basic SEO resolution
- local data placeholders
- design-system folder skeleton
- global reset/tokens placeholder CSS

Required empty routes:

```txt
/                 -> HomePage
/shop             -> ShopPage
/products/:slug   -> ProductPage
/articles/:slug   -> ArticlePage
/about            -> AboutPage
/contact          -> ContactPage
*                 -> NotFoundPage
```

At this milestone, pages may be visually minimal placeholders, but they must:

- render through SSR
- hydrate correctly
- navigate through React Router
- support lazy-loaded route modules
- be visible locally on port `3000`
- preserve Heroku-compatible server behavior using `process.env.PORT || 3000`

Do not start visual DS implementation until this infrastructure milestone works.

# Project Status Check

At the beginning of every implementation session:

1. read:

```txt
docs/ai/PROJECT_STATUS.md
```

2. identify:

- current milestone
- completed work
- unfinished work
- next planned tasks
- known blockers

3. summarize the current project state before implementation

4. avoid duplicating already completed work

5. after completing meaningful work, update:

```txt
docs/ai/PROJECT_STATUS.md
```

The status file is the operational memory of the project.
