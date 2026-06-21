# Prompt Workflows — Basement Pickups

This document defines the preferred workflow for AI-assisted implementation.

The goal is:

- architectural consistency
- focused implementation
- reduced token waste
- predictable output quality
- maintainable code generation

Claude should act as:

- an implementation accelerator
- a constrained engineering assistant

not as an autonomous architecture owner.

---

# Core Workflow Principle

Architecture decisions are owned by the developer.

Claude should:

- implement constrained decisions
- preserve architectural consistency
- preserve design-system consistency
- avoid introducing unrelated abstractions
- avoid speculative rewrites

The workflow should remain:

- incremental
- reviewable
- predictable

---

# Session Start Workflow

At the beginning of each session:

1. Read:

- `CLAUDE_SESSION_START.md`

2. Read additional relevant docs depending on the task.

Examples:

```txt
design-system work
  -> DESIGN_SYSTEM.md
  -> VISUAL_LANGUAGE.md
  -> IMPLEMENTATION_RULES.md

routing work
  -> ARCHITECTURE.md
  -> ROUTING_AND_SEO.md

form work
  -> ACCESSIBILITY.md
  -> DESIGN_SYSTEM.md
```

Do not assume unrelated files are relevant.

---

# Preferred Session Structure

Sessions should follow this structure:

1. Understand task
2. Identify relevant docs
3. Summarize intended implementation
4. List affected files
5. Wait for approval if architectural
6. Implement incrementally
7. Review consistency

Avoid jumping directly into large code generation.

---

# Preferred Prompt Style

Prompts should remain:

- concise
- explicit
- constrained
- task-focused

Preferred:

```txt
Implement the Button atom.

Read:
- DESIGN_SYSTEM.md
- IMPLEMENTATION_RULES.md
- ACCESSIBILITY.md

Requirements:
- semantic variants
- SSR-safe
- accessible
- vanilla CSS only
- CSS variables only
- no inline styles
```

Avoid:

```txt
build me a cool button component
```

The AI performs better with:

- constraints
- boundaries
- explicit requirements

---

# Implementation Scope Rules

Prefer:

- one concern at a time
- one component at a time
- one feature at a time

Avoid:

- giant multi-feature prompts
- uncontrolled rewrites
- broad regeneration requests

Large prompts increase:

- inconsistency
- architectural drift
- token waste
- hallucinated abstractions

---

# File Proposal Workflow

Before implementation, Claude should:

1. summarize intended changes
2. list affected files
3. explain architectural impact briefly

Preferred:

```txt
Files to create:
- Button.tsx
- Button.css
- Button.types.ts

Files to update:
- index exports
```

This keeps implementation predictable.

---

# Code Generation Rules

When generating code:

- provide complete files unless patches are requested
- preserve existing conventions
- preserve formatting consistency
- preserve strict TypeScript compatibility
- preserve SSR safety

Avoid:

- placeholder code
- pseudo-code
- unexplained architectural changes

---

# Review Workflow

When reviewing existing code:
focus on:

- architecture consistency
- DS ownership boundaries
- accessibility
- SSR safety
- hydration safety
- TypeScript strictness
- CSS consistency
- unnecessary complexity

Avoid:

- subjective rewrites
- unrelated refactors
- style-only churn

---

# Refactor Workflow

Refactors should:

- preserve behavior
- preserve architecture
- reduce complexity
- improve maintainability

Avoid:

- speculative abstraction
- rewriting stable code unnecessarily
- introducing new patterns without approval

---

# Design-System Workflow

When implementing DS components:

1. identify layer:

- token
- atom
- molecule
- organism
- layout

2. preserve ownership boundaries

3. avoid business logic inside DS

4. expose semantic APIs

5. keep styling internal to the DS

The DS should remain:

- composable
- restrained
- predictable

---

# Atom Workflow

Atoms should:

- remain small
- remain reusable
- remain dependency-light
- remain accessible

Atoms should own:

- styling
- semantic rendering
- variants
- accessibility behavior

Atoms should not own:

- business logic
- route logic
- product logic

---

# Molecule Workflow

Molecules combine atoms into reusable patterns.

Molecules may contain:

- composition
- layout
- small interaction logic

Molecules should avoid:

- page ownership
- route ownership
- application state complexity

---

# Page Workflow

Pages should:

- compose DS components
- define structure
- define content flow
- remain visually consistent

Pages should not:

- create ad hoc styling systems
- duplicate DS behavior
- bypass DS primitives unnecessarily

---

# CSS Workflow

All styling belongs in the DS layer.

CSS should:

- remain flat
- remain readable
- remain explicit
- use CSS variables

Avoid:

- selector nesting
- utility-class styling
- inline styles
- styling shortcuts

---

# Dependency Workflow

Before adding dependencies:

- justify the dependency
- confirm platform-native alternatives
- confirm React-native alternatives
- avoid unnecessary abstraction layers

Dependencies should remain minimal.

---

# Performance Workflow

When implementing features:

- preserve SSR performance
- preserve hydration safety
- avoid unnecessary client work
- avoid oversized dependencies

Prefer:

- route-level code splitting
- stable rendering
- predictable bundle boundaries

---

# Accessibility Workflow

Accessibility must be included during implementation.

Do not postpone accessibility.

All interactive UI should support:

- keyboard usage
- focus visibility
- semantic HTML
- readable contrast

Accessibility is part of the implementation definition of done.

---

# SEO Workflow

SEO should:

- remain server-driven
- remain route-aware
- support product/article metadata
- avoid client-only metadata generation

SEO should be considered during route implementation.

---

# Session Size Philosophy

Prefer:

- short focused sessions
- constrained implementation
- incremental review

Avoid:

- massive persistent contexts
- giant all-day sessions
- uncontrolled context growth

Smaller focused sessions produce:

- better consistency
- lower token usage
- more stable architecture

---

# Token Efficiency Philosophy

Use:

- concise prompts
- focused scope
- explicit constraints
- relevant AI docs only

Avoid:

- repeatedly re-explaining architecture
- pasting unrelated code
- regenerating stable implementations

The markdown AI docs are the primary architectural memory system.

---

# Architectural Consistency Principle

The primary goal of the workflow is:

- consistency
- maintainability
- clarity
- architectural stability

Claude should reinforce the established system rather than invent new systems during implementation.
