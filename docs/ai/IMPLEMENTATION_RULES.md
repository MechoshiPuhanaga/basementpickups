# Implementation Rules — Basement Pickups

This document defines the implementation constraints and engineering rules for the project.

These rules are architectural requirements, not optional suggestions.

All generated code must follow them.

---

# General Philosophy

Prefer:

- simplicity
- clarity
- explicit architecture
- maintainability
- composability
- predictability

Avoid:

- clever abstractions
- unnecessary indirection
- premature optimization
- framework-style magic
- hidden behavior

Code should feel:

- deliberate
- understandable
- stable
- disciplined

---

# React Rules

Use:

- functional components only
- hooks only when necessary
- explicit props
- explicit composition
- route-level code splitting
- React streaming SSR APIs

Do not use:

- class components
- unnecessary context providers
- prop drilling abstractions without need
- hidden side effects
- component factories
- runtime-generated styling systems

Components should remain:

- small
- composable
- readable
- focused

---

# TypeScript Rules

TypeScript settings should be strict.

Use:

- explicit typing
- readonly where appropriate
- discriminated unions where useful
- exhaustive checks where valuable
- semantic type naming

Avoid:

- `any`
- unnecessary type assertions
- weak typing
- overly generic abstractions
- complex type-level programming unless necessary

Prefer:

- readable types
- maintainable types
- practical strictness

All generated code must pass strict TypeScript checks.

---

# CSS Rules

Use:

- vanilla CSS only
- CSS Modules for all DS component styles
- CSS variables
- flat selectors
- component-scoped CSS files
- semantic class names
- explicit styling structure

Do not use:

- selector nesting
- utility-class styling systems
- CSS-in-JS
- styled-components
- Tailwind
- inline styles except for unavoidable dynamic CSS variables

CSS should remain:

- readable
- explicit
- predictable
- maintainable

---

# CSS Modules Convention

All DS component CSS files use the `.module.css` extension.

Naming and usage:

```txt
Button/
  Button.tsx
  Button.module.css
```

```tsx
import styles from './Button.module.css';

export function Button({ variant }: Props) {
  return <button className={styles.button} data-variant={variant} />;
}
```

Rules:

- DS components import their own `.module.css`
- class names referenced as `styles.foo` (camelCase)
- variants expressed as `data-*` attributes targeted via attribute selectors in the module
- CSS Module class identifiers stay semantic (e.g. `.button`, `.label`)

Global CSS (NOT a module):

- `src/design-system/tokens/reset.css`
- `src/design-system/tokens/tokens.css`
- `src/design-system/tokens/fonts.css`
- `src/design-system/tokens/global.css`

These remain plain `.css` because they are global by design (reset, font-face, CSS variables on `:root`, baseline `html`/`body` styling).

Do not:

- import non-module CSS from inside DS components
- create page-level CSS modules (pages compose DS components only)
- use CSS Modules `:global` or `composes` unless explicitly justified

---

# CSS Architecture

The design system owns styling.

Structure:

- each DS component has its own `.module.css` file colocated with the component
- tokens are centralized in `src/design-system/tokens/`
- global styles remain minimal
- components expose semantic props rather than styling hooks

Business/page code should not contain:

- ad hoc styling
- utility classes
- duplicated layout logic
- visual implementation details

Pages compose DS components only.

---

# CSS Variables

Use CSS variables for:

- colors
- typography
- spacing
- shadows
- borders
- radii
- animation timing
- z-index
- layout constraints

Variables should be:

- semantic
- centralized
- reusable
- predictable

Avoid hardcoded visual values in components whenever practical.

---

# Component Philosophy

Components should:

- do one thing well
- remain composable
- expose semantic APIs
- avoid hidden behavior
- remain SSR-safe
- remain accessible

Prefer:

- explicit props
- semantic variants
- predictable rendering

Avoid:

- excessive configurability
- generic mega-components
- over-abstraction
- styling escape hatches

---

# Design System Ownership

The design system owns:

- typography
- spacing
- colors
- layout primitives
- surfaces
- frames
- interactive styling
- visual consistency

Pages and business features compose DS components.

The page layer should primarily express:

- structure
- composition
- content
- routing intent

not styling logic.

---

# Atomic Design Structure

The DS follows layered composition:

1. Tokens

- CSS variables
- typography
- spacing
- colors
- shadows

2. Atoms

- Button
- Text
- Heading
- Input
- Select
- Frame
- Box
- Stack
- Grid
- etc.

3. Molecules

- ProductCard
- ArticleCard
- ContactForm
- ProductGallery
- etc.

4. Organisms

- Header
- Footer
- Hero
- ProductGrid
- etc.

5. Layouts

- PageShell
- Section
- ProductLayout
- ArticleLayout

Pages compose layouts and organisms.

---

# File Structure Rules

Prefer:

- predictable folder structure
- colocated CSS
- colocated tests if added later
- colocated component files

Example:

```txt
Button/
  Button.tsx
  Button.module.css
  Button.types.ts
```

Avoid:

- giant shared utility folders
- deeply nested architecture
- unclear ownership

---

# Import Rules

Prefer:

- explicit imports
- stable import structure
- predictable dependency direction

Avoid:

- circular dependencies
- deeply coupled modules
- hidden side-effect imports

Design-system atoms should remain dependency-light.

---

# Routing Rules

Use React Router.

Routing should:

- support SSR
- support route-level code splitting
- remain explicit
- remain centralized
- remain predictable

Use lazy loading for page-level routes.

Avoid:

- routing magic
- deeply nested route complexity
- unnecessary routing abstractions

---

# Code Splitting Rules

Use code splitting:

- at the page/route level
- for large isolated features

Do not aggressively split:

- DS atoms
- core layout primitives
- heavily reused UI

Optimize for:

- maintainability
- SSR consistency
- predictable hydration
- reasonable bundle boundaries

---

# SSR Rules

All code must remain SSR-safe.

Avoid:

- browser-only assumptions during render
- direct window/document access during SSR
- hydration mismatches
- non-deterministic rendering

Browser APIs should be isolated appropriately.

SSR and hydration output must remain aligned.

---

# SEO Rules

SEO should:

- be generated server-side
- remain route-aware
- support Open Graph metadata
- support product/article metadata
- avoid client-only SEO generation

SEO should remain framework-independent.

---

# Accessibility Rules

All components must:

- use semantic HTML
- support keyboard navigation
- maintain accessible contrast
- support screen readers where appropriate

Accessibility is required by default.

Do not treat accessibility as optional enhancement work.

---

# Performance Rules

Prioritize:

- SSR performance
- predictable hydration
- reasonable bundle size
- route-level splitting
- image optimization readiness
- stable rendering

Avoid:

- unnecessary runtime complexity
- excessive client-side computation
- oversized dependency chains

---

# Animation Rules

Animation should remain:

- restrained
- subtle
- performant
- purposeful

Prefer:

- opacity transitions
- transform-based motion
- soft hover states

Avoid:

- excessive motion
- attention-seeking animation
- complex animation frameworks unless approved

---

# Dependency Philosophy

Dependencies should be:

- justified
- stable
- maintainable
- minimal

Prefer platform-native solutions where possible.

Do not introduce libraries for problems already solved cleanly by:

- React
- TypeScript
- browser APIs
- small internal utilities

---

# Error Handling

Prefer:

- explicit failures
- invariant checks
- readable runtime errors
- predictable fallback behavior

Avoid:

- silent failure
- hidden runtime assumptions

---

# Workflow Rules

Before major implementation:

1. identify relevant AI docs
2. summarize intended changes
3. propose affected files
4. implement in focused steps

Avoid:

- large uncontrolled rewrites
- speculative architecture changes
- introducing unrelated patterns

Implementation should remain incremental and reviewable.

---

# Important Principle

Architecture is owned by the developer.

Claude should:

- implement constrained decisions
- preserve architectural consistency
- preserve visual-system consistency
- avoid introducing unrelated abstractions
- optimize for maintainability and clarity

# Font Loading Rules

Fonts should be:

- self-hosted
- loaded locally
- exposed through CSS variables
- integrated through DS typography tokens

Preferred formats:

- woff2
- woff

Avoid:

- runtime font loading dependencies
- scattered font declarations
- page-level font ownership

---

# Font Loading Strategy

Fonts must be optimized intentionally.

Typography loading must be derived from the approved design references inside:

```txt
design/references/
```

Before adding font variants:

1. inspect the approved design references
2. identify actual typography usage
3. identify actual weights/styles used visually
4. load only the required variants

Do not load font variants speculatively.

---

# Design-Derived Typography Loading

The approved visual references are the source of truth for:

- font usage
- font hierarchy
- weight usage
- uppercase behavior
- spacing behavior
- editorial emphasis
- decorative typography

Typography implementation should faithfully reflect the approved designs.

Avoid:

- inventing additional font weights
- introducing unrelated styles
- over-expanding typography systems
- adding variants “just in case”

---

# Approved Font Families

## Poiret One

Usage:

- hero headings
- navigation
- decorative typography
- Art Deco titles

Required variants:

- Regular 400

Reason:
The approved designs only use the regular weight visually.

Do not add additional weights unless future approved designs require them.

---

## Cormorant Garamond

Usage:

- editorial text
- atmospheric supporting copy
- quotes
- premium descriptive content

Load only variants visibly required by approved compositions.

Initial approved variants:

- Regular 400
- Medium 500
- Italic 400

Avoid loading:

- excessive italics
- black weights
- decorative alternates

---

## Inter

Usage:

- body text
- metadata
- buttons
- forms
- UI labels
- readable interface content

Load only the variants required by the approved designs.

Initial approved variants:

- Regular 400
- Medium 500
- SemiBold 600

Avoid loading:

- thin weights
- black weights
- excessive italics
- unused variants

---

# Font Optimization Rules

Prefer:

- self-hosted fonts
- woff2 format
- minimal variant count
- explicit font-face declarations
- deterministic loading

Avoid:

- full Google Fonts CSS payloads
- runtime font providers in production
- entire family downloads
- speculative font loading

Typography payload should remain intentional and lightweight.

---

# Font Ownership

Font loading must remain centralized.

Preferred location:

```txt
src/design-system/tokens/fonts.css
```

Pages and business components must not define font loading.

Typography ownership belongs to the design system.

---

# Font Display Strategy

Use:

```css
font-display: swap;
```

for all font-face declarations.

The application should:

- remain readable during font loading
- avoid invisible text
- preserve layout stability

---

# Typography Token Rules

Fonts should only be consumed through typography tokens and semantic variants.

Preferred:

```css
--font-display
--font-editorial
--font-body
```

Avoid direct font-family declarations inside:

- pages
- business components
- ad hoc CSS

Typography should remain semantically controlled through the DS.

---

# Future Typography Expansion Rule

New font variants may only be added if:

- they appear in newly approved designs
- they are actively required
- their payload cost is justified

The approved design references remain the source of truth.
