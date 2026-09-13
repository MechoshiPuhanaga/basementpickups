# Data Model

This document defines the canonical data structures used by the Basement Pickups application.

The data model is intentionally simple and local-first.

Products are stored as local TypeScript/JSON data and rendered through SSR.

---

Add this to `DATA_MODEL.md` near the top:

```md
# Mock Data Rule

Mock data must be relevant to Basement Pickups.

Do not use:

- lorem ipsum
- generic placeholder product names
- generic blog filler
- unrelated ecommerce content

Mock products should be realistic guitar pickup products.

Mock articles should be relevant to:

- guitar pickups
- tone
- magnets
- winding
- pickup installation
- boutique gear
- workshop process
- product care
- guitar electronics

All mock text should feel aligned with the Basement Pickups brand:

- premium
- handcrafted
- restrained
- musician-focused
- technically credible
```

# Real Catalog Data (2026-06-20)

`src/data/pickups.ts` now holds the **real** Basement Pickups catalog, sourced
from `data/pickups-data.txt` (no more mock pickups):

`white-pearl`, `macho-heaven`, `chow-chow` (each a neck + bridge **set**, with
per-position `variants[]`), and `rockroach`, `karakonjul`, `little-karakonjul`,
`twin-bliss` (single-pickup products, no variants). All are humbuckers.

- Descriptions, magnets, DCR, inductance, and self-/loaded-resonant-peak figures
  are taken verbatim from the source data. `PickupSpecs` was extended with
  `selfResonantPeak` / `loadedResonantPeak` to carry them.
- For **set** parents, `specs.dcr` / `specs.inductance` are shown as ranges
  (e.g. `5.9k–6.8k`); each variant carries its exact figures + resonant peaks.
- **Prices are real** — the developer set real euro prices directly in
  `pickups.ts` (e.g. €125 / €140).
- **Hardware/config is real** (2026-06-24) — string spacing, bobbin colors,
  pole pieces, cover, and 7-string options come verbatim from the source data's
  per-pickup "Configuration" blocks and live on `pickup.hardware`.
- Images point at `/assets/images/product-photos/<slug>.png` (the developer's
  square cinematic product photos). The old per-product placeholder SVGs under
  `public/assets/images/products/` were removed.

---

# Pickup Philosophy

A pickup is the primary domain object.

Variants are also pickups.

This allows:

- simple rendering
- recursive composition
- variant-specific pricing
- variant-specific specs
- variant-specific imagery
- flexible product pages

The UI should render:

- a single pickup normally
- selectable variants when `variants` exist

Variants are not abstract option combinations.

Variants are fully defined pickup objects.

---

# Type Definitions

```ts
export type PickupType = 'humbucker' | 'single' | 'p90';

export type PickupMagnet =
  'alnico-2' | 'alnico-3' | 'alnico-4' | 'alnico-5' | 'alnico-8' | 'ceramic' | 'neodymium';

export type PickupPosition = 'neck' | 'middle' | 'bridge';

export type PickupConductor = 'vintage-braided' | '2-conductor' | '4-conductor';

export type PickupPotting = 'potted' | 'unpotted';

export type PickupSpecs = {
  inductance?: string;
  dcr?: string;
  selfResonantPeak?: string; // e.g. "8.4 kHz"
  loadedResonantPeak?: string; // e.g. "3.9 kHz"
};

export type PickupPolepiece = 'nickel' | 'black' | 'gold';

export type PickupCoverFinish = 'none' | 'nickel' | 'black' | 'gold';

/** A customer-selectable build option. One entry in `options` = fixed (read-only). */
export type Choice<T> = { options: readonly T[]; defaultOption: T };

export type BobbinStyle = 'slug' | 'screw' | 'blade';

export type PickupBobbin = {
  id: string; // neutral, stable key unique within the pickup: 'coil-1' | 'coil-2' | 'coil'
  style: BobbinStyle; // pole-piece style → label + swatch
  palette: string[]; // colours available for THIS bobbin (name tokens)
  defaultColor: string; // must be one of palette
  label?: string; // optional override; else derived from style (+ index when styles repeat)
};

export type PickupHardware = {
  spacingMm?: number | Choice<number>; // fixed (52, 49.2) or a choice (Twin Bliss: 50 or 52)
  bobbinColors: string[]; // name tokens, e.g. 'white' | 'cream' | 'light-blue' (never hex)
  bobbins?: PickupBobbin[]; // configurable coils + per-bobbin palette/default (optional during rollout)
  polepieces: Choice<PickupPolepiece>; // one finish for all coils
  cover?: Choice<PickupCoverFinish>; // usually defaults to 'none'; absent = no cover offered
  sevenString?: { colors: string[] }; // absent = 7-string not offered
};

export type Pickup = {
  id: string;

  slug: string;

  name: string;

  description: string;

  type: PickupType;

  magnet: PickupMagnet;

  price: number;

  positions: PickupPosition[];

  hardware: PickupHardware;

  conductors: Choice<PickupConductor>; // lead wire

  potting: Choice<PickupPotting>;

  specs: PickupSpecs;

  images: {
    main: string;
    gallery?: string[];
  };

  variants?: Pickup[];
};
```

`hardware` carries the physical build/configuration (added 2026-06-24). The
earlier free-form `colors: string[]` field was superseded by it. `hardware` is
also surfaced in the Product JSON-LD as `material` (magnet) +
`additionalProperty` (`getJsonLdForUrl.ts`) and on the product page specs list.

**Bobbin colors are name tokens, never hex.** `bobbinColors` holds tokens like
`cream`, `light-blue`, `black`. The canonical token → human-readable label map
lives in `src/data/bobbinColors.ts` (`bobbinColorLabel`) — the single source so
product specs, JSON-LD, and (later) the enquiry message all read the same names.
The hex values are only an **approximation** for the visual chip and live solely
in `src/design-system/tokens/bobbin-colors.css` (`--bobbin-color-<token>`), read by
the DS `Swatch` and `PickupPreview` atoms via `data-color="<token>"`, because the
strict prod CSP forbids inline `style`. Four places list the token set — keep them
in sync: `bobbinColors.ts`, `STANDARD_BOBBIN_COLORS` in `pickups.ts`,
`bobbin-colors.css`, and the `data-color` rules in the two atoms' CSS modules.

**Per-bobbin customization (2026-06-27).** `hardware.bobbins` lists the physical
coils a customer can colour. The **palette is per bobbin** (availability depends on
spacing / 7-string / future bobbin styles) — `bobbinColors` is kept as the display
union, derived via `availableBobbinColors(hardware)` (`src/data/bobbins.ts`). All
seven models are humbuckers → two coils (slug + screw, except Twin Bliss = two
screw coils). Helpers in `bobbins.ts`: `deriveBobbinLabels`, `availableBobbinColors`.

**Build options as `Choice<T>` (2026-09-13).** Everything a customer can pick is
data on the pickup, never a rule in the UI: `conductors` (wire), `potting`,
`hardware.polepieces`, `hardware.cover`, and `hardware.spacingMm` (a `Choice`
only where more than one spacing is offered). A `Choice` lists the offered
`options` and the `defaultOption`; a single-option choice is a fixed value and
renders read-only. Shared constants in `pickups.ts` (`PAF_POLEPIECES`,
`polepieceChoice(default)`, `wireChoice(default)`, `COVER_OPTIONAL`,
`POTTING_OPTIONAL` / `POTTING_FIXED`) keep the per-pickup entries short. A future
P-90 / single coil simply lists its own options.

Labels for every option token live in `src/data/pickupLabels.ts`
(`conductorLabel`, `polepieceLabel`, `coverLabel`, `pottingLabel`, `spacingLabel`,
`choiceLabel`, `formatCoverOffer`, `formatSpacing`) — the single source for the
product specs, JSON-LD, the configurator, and the enquiry email.

**The customer's build = `PickupConfig`** (`src/data/pickupConfig.ts`):
`{ bobbins?: {[bobbinId]: colour}, conductors?, polepieces?, cover?, potting?,
spacingMm? }`. Everything that reads one goes through `resolveConfig(pickup, config)`,
which validates each value against the offered options and fills defaults, so a
partial or stale config always yields a complete, valid build. Helpers:
`defaultConfig`, `hasConfigChoices` (whether to show Configure at all),
`cartLineKey(slug, config)` (sorted, deterministic line identity — identical builds
aggregate, any differing option is a separate line), `configOptions(pickup, config)`
(human-readable `{label, value}` list for the enquiry summary + email — includes
fixed values so the workshop sees the complete build), and `readStoredConfig`
(migrates the pre-2026-09 flat `{[bobbinId]: colour}` localStorage shape).

The DS `PickupConfigurator` molecule (`pickup` + `value` + `onChange(next)`) drives
both the product-page **Configure** section and each cart line, so both edit a
build the same way. It shows the `PickupPreview` atom — the whole pickup from
above (coils stacked as on the real thing, coloured by the chosen tokens, poles
tinted by the chosen finish) — beside compact coil colour selects, then wire /
pole pieces / cover / potting / spacing rows. Defaults are marked "(default)" in
every select; a note links to `/faq#option-availability`. Bobbin colour hex values
live in `src/design-system/tokens/bobbin-colors.css` (shared by `Swatch` and
`PickupPreview`).

````

---

# Example

```ts
export const blackDog: Pickup = {
  id: 'black-dog',

  slug: 'black-dog',

  name: 'Black Dog',

  description: 'Vintage-output humbucker with warm mids and articulate top end.',

  type: 'humbucker',

  magnet: 'alnico-5',

  price: 149,

  positions: ['neck', 'bridge'],

  colors: ['black', 'nickel', 'zebra'],

  conductors: ['vintage-braided', '2-conductor', '4-conductor'],

  potting: 'optional',

  specs: {
    dcr: '8.4k',
    inductance: '4.8H',
  },

  images: {
    main: '/assets/images/products/black-dog/main.jpg',

    gallery: [
      '/assets/images/products/black-dog/01.jpg',
      '/assets/images/products/black-dog/02.jpg',
    ],
  },

  variants: [
    {
      id: 'black-dog-aged-zebra',

      slug: 'black-dog-aged-zebra',

      name: 'Black Dog Aged Zebra',

      description: 'Aged zebra variant of the Black Dog humbucker.',

      type: 'humbucker',

      magnet: 'alnico-5',

      price: 159,

      positions: ['bridge'],

      colors: ['aged-zebra'],

      conductors: ['4-conductor'],

      potting: 'potted',

      specs: {
        dcr: '8.6k',
        inductance: '4.9H',
      },

      images: {
        main: '/assets/images/products/black-dog-aged-zebra/main.jpg',
      },
    },
  ],
};
```

---

# Data Model Rules

The data model should remain:

- simple
- serializable
- local-first
- SSR-friendly
- strongly typed
- predictable

Avoid:

- over-engineering
- relational complexity
- abstract variant systems
- deeply normalized structures

---

# Rendering Philosophy

Product cards and product pages should render from the same `Pickup` object shape.

The UI should:

- render the base pickup normally
- render selectors only when `variants` exist
- switch rendered pickup data when variants change

This keeps rendering logic simple and compositional.

---

# Variant Philosophy

Variants are real pickups.

A variant may differ in:

- position
- color
- conductor
- potting
- specs
- imagery
- price

Variants should remain explicit rather than computed dynamically.

---

# Image Rules

Images should remain:

- local
- optimized
- deterministic
- SSR-safe

Avoid:

- runtime image discovery
- CMS dependencies
- dynamic imports for product data

---

# Future Expansion

Future additions may include:

- tone tags
- featured flags
- SEO metadata
- article relationships
- sound samples
- installation guides

But the core structure should remain intentionally simple.

# Article Data Model

Articles are editorial content objects rendered through SSR.

The article system should support:

- long-form storytelling
- educational content
- workshop/process articles
- pickup demos
- tone discussions
- installation guides
- artist stories
- brand/editorial content

The structure should remain:

- simple
- readable
- strongly typed
- local-first
- SSR-friendly

---

# Philosophy

Articles are premium editorial experiences.

The article model should support:

- atmospheric layouts
- typography-first composition
- rich imagery
- cinematic storytelling
- flexible sections

The data structure should remain intentionally lightweight.

Avoid:

- CMS-style over-engineering
- deeply nested rich-text systems
- dynamic schema complexity

---

# Type Definitions

```ts
export type ArticleImage = {
  src: string;

  alt: string;

  caption?: string;
};

export type ArticleMetadata = {
  publishedAt: string;

  updatedAt?: string;

  author?: string;
};

export type Article = {
  id: string;

  slug: string;

  headline: string;

  subheadline?: string;

  excerpt: string;

  body: string;

  keywords: string[];

  mainImage: ArticleImage;

  images?: ArticleImage[];

  metadata: ArticleMetadata;
};
```

---

# Example

```ts
export const article: Article = {
  id: 'the-language-of-paf',

  slug: 'the-language-of-paf',

  headline: 'The Language of PAF',

  subheadline: 'Why low-output pickups still define some of the greatest recorded guitar tones.',

  excerpt:
    'Exploring the harmonic texture, compression behavior, and musical dynamics of vintage-output humbuckers.',

  body: `
The late 1950s humbucker was never designed for modern gain structures.

Its character came from imbalance, softness, and dynamic response.

Modern pickups often increase output first.

But musicality frequently lives somewhere else entirely.

The interaction between coil asymmetry, magnet charge, and amplifier compression creates a response that feels vocal rather than aggressive.
`,

  keywords: ['PAF', 'vintage pickups', 'humbucker', 'tone', 'alnico'],

  mainImage: {
    src: '/assets/images/articles/paf-language/main.jpg',

    alt: 'Vintage style humbucker photographed on dark background',

    caption: 'A low-output humbucker with aged nickel cover.',
  },

  images: [
    {
      src: '/assets/images/articles/paf-language/01.jpg',

      alt: 'Pickup winding close-up',

      caption: 'Scatter winding introduces subtle inconsistencies that affect harmonic response.',
    },

    {
      src: '/assets/images/articles/paf-language/02.jpg',

      alt: 'Vintage amplifier in workshop',

      caption: 'Low-output pickups interact differently with early tube amplifier circuits.',
    },
  ],

  metadata: {
    publishedAt: '2026-01-18',

    author: 'Basement Pickups',
  },
};
```

---

# Body Rules

The `body` field intentionally uses plain string content initially.

This keeps:

- SSR simple
- rendering predictable
- content portable
- implementation lightweight

Avoid:

- runtime markdown parsing initially
- complex editor schemas
- WYSIWYG systems
- CMS dependencies

The article renderer may later:

- split paragraphs
- detect headings
- detect pull quotes
- detect separators

But the source content should remain simple.

---

# Image Philosophy

Article imagery is extremely important.

Images should:

- support atmosphere
- reinforce craftsmanship
- preserve cinematic tone
- remain editorial rather than ecommerce-like

Each image may contain:

- accessible alt text
- optional editorial caption

Captions should feel:

- restrained
- literary
- educational

Avoid:

- SEO spam captions
- technical dump captions

---

# Metadata Rules

Metadata should remain minimal initially.

Required:

- publication date

Optional:

- updated date
- author

Avoid:

- excessive taxonomy systems
- CMS-style metadata complexity

---

# SEO Philosophy

Articles should support:

- strong semantic HTML
- SSR rendering
- meaningful metadata
- editorial discoverability

Keywords should remain:

- human-readable
- restrained
- editorially meaningful

Avoid:

- keyword stuffing
- excessive tagging

---

# Future Expansion

Future additions may include:

- related pickups
- related articles
- sound samples
- embedded videos
- quote blocks
- article sections
- markdown processing

But the initial system should remain intentionally simple and maintainable.
````

# Brand Value Data Model

Brand values are the short editorial cards used on the About page (and any future "what we stand for" surface).

The structure should remain:

- simple
- typed
- self-contained (data renders without page-level JSX)

---

## Type Definitions

```ts
export type BrandValueIcon = 'handwound' | 'materials' | 'tone' | 'workshop';

export type BrandValue = {
  id: string;
  icon: BrandValueIcon;
  title: string;
  description: string;
};
```

The `icon` identifier is rendered by the `BrandValueCard` molecule via an internal icon-map. Adding a new icon means:

1. extend the `BrandValueIcon` union
2. add the matching small SVG to the molecule's icon map

This keeps icons inside the design system rather than in `/public/assets/`, since they are small `currentColor` SVGs tied to brand vocabulary, not photographic assets.

---

## Example

```ts
export const handwoundValue: BrandValue = {
  id: 'handwound',
  icon: 'handwound',
  title: 'Handwound In House',
  description:
    'Every coil is wound on the bench in our workshop — no contracted assembly, no shortcuts.',
};
```

---

## Rules

- 3 brand values is the design-reference baseline (About page renders a row of three)
- Title should fit one line at the section-heading variant
- Description should be 1–2 sentences, editorial in tone, not marketing copy

---

# Navigation Data Model

Primary navigation is also a typed data file — it drives the header organism and the `<nav>` in any layout that needs it.

## Type Definitions

```ts
export type NavLink = {
  label: string;
  href: string;
};
```

The reference design shows five primary nav entries: Home, About, Shop, Articles, Contact. Order matches the reference.

---

## Example

```ts
export const primaryNav: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Articles', href: '/articles' },
  { label: 'Contact', href: '/contact' },
];
```

---

## Rules

- entries remain explicit (no auto-derivation from the route table)
- the route a nav entry points to must be a real route in `src/app/routes.tsx`
- the `Articles` entry maps to `/articles` (the articles index route), not to a hash anchor on the home page
