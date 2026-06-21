# Design System — Basement Pickups

This document defines the design-system architecture, ownership boundaries, token philosophy, and component structure.

The design system is a core architectural layer of the application.

Its purpose is to:

- centralize visual language
- maintain consistency
- enforce composition rules
- reduce styling drift
- create reusable UI primitives
- preserve brand identity

The DS owns visual implementation.

Business/page layers compose DS components.

---

# Design System Philosophy

The DS should feel:

- disciplined
- explicit
- semantic
- composable
- predictable
- maintainable

The goal is not maximum abstraction.

The goal is:

- visual consistency
- architectural clarity
- compositional reuse
- semantic APIs
- restrained flexibility

Avoid:

- giant configurable mega-components
- styling escape hatches
- generic utility-driven APIs
- uncontrolled variants
- visual duplication

---

# Ownership Boundaries

The DS owns:

- typography
- spacing
- colors
- surfaces
- layout primitives
- decorative systems
- SVG frames
- interactive styling
- visual rhythm
- responsive behavior rules
- animation language

Business/page code owns:

- content
- composition
- route intent
- product/article structure
- business logic

Pages should not implement visual systems directly.

---

# Design Tokens

Design tokens are centralized.

Tokens should be implemented using CSS variables.

Primary token categories:

```txt
colors
typography
spacing
shadows
borders
radii
z-index
animation
layout
```

Tokens should be:

- semantic
- reusable
- centralized
- predictable

Avoid:

- arbitrary visual values
- duplicated constants
- ad hoc spacing values

---

# Token Philosophy

Prefer semantic tokens over literal tokens.

Preferred:

```css
--color-surface-primary
--color-text-muted
--space-section-large
```

Avoid:

```css
--gold-200
--gray-900
--padding-27
```

The goal is maintainability and visual-system clarity.

---

# Typography System

The typography system uses three font roles:

1. Display font

- hero headings
- navigation
- decorative labels
- major section titles

2. Supporting font

- subheadings
- editorial emphasis
- premium descriptive copy

3. UI/body font

- readable body text
- forms
- metadata
- technical content
- pricing

Typography should be exposed semantically through props.

Preferred:

```tsx
<Text variant="body" />
<Heading variant="hero" />
```

Avoid:

```tsx
<Text font="poiret" />
```

Typography variants should encode:

- font family
- size
- weight
- spacing
- transform
- rhythm

---

# Typography Stack

The typography system uses three approved font families.

## Display Font

Font:

- Poiret One

Usage:

- hero headings
- navigation
- decorative typography
- Art Deco titles
- major branding moments

Characteristics:

- geometric
- elegant
- lightweight
- Art Deco inspired

---

## Supporting Editorial Font

Font:

- Cormorant Garamond

Usage:

- editorial copy
- atmospheric text
- quotes
- premium descriptive content

Characteristics:

- cinematic
- elegant
- luxury editorial tone

---

## UI and Body Font

Font:

- Inter

Usage:

- body text
- forms
- metadata
- buttons
- technical content
- readable UI

Characteristics:

- neutral
- highly readable
- modern
- production-stable

---

# Font Usage Rules

Typography should be selected semantically through DS variants.

Preferred:

```tsx
<Heading variant="hero" />
<Text variant="body" />
```

Avoid direct font-family usage in business/page code.

Typography ownership belongs to the design system.

---

# Spacing Philosophy

Spacing is part of the visual identity.

The layout should feel:

- spacious
- breathable
- calm
- deliberate

Spacing should follow a constrained scale.

Avoid:

- arbitrary spacing values
- cramped layouts
- inconsistent rhythm

Negative space is part of the design language.

---

# Color Philosophy

The color palette is intentionally restrained.

Primary tones:

- charcoal blacks
- warm gold accents
- cream typography
- muted warm grays

Color usage should emphasize:

- hierarchy
- atmosphere
- contrast
- restraint

Avoid:

- overly colorful UI
- bright accent overload
- excessive gradients

Gold accents should feel:

- metallic
- understated
- premium

---

# Surface System

Surfaces should feel:

- layered
- premium
- dark
- restrained

Surface differentiation should rely on:

- tonal variation
- borders
- spacing
- shadows
- framing

Avoid:

- flat white surfaces
- overly bright cards
- excessive glassmorphism
- noisy effects

---

# SVG Frame System

The SVG frame system is a core visual identity layer.

Frame variants may include:

- product frames
- panel frames
- hero frames
- image frames
- separator frames
- ornamental corner systems

Frames should feel:

- geometric
- elegant
- architectural
- symmetrical
- precise

Frame styling should use:

- thin linework
- warm gold tones
- restrained detail
- layered geometry

Frames should support content rather than overpower it.

---

# Atomic Design Structure

The DS follows layered composition:

1. Tokens
2. Atoms
3. Molecules
4. Organisms
5. Layouts

---

# Tokens Layer

Contains:

- CSS variables
- typography definitions
- spacing system
- color system
- motion timing
- shadows
- radii
- z-index

Tokens are global and foundational.

---

# Atoms Layer

Atoms are small reusable primitives.

Examples:

```txt
Text
Heading
Button
Input
Textarea
Select
Checkbox
Frame
Separator
Box
Stack
Grid
Surface
Badge
Price
IconButton
```

Atoms should:

- remain dependency-light
- remain composable
- remain reusable
- avoid business logic

Atoms should own:

- styling
- variants
- accessibility behavior
- semantic rendering

---

# Molecules Layer

Molecules combine atoms into reusable patterns.

Examples:

```txt
ProductCard
ArticleCard
ContactForm
BrandValueCard
ProductGallery
NewsletterSignup
```

Molecules may contain:

- composition logic
- local interaction behavior
- layout structure

Molecules should remain reusable across pages.

---

# Organisms Layer

Organisms combine molecules and atoms into larger sections.

Examples:

```txt
Header
Footer
Hero
ProductGrid
ArticleGrid
FeaturedProducts
```

Organisms should:

- remain compositional
- avoid page ownership
- avoid route-specific logic

---

# Layouts Layer

Layouts provide structural composition.

Examples:

```txt
PageShell
Section
ProductLayout
ArticleLayout
```

Layouts define:

- spacing rhythm
- section structure
- responsive composition
- page framing

Layouts should not contain business logic.

---

# Component API Philosophy

Component APIs should be:

- semantic
- explicit
- predictable
- restrained

Preferred:

```tsx
<Button variant="primary" size="large" />
```

Avoid:

```tsx
<Button color="gold" border="double" rounded shadow glow />
```

The system should guide consistency through constrained APIs.

---

# Variant Philosophy

Variants should represent:

- semantic intent
- visual hierarchy
- interaction role

Avoid:

- arbitrary stylistic variants
- uncontrolled visual combinations
- redundant props

Variants should remain:

- understandable
- limited
- composable

---

# Layout Primitive Philosophy

The DS should provide reusable layout primitives.

Examples:

```txt
Box
Stack
Inline
Grid
Section
Container
Surface
```

These primitives should:

- reduce layout duplication
- standardize spacing rhythm
- improve consistency

Pages should compose primitives rather than invent layout structures repeatedly.

---

# Responsive Philosophy

Responsive behavior should feel:

- stable
- elegant
- intentional

Avoid:

- excessive breakpoint complexity
- mobile-only hacks
- layout instability

Responsive rules should prioritize:

- readability
- spacing
- compositional integrity

---

# Animation Philosophy

Motion should remain:

- subtle
- restrained
- supportive

Preferred:

- opacity transitions
- transform transitions
- soft hover states
- elegant reveals

Avoid:

- flashy animation
- exaggerated motion
- animation-heavy interfaces

Motion should support polish, not dominate attention.

---

# Accessibility Philosophy

Accessibility is required by default.

All DS components must:

- use semantic HTML
- support keyboard navigation
- maintain accessible contrast
- expose accessible states
- remain screen-reader friendly

Accessibility should be built into primitives.

---

# Performance Philosophy

The DS should remain:

- lightweight
- composable
- SSR-friendly
- hydration-safe

Avoid:

- unnecessary runtime styling logic
- large dependency chains
- excessive client-side rendering work

---

# CSS Ownership Rules

All styling belongs inside the DS.

Pages should not:

- invent styling systems
- define random spacing
- create one-off visual patterns
- rely on utility classes

The DS should provide enough primitives to prevent styling duplication.

---

# CSS Modules Convention

DS component styles use CSS Modules (`.module.css`).

Structure:

```txt
atoms/Button/
  Button.tsx
  Button.module.css
```

```tsx
import styles from './Button.module.css';

<button className={styles.button} data-variant="primary" />;
```

Rules:

- every DS component CSS file uses `.module.css`
- class identifiers are semantic (`.button`, `.label`, `.icon`)
- variant differentiation uses `data-*` attribute selectors inside the module
- no `:global` or `composes` unless explicitly justified
- no nested selectors

Global CSS (NOT modules):

- `tokens/reset.css`
- `tokens/tokens.css`
- `tokens/fonts.css`
- `tokens/global.css`

These remain global because they own `:root` variables, font-face declarations, the CSS reset, and baseline `html`/`body` styling.

---

# Design-System Principle

The design system is the visual and structural foundation of the application.

Its purpose is not just component reuse.

Its purpose is:

- consistency
- clarity
- maintainability
- brand preservation
- compositional discipline

All UI implementation should reinforce the established visual language.

# SVG Ornament System

Decorative SVG ownership belongs to the centralized SVG system.

Canonical specification:

```txt
docs/ai/SVG_SYSTEM.md
```

The SVG system defines:

- frame geometry
- ornament hierarchy
- separator language
- corner systems
- visual rhythm
- SVG implementation rules

Do not create unrelated decorative systems outside this specification.
