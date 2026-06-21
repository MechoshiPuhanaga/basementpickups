# Accessibility — Basement Pickups

Accessibility is a required architectural constraint.

Accessibility should be built into:

- design tokens
- DS atoms
- interaction patterns
- layouts
- forms
- navigation
- motion systems

Accessibility is not optional enhancement work.

All generated UI must remain:

- keyboard accessible
- screen-reader compatible
- semantically correct
- contrast-aware
- SSR-safe

---

# Accessibility Philosophy

The UX should feel:

- elegant
- calm
- predictable
- readable
- usable

Accessibility should integrate naturally into the premium visual language.

Accessible UX should not feel:

- bolted on
- visually disruptive
- inconsistent with the design system

The goal is:

- inclusive premium design

---

# Semantic HTML

Prefer semantic HTML whenever possible.

Use:

- `button`
- `nav`
- `header`
- `main`
- `section`
- `article`
- `footer`
- `label`
- `input`
- `textarea`
- `select`
- `ul`
- `ol`
- `li`

Avoid:

- clickable `div`
- clickable `span`
- fake semantic roles when native HTML exists

Native semantics are preferred over ARIA whenever practical.

---

# Keyboard Accessibility

All interactive elements must support keyboard usage.

Users must be able to:

- navigate using Tab
- activate controls using keyboard
- understand focus position
- use forms without a mouse

Keyboard interaction must remain:

- predictable
- visible
- stable

Avoid:

- hidden focus states
- keyboard traps
- inaccessible custom controls

---

# Focus Management

Focus styling is required.

Focus states should:

- remain visible
- fit the premium visual language
- maintain sufficient contrast
- feel elegant and restrained

Do not remove outlines without providing accessible replacements.

Focus styles should feel:

- intentional
- geometric
- visually integrated

---

# Focus Order

Focus order must:

- follow visual flow
- remain logical
- remain predictable

Avoid:

- random tab ordering
- hidden focus jumps
- DOM structures that break reading order

---

# Contrast Rules

Text and UI elements must maintain accessible contrast.

This is especially important because the visual system uses:

- dark backgrounds
- gold accents
- subtle tonal variation

Contrast should prioritize:

- readability
- usability
- visual clarity

Avoid:

- low-contrast decorative text
- difficult-to-read muted typography
- visually ambiguous controls

Accessibility takes priority over aesthetic subtlety.

---

# Typography Accessibility

Typography should remain:

- readable
- spacious
- stable

Avoid:

- extremely thin body text
- cramped line height
- overly decorative reading experiences
- excessively long line lengths

Editorial content should prioritize reading comfort.

---

# Heading Hierarchy

Pages should maintain semantic heading structure.

Preferred hierarchy:

```txt
h1 -> h2 -> h3 -> h4
```

Avoid:

- skipped heading levels
- decorative heading misuse
- multiple unrelated h1 elements

Heading structure should support:

- readability
- screen readers
- SEO structure

---

# Forms

All forms must:

- use proper labels
- expose validation states accessibly
- support keyboard navigation
- expose required fields clearly

Inputs should:

- remain readable
- maintain accessible focus states
- support error messaging

Avoid:

- placeholder-only labeling
- inaccessible custom form controls
- hidden validation messaging

---

# Error Messaging

Errors should:

- be readable
- be associated with relevant controls
- avoid ambiguity
- avoid inaccessible color-only communication

Error states should support:

- screen readers
- keyboard users
- reduced-vision users

---

# Buttons and Links

Buttons should:

- use `button`
- expose disabled state properly
- support keyboard activation

Links should:

- use `a`
- remain distinguishable
- communicate navigation intent clearly

Avoid:

- button-styled links used incorrectly
- div-based interactions
- ambiguous clickable regions

---

# Motion Accessibility

The visual system uses restrained motion.

All motion should support:

- reduced-motion preferences
- accessibility settings
- comfortable interaction pacing

Support:

```css
prefers-reduced-motion
```

Avoid:

- excessive animation
- motion-heavy transitions
- distracting effects
- forced animated experiences

Animation should never reduce usability.

---

# SVG Accessibility

SVGs used decoratively should:

- avoid unnecessary accessibility noise
- use appropriate hiding when decorative

Meaningful SVGs should:

- expose accessible labels where appropriate

Decorative frame systems should not pollute screen-reader output.

---

# Image Accessibility

Content images should use meaningful alt text.

Decorative images should avoid redundant announcements.

Product imagery should:

- communicate product identity
- support understanding
- avoid keyword stuffing

Alt text should remain:

- concise
- useful
- human-readable

---

# Navigation Accessibility

Navigation should:

- support keyboard navigation
- expose current-page state
- remain structurally clear

Menus should:

- remain accessible without hover-only interaction
- support focus visibility
- avoid inaccessible animation behavior

---

# Responsive Accessibility

Responsive layouts should:

- preserve readability
- preserve spacing
- preserve interaction clarity

Avoid:

- touch targets that are too small
- cramped mobile layouts
- inaccessible mobile navigation

Touch interactions should remain comfortable.

---

# Screen Reader Philosophy

The application should:

- expose meaningful structure
- avoid noisy accessibility output
- preserve semantic clarity

Avoid:

- unnecessary ARIA usage
- duplicated announcements
- accessibility overengineering

Use native semantics first.

---

# Accessibility and the Design System

Accessibility must be built into:

- atoms
- molecules
- layouts
- primitives

Pages should inherit accessibility behavior naturally from the DS.

Accessibility should not rely on page-level fixes.

---

# SSR Accessibility

Accessibility must remain compatible with:

- SSR rendering
- hydration
- route-level code splitting

Avoid:

- hydration-induced focus bugs
- inaccessible loading transitions
- browser-only accessibility assumptions

---

# Accessibility Testing Philosophy

Accessibility should be considered during implementation, not after completion.

Components should be reviewed for:

- semantic correctness
- keyboard support
- focus visibility
- screen-reader compatibility
- contrast
- responsive usability

---

# Accessibility Principle

Accessibility is part of quality.

The goal is:

- premium presentation
- elegant UX
- inclusive usability
- maintainable semantics

Accessibility should strengthen the experience, not compete with it.
