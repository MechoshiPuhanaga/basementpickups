# Skill — Create Molecule

This skill defines the rules for implementing a design-system molecule.

Molecules combine atoms into reusable UI patterns.

Molecules should:

- compose atoms cleanly
- reinforce the visual language
- remain reusable
- remain predictable
- avoid business ownership

Molecules are compositional UI patterns, not pages.

---

# Molecule Responsibilities

Molecules may own:

- atom composition
- layout structure
- local interaction behavior
- small UI state
- spacing relationships
- reusable presentation patterns

Molecules should not own:

- route logic
- application architecture
- global state
- page ownership
- unrelated business logic

Molecules are reusable composition units.

---

# Molecule Structure

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

Structure should remain predictable.

---

# Molecule Workflow

Before implementation:

1. identify composition purpose
2. identify participating atoms
3. identify accessibility requirements
4. identify responsive behavior
5. identify reusable boundaries

Molecules should solve:

- recurring UI structure
- recurring presentation patterns
- recurring interaction grouping

Avoid creating molecules for:

- one-off page layouts
- isolated temporary UI
- overly generic abstractions

---

# Molecule API Philosophy

Molecule APIs should remain:

- semantic
- constrained
- readable
- compositional

Preferred:

```tsx
<ProductCard product={product} variant="featured" />
```

Avoid:

```tsx
<ProductCard titleColor="gold" imageShadow customSpacing rounded cardMode />
```

Visual consistency should come from the DS, not ad hoc customization.

---

# Composition Rules

Molecules should primarily compose:

- atoms
- tokens
- local styling

Molecules may compose other small molecules carefully when appropriate.

Avoid:

- deep composition nesting
- dependency-heavy structures
- hidden layout ownership

Composition should remain understandable.

---

# Layout Ownership

Molecules may own:

- local spacing
- local alignment
- internal structure
- content grouping

Molecules should not own:

- page-level spacing systems
- route-level composition
- global layout rules

Layouts remain the responsibility of:

- organisms
- layouts
- pages

---

# Styling Rules

Molecules own their internal styling.

Use:

- vanilla CSS
- CSS variables
- flat selectors
- semantic class names

Avoid:

- nested selectors
- utility-class styling
- page-specific styling logic
- visual overrides leaking from pages

Preferred naming:

```css
.bp-product-card
.bp-product-card__image
.bp-product-card__title
.bp-product-card--featured
```

Selectors should remain:

- readable
- explicit
- maintainable

---

# Accessibility Rules

Molecules must preserve accessibility.

Molecules should:

- maintain semantic structure
- preserve keyboard accessibility
- preserve focus visibility
- expose readable hierarchy

Examples:

```txt
ProductCard
- accessible links
- readable headings
- semantic image usage

ContactForm
- labels
- validation structure
- keyboard navigation
```

Accessibility should emerge naturally from composition.

---

# Typography Rules

Typography should come from:

- DS typography atoms
- semantic variants
- tokenized typography rules

Avoid:

- random typography overrides
- ad hoc font usage
- visual inconsistency

Typography rhythm is part of the brand system.

---

# Responsive Rules

Molecules should remain:

- responsive
- stable
- visually balanced

Responsive behavior should prioritize:

- readability
- spacing
- hierarchy
- compositional integrity

Avoid:

- breakpoint overload
- unstable layout shifts
- complex responsive logic

---

# Interaction Rules

Molecule interactions should remain:

- subtle
- purposeful
- predictable

Preferred interactions:

- hover emphasis
- focus transitions
- restrained reveals
- subtle motion

Avoid:

- excessive animation
- interaction-heavy cards
- distracting transitions

The UI should feel:

- calm
- elegant
- premium

---

# State Rules

Molecules may own:

- local UI state
- temporary interaction state
- presentational state

Examples:

```txt
hover
expanded
selected
focused
loading
```

Molecules should not own:

- application state
- routing state
- server state
- global business state

---

# Data Rules

Molecules may receive:

- typed product data
- typed article data
- typed UI props

Molecules should not:

- fetch data
- own API logic
- own route resolution
- mutate global state

Data should remain external and explicit.

---

# ProductCard Philosophy

Product cards are critical to the brand experience.

They should feel:

- luxurious
- framed
- cinematic
- handcrafted
- restrained

Product cards should emphasize:

- photography
- typography
- framing
- spacing
- materials
- presentation quality

Avoid:

- crowded ecommerce cards
- excessive metadata
- marketplace-style density

---

# ArticleCard Philosophy

Article cards should feel:

- editorial
- atmospheric
- premium
- typography-driven

They should support:

- reading hierarchy
- imagery
- elegant spacing
- restrained metadata

Avoid:

- blog-template aesthetics
- noisy content previews

---

# ContactForm Philosophy

Forms should feel:

- elegant
- spacious
- calm
- premium

Avoid:

- overly technical form styling
- cramped field spacing
- aggressive validation UX

Form interaction should remain:

- readable
- predictable
- accessible

---

# SVG Frame Integration

Molecules may use:

- decorative frame atoms
- SVG border systems
- ornamental separators

Frames should support:

- hierarchy
- composition
- presentation quality

Avoid decorative overload.

---

# Animation Philosophy

Motion should remain:

- restrained
- smooth
- subtle

Preferred:

- opacity transitions
- slight transforms
- soft emphasis

Avoid:

- flashy motion
- exaggerated hover effects
- attention-seeking animation

---

# SSR Rules

Molecules must remain SSR-safe.

Avoid:

- browser-only assumptions during render
- hydration mismatches
- random initial state

Rendering should remain deterministic.

---

# Dependency Rules

Molecules should remain dependency-light.

Prefer:

- atom composition
- local styling
- explicit props

Avoid:

- unnecessary external libraries
- hidden runtime coupling
- router ownership
- application-service ownership

---

# Output Expectations

When generating a molecule:

1. provide complete files
2. preserve DS conventions
3. preserve accessibility
4. preserve responsive behavior
5. preserve SSR compatibility
6. preserve visual-system consistency

Avoid placeholder implementations.

---

# Molecule Principle

Molecules are reusable visual and interaction patterns.

They should:

- reinforce the design system
- improve compositional consistency
- preserve accessibility
- preserve architectural clarity
- express the brand visually

Molecules should feel:

- elegant
- reusable
- structured
- premium
- disciplined
