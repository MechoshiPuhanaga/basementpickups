# Basement Pickups — AI Project Entry

This repository contains the Basement Pickups website.

The project is:

- React
- TypeScript
- Vite
- custom streaming SSR
- React Router
- vanilla CSS
- CSS variables
- design-system driven

Before implementing anything, read the AI documentation in the required order.

---

# Required Reading Order

Read these files in order:

1. `docs/ai/CLAUDE_SESSION_START.md`
2. `docs/ai/PROJECT_OVERVIEW.md`
3. `docs/ai/VISUAL_LANGUAGE.md`
4. `docs/ai/IMPLEMENTATION_RULES.md`
5. `docs/ai/ARCHITECTURE.md`
6. `docs/ai/DESIGN_SYSTEM.md`
7. `docs/ai/SVG_SYSTEM.md`

Then read additional files only if relevant.

Examples:

```txt
Data model work
  -> docs/ai/DATA_MODEL.md

Routing work
  -> docs/ai/ROUTING_AND_SEO.md

Accessibility work
  -> docs/ai/ACCESSIBILITY.md

Creating atoms
  -> docs/ai/skills/create-atom.md

Creating molecules
  -> docs/ai/skills/create-molecule.md

Creating pages
  -> docs/ai/skills/create-page.md

Reviewing components
  -> docs/ai/skills/review-component.md

Creating SVG frames
  -> docs/ai/skills/create-svg-frame.md
```

---

# Important Rules

The design system owns styling.

Pages and business features compose DS components.

Do not:

- introduce Tailwind
- introduce CSS-in-JS
- introduce nested CSS
- invent new architectural patterns
- bypass DS primitives
- create utility-style styling systems

Use:

- vanilla CSS
- CSS Modules (`.module.css`) for all DS component styles
- plain global CSS only for `src/design-system/tokens/*.css`
- CSS variables
- semantic component APIs
- SSR-safe React patterns
- strict TypeScript

---

# Design References

Approved visual references are located in:

```txt
design/references/
```

These references are the source of truth for:

- typography usage
- SVG frame language
- spacing rhythm
- visual hierarchy
- decorative systems
- product presentation

Do not invent unrelated visual systems when references exist.

---

# Workflow Expectations

Before implementation:

1. identify relevant AI docs
2. summarize intended changes
3. propose affected files
4. implement incrementally

Prefer:

- small focused changes
- maintainable code
- explicit architecture
- restrained abstractions

Avoid:

- giant rewrites
- speculative architecture
- unnecessary dependencies
- unrelated refactors

---

# Architectural Principle

The goal is a maintainable boutique ecommerce platform with:

- strong visual identity
- disciplined design-system architecture
- SSR-first rendering
- premium editorial presentation
- long-term maintainability

Preserve consistency across:

- architecture
- styling
- typography
- composition
- SVG frame language
- accessibility
- SEO

# Skills System

Reusable implementation workflows are located in:

```txt
docs/ai/skills/
```

Use the appropriate skill document before implementing related work.

Available skills:

```txt
create-atom.md
create-molecule.md
create-page.md
create-svg-frame.md
review-component.md
optimize-images.md
add-product.md
audit-lighthouse.md
add-faq-item.md
```

Examples:

```txt
Creating a DS atom
  -> read skills/create-atom.md

Creating a ProductCard
  -> read skills/create-molecule.md

Creating a page route
  -> read skills/create-page.md

Creating decorative SVG framing
  -> read skills/create-svg-frame.md

Reviewing existing code
  -> read skills/review-component.md

Adding or optimizing a photo
  -> read skills/optimize-images.md

Adding new products / updating the catalog
  -> read skills/add-product.md

Auditing quality (perf / a11y / best-practices / SEO)
  -> read skills/audit-lighthouse.md

Adding a Q&A / FAQ entry (wording + Art Deco icon)
  -> read skills/add-faq-item.md
```

Skills are implementation contracts.

They define:

- ownership boundaries
- API philosophy
- accessibility expectations
- CSS rules
- SSR expectations
- visual-system consistency rules

Always apply the relevant skill before implementation.

# Package Manager and Runtime

Use pnpm at project level.

Runtime versions are fixed:

- Node: 24.16.0
- pnpm: 11.2.2

Rules:

- use `pnpm-lock.yaml`
- install with `pnpm install --frozen-lockfile` in Docker/CI
- use exact dependency versions
- do not use yarn or npm scripts
- do not change Node/pnpm versions without approval

--# Production Deployment Context

Production deployment will be handled manually by the developer.

The app will be deployed to Heroku using Heroku Docker/container deployment.

Claude should make the application compatible with this deployment model, but should not create or modify deployment workflows unless explicitly asked.

Production assumptions:

- app runs inside Docker
- base runtime uses Node `24.16.0-alpine`
- package manager is pnpm
- dependencies are installed from `pnpm-lock.yaml`
- server must listen on `process.env.PORT`
- production command must start the Node SSR server
- static assets are served by the Node app unless changed later
- domain/DNS is managed externally through Cloudflare

Do not assume:

- Vercel
- Netlify
- Next.js hosting
- serverless runtime
- edge runtime
- CDN-managed SSR

The production target is:

```txt
Cloudflare DNS/domain
  -> Heroku app
  -> Docker container
  -> Node SSR server
  -> React streaming SSR response-
```

# Design Reference Priority

Approved design references located in:

```txt
design/references/
```

are the primary source of truth for visual implementation.

When implementing:

- typography
- spacing
- layout rhythm
- SVG frames
- decorative systems
- product presentation
- editorial composition
- visual hierarchy

Claude should:

1. inspect the relevant design references
2. identify the observed visual patterns
3. derive implementation decisions from those references
4. avoid inventing unrelated visual systems

Implementation should adapt and systematize the approved designs rather than redesigning them.

During infrastructure setup:

- prepare the architecture for the design system
- create the required DS structure
- avoid premature visual implementation

During DS/page implementation:

- the approved designs become the dominant visual source of truth.
