# Skill — Create Atom

This skill defines the rules for implementing a design-system atom.

Atoms are foundational UI primitives.

Atoms must remain:

- reusable
- accessible
- composable
- predictable
- dependency-light
- visually consistent

Atoms are not business components.

---

# Atom Responsibilities

Atoms may own:

- semantic rendering
- styling
- variants
- accessibility behavior
- interaction states
- responsive behavior
- visual consistency

Atoms should not own:

- business logic
- route logic
- product logic
- page logic
- application state complexity

Atoms are primitives.

---

# Atom Structure

Preferred structure:

```txt
ComponentName/
  ComponentName.tsx
  ComponentName.css
  ComponentName.types.ts
```

Optional later additions:

```txt
ComponentName.test.tsx
ComponentName.stories.tsx
```

Keep structure predictable.

---

# Atom Implementation Workflow

Before implementation:

1. identify semantic purpose
2. identify DS layer responsibility
3. identify accessibility requirements
4. identify visual variants
5. identify responsive behavior

Do not begin implementation without understanding:

- semantic intent
- accessibility expectations
- variant boundaries

---

# Atom API Philosophy

Atom APIs should be:

- semantic
- explicit
- constrained
- predictable

Preferred:

```tsx
<Button variant="primary" size="large" />
```

Avoid:

```tsx
<Button color="gold" border="double" rounded glow customSpacing />
```

The API should guide consistency.

---

# Variant Philosophy

Variants should represent:

- semantic intent
- visual hierarchy
- interaction role

Avoid:

- arbitrary visual combinations
- uncontrolled styling permutations
- overlapping variant responsibilities

Variants should remain:

- understandable
- limited
- maintainable

---

# Styling Rules

Atoms own their styling.

Use:

- vanilla CSS
- CSS variables
- flat selectors
- semantic class names

Do not use:

- selector nesting
- utility-class styling
- inline styles except for dynamic CSS variables
- CSS-in-JS

Preferred class naming:

```css
.bp-button
.bp-button--primary
.bp-button--large
```

Keep selectors readable and predictable.

---

# CSS Variable Usage

Use CSS variables for:

- colors
- spacing
- typography
- shadows
- borders
- transitions

Avoid hardcoded visual values where practical.

Preferred:

```css
color: var(--color-text-primary);
padding: var(--space-button-md);
```

Avoid:

```css
color: #f5e7c4;
padding: 13px;
```

---

# Semantic HTML Rules

Prefer native semantic HTML.

Examples:

```txt
Button -> button
Link -> a
Input -> input
Textarea -> textarea
Select -> select
```

Avoid:

- clickable divs
- fake semantic controls
- unnecessary ARIA when native semantics exist

Native semantics are preferred.

---

# Accessibility Rules

Atoms must:

- support keyboard interaction
- expose focus states
- maintain accessible contrast
- support semantic structure
- support screen readers where appropriate

Accessibility is required by default.

Do not defer accessibility.

---

# Focus Rules

Interactive atoms must expose visible focus states.

Focus states should:

- remain visible
- fit the visual language
- preserve accessibility

Do not remove outlines without accessible replacement styling.

---

# TypeScript Rules

Atoms must:

- use strict typing
- avoid `any`
- expose explicit prop types
- remain readable

Prefer:

- simple prop contracts
- discriminated variants where useful
- maintainable types

Avoid:

- overly generic abstractions
- excessive type-level complexity

---

# Composition Rules

Atoms should compose cleanly with:

- molecules
- organisms
- layouts

Atoms should avoid assumptions about:

- page structure
- business context
- layout ownership

Atoms should remain portable.

---

# Dependency Rules

Atoms should remain dependency-light.

Avoid:

- business dependencies
- router dependencies
- page dependencies
- application-state dependencies

Atoms should primarily depend on:

- React
- local types
- tokens
- local CSS

---

# Animation Rules

Animation should remain:

- subtle
- restrained
- performant

Prefer:

- opacity
- transform
- transition-based motion

Avoid:

- excessive animation
- layout-thrashing effects
- decorative motion overload

---

# Responsive Rules

Atoms should support responsive behavior where appropriate.

Responsive behavior should remain:

- predictable
- stable
- minimal

Avoid:

- atom-level responsive complexity explosion

---

# SSR Rules

Atoms must remain SSR-safe.

Avoid:

- browser-only assumptions during render
- hydration mismatches
- non-deterministic rendering

Atoms should render consistently on:

- server
- client

---

# Example Atom Responsibilities

Examples:

```txt
Button
- variants
- sizing
- focus states
- disabled states
- semantic button rendering

Text
- typography variants
- semantic text rendering

Input
- form styling
- focus handling
- accessibility states

Frame
- decorative SVG framing
- visual containment
```

Atoms should remain focused.

---

# Output Expectations

When generating an atom:

1. provide complete files
2. include typings
3. include CSS
4. preserve DS conventions
5. preserve accessibility
6. preserve SSR safety

Avoid placeholder implementations.

---

# Atom Principle

Atoms are the foundation of the design system.

They should:

- establish consistency
- preserve visual language
- reinforce accessibility
- simplify composition
- reduce implementation drift

Atoms should feel:

- disciplined
- elegant
- predictable
- reusable
