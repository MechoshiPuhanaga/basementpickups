# Skill — Optimize Images

This skill defines the workflow for adding and optimizing raster images.

It is an implementation contract. Follow it every time a new photo is added or
an existing one is replaced.

The goal is consistent, automatic, lossy-but-premium image delivery:

- modern formats (AVIF, then WebP) with the original as fallback
- responsive widths (so a small card never downloads a full-resolution photo)
- a small 1200x630 JPEG per photo for link previews (Open Graph)
- originals always kept, untouched
- zero runtime image processing (everything is generated ahead of time)

---

# Ownership

- **`scripts/optimize-images.mjs`** generates the derivatives and the manifest.
- **`src/assets/imageManifest.ts`** is GENERATED — never hand-edit it.
- **`src/assets/imageManifest.types.ts`** is the hand-written manifest type.
- **`src/design-system/atoms/Image`** is the only component that renders photos.
  Pages/molecules compose `Image`; they never write raw `<img>` for photos.

Decorative SVGs (logos, placeholder article art) are not optimized — `Image`
renders them as a plain `<img>` passthrough, so it is safe to use everywhere.

---

# When to run

Run the workflow whenever you:

- add a new raster photo (`.png` / `.jpg` / `.jpeg`)
- replace/re-export an existing photo
- change the width ladder or encoder settings in the script

Command:

```sh
pnpm run optimize:images
```

The run is **idempotent** — a derivative is only re-encoded when it is missing
or older than its source, so adding one photo only processes that photo.

---

# Adding a new image — steps

1. Place the original in a tracked source directory:
   - `public/assets/images/product-photos/`
   - `public/assets/images/spirit-photos/`

   (To add a new source directory, append it to `SOURCE_DIRS` in the script.)

2. Run `pnpm run optimize:images`.
   This writes `<name>-<width>.avif` and `<name>-<width>.webp` next to the
   original and regenerates `src/assets/imageManifest.ts`.

3. Reference the **original** path through the `Image` atom (or a molecule that
   composes it — `ProductCard`, `ArticleCard`, `ProductGallery`, `FramedImage`,
   `Hero`). The atom looks the original up in the manifest and emits the
   `<picture>` automatically:

   ```tsx
   <Image
     src="/assets/images/spirit-photos/bp-spirit-1.png"
     alt="…"
     sizes="(max-width: 768px) 90vw, 45vw"
     priority // only for the above-the-fold / LCP image
   />
   ```

4. Commit the originals, the generated `.avif`/`.webp`/`-og.jpg` files, and the
   updated `imageManifest.ts` together.

---

# Open Graph (link-preview) image

When someone pastes a page link into WhatsApp/Twitter/Facebook/Slack/iMessage,
the preview photo comes from the `og:image` meta tag — **not** the on-page
`<picture>`. Scrapers differ from browsers in three ways that drive the design:

- they read only JPEG/PNG (not AVIF/WebP),
- they ignore `srcset`/`<picture>` (no responsive picking) and use one URL,
- they cap file size (WhatsApp ~300 KB) and prefer a wide 1200x630 (1.91:1).

So the optimizer also emits one **`<name>-og.jpg`** (1200x630, ~30–100 KB) per
source photo:

- **wide photos** (ratio ≥ 1.7, e.g. spirit/hero) are scaled to cover the frame,
- **square photos** (products) are centered on the brand charcoal so nothing is
  cropped.

The SEO layer references it **by convention** — `src/seo/getSeoForUrl.ts`
`toOgImage()` maps `…/name.png` → `…/name-og.jpg`. Non-raster sources (article
placeholder SVGs) fall back to the site default OG image. `server/seo.ts` emits
`og:image` + `og:image:secure_url`/`:type`/`:width`/`:height` (dims are constant
1200x630). Do **not** point `og:image` at an AVIF/WebP derivative or the heavy
original — scrapers can't read the former and drop the latter for size.

---

# The `sizes` attribute

`sizes` tells the browser the rendered width so it picks the right derivative.
Set it to match the slot's layout role. Current conventions:

```txt
ProductCard / ArticleCard (3-up grid)   (max-width: 768px) 90vw, 33vw
ProductGallery main                      (max-width: 900px) 90vw, 50vw
ProductGallery thumb                     72px
Hero image                               (max-width: 768px) 90vw, 45vw
FramedImage (default)                    (max-width: 768px) 90vw, 600px
ArticlePage hero                         (max-width: 768px) 90vw, 720px
```

Use `priority` only for the one image likely to be the Largest Contentful
Paint on a route (home hero, product gallery main). Everything else stays lazy.

---

# Rules

- Never modify or delete an original to "save space" — it is the fallback and
  the re-encode source.
- Never hand-edit `imageManifest.ts`; regenerate it.
- `og:image` points at the generated `<name>-og.jpg` (1200x630 JPEG), never an
  AVIF/WebP derivative or the heavy original (see Open Graph section above).
- `sharp` is a **devDependency** used only here, at author time. The committed
  outputs mean the Heroku/Docker build does no image work.
- If you change `WIDTH_LADDER`, old per-width files for removed widths become
  orphans; delete them by hand (the manifest will already ignore them).

---

# Encoder settings

Defined at the top of `scripts/optimize-images.mjs`:

```txt
WIDTH_LADDER  [480, 768, 1200, 1600]  (never upscales; source width always included)
AVIF          quality 50, effort 4
WebP          quality 74, effort 4
OG image      1200x630 JPEG, quality 80 (mozjpeg), charcoal #0e0c0a pad
```

Adjust deliberately and re-run; treat quality changes as a visual decision and
confirm against the design references.
