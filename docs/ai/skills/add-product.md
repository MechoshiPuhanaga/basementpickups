# Skill — Add Product

Use this when the developer says something like **"add new products"**, "I added
a product", "new pickup", or "update the catalog".

It is an implementation contract: a reconcile-then-act flow with **ask gates** so
nothing is invented or overwritten silently.

The golden rule: **detect, then ask before doing anything ambiguous.** Adding a
brand-new product from complete inputs is the only thing done without asking.

---

# Where things live

| Thing                                       | Location                                         |
| ------------------------------------------- | ------------------------------------------------ |
| Source specs + copy                         | `data/pickups-data.txt` (free-form, per product) |
| Typed catalog (source of truth for the app) | `src/data/pickups.ts` (`Pickup[]`)               |
| Product photo (square PNG, 1 per product)   | `public/assets/images/product-photos/<slug>.png` |
| Generated image derivatives                 | run the optimizer (see below) — never by hand    |

`Pickup` shape, helpers (`getPickupBySlug`, `getPickupAndParent`), and the
`PHOTO(slug)` path helper are all in `src/data/pickups.ts`. Sets use nested
`variants[]` (neck/bridge, each with exact specs); the parent carries ranges.

---

# The flow

When asked to add products, do this in order:

### 1. Read the current state

- `data/pickups-data.txt` (the source)
- `src/data/pickups.ts` (existing catalog: slugs, descriptions, specs)
- `public/assets/images/product-photos/*.png` (existing source photos, ignore
  `-480/-768/-1200/-1600/.avif/.webp/-og.jpg` derivatives)

### 2. Diff and classify each product

- **New product** — a photo and/or a source entry exists with no matching
  `Pickup` in `pickups.ts`.
- **Changed description** — source description differs from the one in
  `pickups.ts`.
- **Changed image** — the `.png` is newer than its generated derivatives.
- **Nothing new or changed** — everything reconciles.

### 3. Apply the ask gates

- **Nothing new or changed found → ASK.** Don't guess. Say what you checked and
  ask what they added or want changed.
- **Description changed → ASK** before updating `pickups.ts` (show old vs new).
- **Image changed → ASK** before regenerating (confirm it's an intended replace).
- **Partial data missing → ASK** for the missing fields (see next section).
- **New product with everything present → just add it** (no ask needed), then
  report what you did.

### 4. Do the work (for confirmed additions/changes)

1. Add or edit the `Pickup` in `src/data/pickups.ts` (see mapping below).
2. Make sure the photo is at `public/assets/images/product-photos/<slug>.png`.
3. Run `pnpm run optimize:images` (generates AVIF/WebP + the OG JPEG; idempotent).
4. Verify: `pnpm run typecheck && pnpm run lint && pnpm run build`. Confirm the
   new route resolves (`/products/<slug>`) and SEO/`og:image` are correct.
5. Report; **leave the commit/push to the developer** (see memory `feedback-user-owns-commits`).

---

# Mapping source → `Pickup` (what's derivable vs what to ASK)

**Derivable from `data/pickups-data.txt`:**

- `name` (the heading), `slug`/`id` (kebab-case of the name)
- `type` (humbucker / single / p90 — from the heading, e.g. "PAF SET" → humbucker)
- `specs`: `dcr`, `inductance`, `selfResonantPeak`, `loadedResonantPeak`
  (per position). A **set** → parent specs as ranges (`5.9k–6.8k`), each
  `variant` exact. A **single pickup** → exact specs, no `variants`.
- `magnet` (from the bullet, e.g. "Alnico 4" → `alnico-4`). Set with differing
  neck/bridge magnets → parent `magnet` is the bridge's (or note both).
- `variants[]`: present when the source lists Neck **and** Bridge sections.
- `description`: the parent gets a **short editorial summary** (1–2 sentences,
  brand voice); each variant gets the longer per-position description from the
  source.

**NOT in the source — ASK the developer (don't invent):**

- `price` (euros)
- `colors` (e.g. `['cream', 'nickel', 'aged-nickel']`)
- `conductors` (`vintage-braided` / `2-conductor` / `4-conductor`)
- `potting` (`potted` / `unpotted` / `optional`)
- `positions` when it isn't obvious (single pickups may offer neck and/or bridge)

If these are missing, list exactly what you need and ask in one go.

---

# Rules

- **Never invent** price, colors, conductors, or potting — ask.
- **Never overwrite** an existing description or image without confirming.
- Keep the parent description short/editorial; put the verbatim long copy on the
  variants. No lorem ipsum — copy must be pickup-relevant.
- Photos are square PNGs named exactly `<slug>.png`. After adding/replacing one,
  always run `pnpm run optimize:images` so derivatives + OG image exist (see
  `skills/optimize-images.md`).
- `id` and `slug` match the kebab-case name; variant slugs are `<slug>-neck` /
  `<slug>-bridge` etc. (they must resolve through `getPickupBySlug`).
- Don't commit or push — report and let the developer do it.
- If a product has no photo yet, add the data but flag that the image is missing
  (the page/card will look broken until the PNG is added and the optimizer run).

---

# Quick checklist

```txt
[ ] read source txt + pickups.ts + product-photos
[ ] classify: new / changed-desc / changed-image / nothing
[ ] ask gates honored (nothing-found / desc / image / missing-fields)
[ ] Pickup added/edited in pickups.ts (specs, variants, PHOTO(slug))
[ ] price/colors/conductors/potting confirmed with developer
[ ] photo present at product-photos/<slug>.png
[ ] pnpm run optimize:images
[ ] typecheck + lint + build green; /products/<slug> resolves
[ ] reported; commit left to developer
```
