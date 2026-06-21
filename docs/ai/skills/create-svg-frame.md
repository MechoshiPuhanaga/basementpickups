# Skill — Create SVG Frame

This skill defines the rules for creating and refining Art Deco SVG frame components.

SVG frames are a core part of the Basement Pickups visual identity.

Frames must be derived from the approved design reference images in the repository.

Do not invent unrelated decorative systems.

---

# Source of Truth

The frame system must be based on project design references.

Expected reference location:

```txt
design/references/basement-pickups-web-app-concept-design.png
```

This png contains all 6 pages.

Before creating or modifying SVG frames:

1. inspect the relevant reference image
2. identify the frame geometry used there
3. describe the observed structure
4. then implement an adapted reusable SVG

Do not create frames from imagination when reference images exist.

---

# SVG System

The canonical SVG system specification is located in:

```txt
docs/ai/SVG_SYSTEM.md
```

Read that file before implementing or modifying:

- frame components
- ornaments
- separators
- decorative SVG systems

---

# Frame Philosophy

Frames should feel:

- Art Deco
- geometric
- precise
- restrained
- premium
- architectural
- symmetrical where appropriate

Frames should not feel:

- random
- floral
- medieval
- gothic
- overly ornate
- noisy
- generic

The frame language should support the brand’s boutique luxury identity.

---

# Design Intent

Frames should create:

- focus
- hierarchy
- presentation quality
- luxury feel
- visual rhythm
- brand recognition

Frames should not overpower:

- product photography
- typography
- content readability
- page hierarchy

Decoration must remain disciplined.

---

# SVG Implementation Rules

Use inline SVG inside React components.

SVGs should:

- scale responsively
- use `viewBox`
- avoid fixed pixel-only assumptions
- use CSS variables for stroke/fill colors
- be deterministic
- be SSR-safe

Preferred:

```tsx
<svg viewBox="0 0 420 620" aria-hidden="true">
  ...
</svg>
```

Avoid:

- raster images for frames
- canvas
- JS-generated random geometry
- uncontrolled dynamic SVG generation

---

# Accessibility Rules

Decorative frames should be hidden from assistive technology.

Use:

```tsx
aria-hidden="true"
focusable="false"
```

Do not expose decorative frame paths to screen readers.

Only meaningful SVGs should have accessible labels.

---

# Color Rules

Use CSS variables.

Preferred:

```tsx
stroke = 'var(--color-line-gold)';
fill = 'none';
```

Avoid hardcoded colors unless explicitly part of a token definition.

Frame colors should align with:

- warm gold linework
- muted metallic tones
- cream accents where appropriate

---

# Stroke Rules

Linework should be:

- thin
- elegant
- restrained
- consistent

Use a clear stroke hierarchy:

- outer border slightly stronger
- inner borders lighter
- ornamental detail thinner

Avoid:

- heavy borders
- inconsistent stroke widths
- overly complex linework

---

# Geometry Rules

Prefer:

- rectangles
- diamonds
- stepped corners
- diagonal corner cuts
- parallel lines
- centered ornaments
- symmetrical patterns
- repeated proportions

Avoid:

- organic curves
- random flourishes
- inconsistent spacing
- decorative chaos

The geometry should feel intentional and architectural.

---

# Variants

Frame variants may include:

```txt
product-card
panel
hero
image
separator
small-ornament
```

Each variant should be based on an observed reference pattern.

Do not create variants without a clear use case.

---

# Component API Philosophy

The frame API should be semantic and constrained.

Preferred:

```tsx
<Frame variant="product-card" />
<Frame variant="panel" />
<Frame variant="hero" />
```

Avoid:

```tsx
<Frame cornerStyle="fancy" borderCount={7} randomDiamond goldGlow />
```

The API should preserve design consistency.

---

# Composition Rules

Frames should work as decorative layers around content.

Common usage:

```tsx
<Surface>
  <Frame variant="product-card" />
  <ProductImage />
  <ProductContent />
</Surface>
```

Frames should:

- not affect document semantics
- not trap pointer events
- not break layout
- not obscure content

Use pointer-event-safe styling where appropriate.

---

# CSS Integration

Frame components may rely on DS CSS classes.

Use:

- flat selectors
- CSS variables
- semantic class names

Preferred class naming:

```css
.bp-frame
.bp-frame--product-card
.bp-frame--panel
.bp-frame--hero
```

Avoid selector nesting.

---

# Responsiveness

Frames should preserve proportions across responsive layouts.

Use:

- `viewBox`
- `preserveAspectRatio`
- scalable path coordinates
- container-based sizing

Avoid:

- hardcoded dimensions that break layout
- frame details that collapse on mobile
- overly tiny ornaments at small sizes

If necessary, provide simplified variants for smaller contexts.

---

# Reference Fidelity

The goal is not exact pixel tracing.

The goal is:

- faithful visual extraction
- reusable geometry
- consistent brand language
- maintainable SVG code

Manual simplification is acceptable when it improves:

- readability
- scalability
- responsiveness
- maintainability

But simplification must preserve the observed Art Deco language.

---

# Iteration Workflow

After creating a frame:

1. compare it against the reference image
2. identify visual mismatches
3. refine line weight, spacing, and corner details
4. reduce ornamentation if the frame feels noisy
5. preserve consistency across variants

Prefer small refinements over full rewrites.

---

# Output Expectations

When generating a frame component:

1. describe the reference image used
2. summarize observed frame geometry
3. propose the variant name
4. provide complete React component file
5. provide complete CSS file if needed
6. ensure accessibility
7. ensure SSR safety
8. ensure CSS variable usage

Avoid placeholder SVGs.

---

# Frame Principle

Frames are not generic decoration.

They are part of the Basement Pickups identity system.

Every frame should feel:

- derived from the approved visual references
- geometric
- precise
- premium
- restrained
- reusable
- brand-specific
