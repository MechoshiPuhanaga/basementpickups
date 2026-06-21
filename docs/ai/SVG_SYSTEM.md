# SVG System — Basement Pickups

This document defines the canonical SVG ornament and frame system used across the Basement Pickups website.

The SVG system is part of the brand identity.

SVG implementation must be derived from the approved design references located in:

```txt
design/references/
```

Do not invent unrelated decorative systems.

The goal is to systematize the observed visual language into reusable SVG primitives.

---

# SVG System Philosophy

The SVG language should feel:

- Art Deco
- geometric
- restrained
- premium
- architectural
- musical
- cinematic
- handcrafted
- symmetrical where appropriate

The SVG language should not feel:

- floral
- gothic
- baroque
- victorian
- cyberpunk
- noisy
- maximalist
- generic ecommerce

The system should reinforce:

- craftsmanship
- luxury
- editorial presentation
- boutique atmosphere

---

# Design Source of Truth

The approved design references are the primary visual source.

Before implementing or modifying SVGs:

1. inspect the relevant reference image
2. identify:
   - corner geometry
   - line hierarchy
   - border spacing
   - ornament rhythm
   - separator patterns
   - symmetry logic
3. derive reusable SVG primitives from those observations

Do not redesign the visual language.

The goal is:

- adaptation
- systematization
- consistency

Not reinvention.

---

# Visual Characteristics

The SVG system uses:

- thin gold linework
- layered border hierarchy
- stepped corners
- diagonal cuts
- centered ornaments
- diamond motifs
- symmetrical framing
- restrained repetition
- elegant spacing
- minimal fills

The system avoids:

- excessive density
- decorative clutter
- random ornament placement
- organic curves
- thick borders
- illustrative decoration

---

# Geometry Language

Preferred geometry:

- rectangles
- parallel lines
- stepped paths
- diamonds
- diagonal cuts
- symmetrical line structures
- centered compositions
- repeating proportions

Avoid:

- random asymmetry
- decorative flourishes
- excessive curves
- hand-drawn irregularity
- ornamental chaos

The geometry should feel:

- precise
- engineered
- architectural

---

# SVG Component Families

The SVG system is composed from reusable primitives.

---

# 1. DecoCorner

Purpose:

- decorative corner framing

Used for:

- pages
- cards
- panels
- forms
- image frames

Variants:

```txt
simple
stepped
double
card
page
hero
```

Supported positions:

```txt
top-left
top-right
bottom-left
bottom-right
```

Characteristics:

- stepped geometry
- diagonal cuts
- layered line hierarchy
- restrained ornamentation

Corners should create identity without visual heaviness.

---

# 2. DecoFrame

Purpose:

- full content framing

Used for:

- hero sections
- product cards
- article cards
- panels
- forms
- featured sections

Variants:

```txt
page
hero
panel
product-card
image
form
editorial
```

Rules:

- outer border slightly stronger
- inner border thinner
- ornaments concentrated at edges/corners
- content remains visually dominant

Frames should support:

- hierarchy
- composition
- atmosphere

Not overwhelm content.

---

# 3. DecoSeparator

Purpose:

- sectional rhythm
- visual breaks
- editorial structure

Variants:

```txt
diamond
double-line
title
small
minimal
```

Used for:

- section transitions
- product card details
- article headers
- footer segmentation
- CTA emphasis

Separators should feel:

- elegant
- restrained
- symmetrical

---

# 4. DecoOrnament

Purpose:

- small decorative emphasis

Variants:

```txt
diamond
fan
badge
arrow
centerpiece
```

Used for:

- headings
- CTA areas
- footer centerpieces
- newsletter sections
- icon framing
- product emphasis

Ornaments should remain:

- minimal
- geometric
- compositional

---

# Linework Rules

Linework should be:

- thin
- elegant
- restrained
- consistent

Use hierarchy:

```txt
primary border
secondary border
detail lines
micro ornaments
```

Avoid:

- heavy strokes
- inconsistent widths
- visual noise

---

# Color Rules

Use CSS variables only.

Preferred:

```css
--color-line-gold
```

SVGs should use:

```svg
stroke="currentColor"
```

or:

```svg
stroke="var(--color-line-gold)"
```

Avoid:

- hardcoded hex colors
- gradients
- glow effects
- heavy fills

The SVG system should remain elegant and flat.

---

# SVG Technical Rules

All SVGs must:

- use `viewBox`
- scale responsively
- support SSR safely
- avoid runtime randomness
- avoid unnecessary IDs
- remain deterministic

Preferred:

```svg
vector-effect="non-scaling-stroke"
stroke-linecap="square"
stroke-linejoin="miter"
```

Avoid:

- raster images
- canvas rendering
- filter-heavy effects
- shadow-heavy SVGs

---

# Accessibility Rules

Decorative SVGs must use:

```html
aria-hidden="true" focusable="false"
```

Decorative SVGs should not:

- receive focus
- expose meaningless structure to screen readers

Only meaningful icons should expose accessible labels.

---

# CSS Integration Rules

SVG styling belongs to the design system.

Use:

- vanilla CSS
- flat selectors
- CSS variables

Preferred class naming:

```css
.bp-deco-frame
.bp-deco-corner
.bp-deco-separator
.bp-deco-ornament
```

Avoid:

- nested selectors
- utility styling
- inline styling proliferation

---

# Composition Rules

SVGs should compose cleanly with:

- atoms
- molecules
- layouts
- cards
- sections

SVGs should:

- not interfere with layout
- not trap pointer events
- not obscure content
- preserve readability

Preferred:

```css
pointer-events: none;
```

for purely decorative layers.

---

# Responsive Rules

SVG systems must remain:

- scalable
- readable
- elegant

At smaller sizes:

- simplify detail density if needed
- preserve primary geometry
- preserve spacing clarity

Avoid:

- collapsing ornamentation
- unreadable micro-detail
- excessive scaling distortion

---

# Animation Rules

SVG animation should remain:

- subtle
- restrained
- minimal

Preferred:

- opacity transitions
- slight transforms
- restrained hover emphasis

Avoid:

- glowing effects
- looping animation
- excessive motion
- distracting interaction

The site should feel:

- calm
- luxurious
- composed

---

# Product Card SVG Philosophy

Product card framing is one of the most important brand elements.

Product card SVGs should:

- frame photography elegantly
- preserve whitespace
- reinforce premium presentation
- feel handcrafted

Avoid:

- marketplace aesthetics
- noisy ecommerce frames
- excessive ornament density

---

# Editorial SVG Philosophy

Editorial pages should feel:

- literary
- cinematic
- atmospheric

SVGs should support:

- typography rhythm
- section transitions
- premium editorial structure

Avoid:

- blog-template aesthetics
- visual clutter

---

# Hero SVG Philosophy

Hero framing should:

- establish atmosphere
- establish brand identity
- create compositional focus

Hero SVGs may be:

- slightly larger
- slightly more ornate

But must remain restrained.

---

# SVG Extraction Rule

When new SVGs are needed:

1. inspect the approved references
2. identify reusable geometry patterns
3. adapt them into reusable primitives
4. preserve consistency with existing SVG language

Do not create isolated one-off decorative systems.

---

# Implementation Goal

The SVG system should provide a reusable visual grammar capable of building:

- page borders
- product card frames
- article card frames
- hero framing
- section separators
- footer ornaments
- CTA framing
- form decoration
- newsletter framing
- editorial dividers

The resulting system should feel unmistakably connected to the approved Basement Pickups designs.

---

# SVG System Principle

The SVG system is not decoration added afterward.

It is part of the brand architecture.

Every SVG should feel:

- intentional
- geometric
- restrained
- premium
- reusable
- design-derived
- compositionally elegant
