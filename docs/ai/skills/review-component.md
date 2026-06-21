# Skill — Review Component

This skill defines the rules for reviewing existing components.

The goal of review is:

- architectural consistency
- maintainability
- accessibility
- SSR safety
- visual-system consistency
- code quality

Reviews should remain:

- objective
- actionable
- structured
- implementation-focused

Avoid vague stylistic commentary.

---

# Review Philosophy

Review for:

- clarity
- consistency
- maintainability
- semantic correctness
- DS boundaries
- predictable behavior

Avoid:

- unnecessary rewrites
- subjective preference churn
- speculative abstraction
- architecture drift

The goal is to strengthen the established system.

---

# Review Workflow

When reviewing a component:

1. identify component layer

- token
- atom
- molecule
- organism
- layout
- page

2. identify ownership boundaries

3. review:

- semantics
- accessibility
- SSR safety
- hydration safety
- prop quality
- CSS consistency
- DS consistency
- complexity
- responsiveness

4. summarize findings clearly

Reviews should remain focused and structured.

---

# Architectural Boundary Review

Check:

- does the component belong in the correct DS layer?
- does it violate ownership boundaries?
- is business logic leaking into DS?
- is styling leaking into pages?
- is composition responsibility correct?

Common problems:

- atoms containing business logic
- pages creating visual systems
- molecules owning route logic
- duplicated layout structures

Preserve architectural clarity.

---

# API Review

Review component APIs for:

- semantic naming
- predictability
- constrained variants
- composability
- readability

Preferred APIs:

```tsx
<Button variant="primary" size="large" />
```

Review against:

- prop explosion
- arbitrary customization
- styling escape hatches
- overlapping responsibilities

Avoid APIs that encourage inconsistency.

---

# Prop Review

Check:

- are props typed correctly?
- are prop names semantic?
- are optional props justified?
- are defaults predictable?
- is the API too configurable?

Avoid:

- excessive boolean props
- generic visual override props
- hidden behavior

Props should guide consistent usage.

---

# Accessibility Review

Review:

- semantic HTML
- keyboard support
- focus visibility
- contrast
- heading hierarchy
- label associations
- ARIA usage
- screen-reader behavior

Check for:

- clickable divs
- inaccessible custom controls
- missing labels
- hidden focus states
- semantic misuse

Accessibility is required.

---

# SSR Review

Review:

- SSR compatibility
- hydration safety
- deterministic rendering
- browser API usage

Check for:

- direct window/document access during render
- random values in render
- time-dependent rendering
- hydration mismatch risk

Components must remain SSR-safe.

---

# Hydration Safety Review

Check:

- deterministic output
- stable render structure
- stable IDs where needed
- consistent initial render state

Avoid:

- render-time randomness
- client-only assumptions
- unstable conditional rendering

Hydration stability is critical.

---

# CSS Review

Review CSS for:

- flat selectors
- semantic naming
- CSS variable usage
- maintainability
- visual consistency

Check for:

- selector nesting
- utility-style leakage
- arbitrary spacing values
- hardcoded colors
- inconsistent naming

Preferred naming:

```css
.bp-product-card
.bp-product-card__title
.bp-product-card--featured
```

CSS should remain:

- readable
- explicit
- predictable

---

# CSS Variable Review

Check:

- are semantic tokens used?
- are visual values centralized?
- are arbitrary values avoided where practical?

Preferred:

```css
color: var(--color-text-primary);
```

Avoid:

```css
color: #f5d48f;
```

Token consistency is important.

---

# Typography Review

Review:

- semantic typography usage
- hierarchy consistency
- spacing rhythm
- readability

Check for:

- ad hoc typography
- inconsistent heading scales
- cramped spacing
- decorative overuse

Typography is part of the brand identity.

---

# Responsive Review

Review:

- responsive stability
- layout integrity
- spacing consistency
- mobile readability

Check for:

- unstable layouts
- cramped mobile spacing
- unnecessary breakpoint complexity

Responsive behavior should remain:

- elegant
- restrained
- maintainable

---

# Animation Review

Review:

- motion restraint
- performance
- consistency
- reduced-motion support

Check for:

- excessive animation
- distracting motion
- layout-thrashing animation
- unnecessary animation complexity

Motion should support polish, not dominate attention.

---

# Composition Review

Review:

- component composition quality
- unnecessary nesting
- duplicated structures
- DS primitive usage

Check whether:

- existing atoms/layouts should be reused
- composition can be simplified
- hierarchy is readable

Composition should remain:

- explicit
- understandable
- maintainable

---

# Dependency Review

Review:

- dependency weight
- unnecessary libraries
- dependency direction
- coupling

Check for:

- circular dependencies
- DS layers depending on pages
- hidden runtime coupling
- unnecessary abstraction libraries

Dependencies should remain minimal.

---

# Performance Review

Review:

- render stability
- unnecessary rerenders
- oversized dependencies
- code-splitting boundaries
- SSR performance

Avoid premature optimization unless:

- measurable
- justified
- maintainable

Favor clarity over micro-optimization.

---

# SEO Review

For route/page components review:

- metadata support
- semantic structure
- heading hierarchy
- route-aware SEO handling

Ensure:

- SEO remains SSR-generated
- metadata remains predictable
- route structure remains clean

---

# Visual-System Review

Review whether the component matches:

- visual language
- spacing philosophy
- typography rhythm
- framing system
- interaction philosophy

Check for:

- generic SaaS aesthetics
- visual drift
- inconsistent spacing
- over-decoration
- noisy interactions

The visual language should remain cohesive.

---

# Error Handling Review

Review:

- fallback states
- empty states
- defensive rendering
- runtime assumptions

Check for:

- unsafe assumptions
- hidden failures
- inaccessible error states

Error handling should remain predictable.

---

# Review Output Structure

Preferred review structure:

```txt
Summary
Strengths
Issues
Architectural Concerns
Accessibility Concerns
SSR/Hydration Concerns
Suggested Improvements
```

Feedback should remain:

- concise
- actionable
- implementation-oriented

---

# Refactor Review Rules

Before recommending refactors:

- confirm the issue is meaningful
- confirm maintainability improves
- confirm consistency improves

Avoid:

- speculative rewrites
- style-only churn
- unnecessary abstraction

Stable code should not be rewritten casually.

---

# Design-System Consistency Review

Check:

- does the component reinforce DS philosophy?
- does it preserve compositional discipline?
- does it preserve semantic APIs?
- does it preserve token usage?

The DS should remain:

- cohesive
- disciplined
- recognizable

---

# Review Principle

Reviews exist to preserve:

- architectural integrity
- maintainability
- accessibility
- visual consistency
- SSR safety
- design-system discipline

Reviews should strengthen the established system rather than reinvent it.
