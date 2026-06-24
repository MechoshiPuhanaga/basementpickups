# Skill — Add Q&A / FAQ Item

Use this when the developer gives an **idea for a Q&A entry** — e.g. "add a FAQ
about returns", "we should explain shipping times", "add a question on coil
splitting". The input is usually a rough idea, not finished copy.

It is an implementation contract: turn an idea into a polished question +
answer, give it an Art Deco icon, and append it to the FAQ. The page, JSON-LD,
sitemap and nav already exist and pick up new entries automatically.

The golden rule: **generate the tone and wording freely, but get sign-off on
substance** — anything that reads as a promise, policy, price, timeframe, or
guarantee is the developer's to confirm before it ships.

---

# Where things live

| Thing                                 | Location                                                |
| ------------------------------------- | ------------------------------------------------------- |
| FAQ content (source of truth)         | `src/data/faq.ts` (`FAQ_ITEMS: FaqItem[]`)              |
| Art Deco topic icons                  | `src/design-system/atoms/FaqIcon/FaqIcon.tsx` (+ index) |
| The page that renders it (auto)       | `src/pages/FaqPage` — composes `FAQ_ITEMS`              |
| `FAQPage` JSON-LD + breadcrumb (auto) | `src/seo/getJsonLdForUrl.ts` (`/faq` branch)            |

Unlike products, FAQ content has **no separate raw source file** — `FAQ_ITEMS`
is the source of truth. The `/faq` page, the `FAQPage` structured data, the
sitemap entry, the `llms.txt` entry, and the nav link **already exist**, so a new
entry needs no page/SEO/route wiring — only the data (and, if needed, a new icon).

`FaqItem` shape: `{ id, question, answer, icon: FaqIconName }`.

---

# The flow

### 1. Word it (the core deliverable)

From the developer's idea, write **one question + one answer**:

- **Answer length:** keep it under 50 words; ~30–40 reads best.
- **Voice:** polite, elegant, restrained, musician-focused, technically credible.
  Honest over salesy. Match the existing entries (read `FAQ_ITEMS` first).
- **Spelling:** British English, for consistency with the existing copy
  (`colour`, `characterised`, `recognised`). cSpell may flag these — ignore it;
  it is not a project gate.
- **Question:** phrased the way a customer would ask it, not as a heading.
- No lorem, no clichés, no corporate filler. Relevant to pickups / the workshop.

### 2. ASK before shipping substance

Generate a draft, then **confirm with the developer** before finalizing if the
entry states anything they must own:

- guarantees, warranties, returns/refunds, shipping times, prices, legal terms;
- any factual claim about the workshop's process you can't verify from existing
  content.

Tone/wording you may decide yourself. Substance gets a sign-off.

### 3. Give it an icon

Each entry needs a `FaqIconName`.

- **Reuse** an existing icon if one clearly fits
  (`made-to-order`, `handwork`, `batch-variation`, `measurement-conditions`,
  `specifications`, `measured`). Prefer reuse over near-duplicates.
- **Otherwise add a new Art Deco line icon** to `FaqIcon.tsx`:
  1. add the token to the `FaqIconName` union;
  2. add a `{name === '<token>' && (…) }` branch with the SVG paths.
  - **Conventions** (match the existing icons + `NavIcon`): `viewBox="0 0 24 24"`,
    `stroke="currentColor"`, `strokeWidth="1.4"`, square caps, miter joins,
    `vectorEffect="non-scaling-stroke"` on every stroked path, `fill="none"`
    except small filled dots (`fill="currentColor" stroke="none"`).
  - **Style:** geometric, symmetric, single-weight Art Deco linework — fans,
    chevrons, concentric arcs, lozenges/diamonds, stepped forms. Make it read at
    ~28–36px and stay visually distinct from the other `FaqIcon`s and `NavIcon`s.
  - **In-house only** — never reintroduce the rejected Magnific vectors
    (memory `feedback-magnific-vectors-rejected`).
  - **No inline styles** — color comes from `currentColor`; the strict prod CSP
    forbids `style={}` (see `project-security-seo`).

### 4. Append the entry

Add a `FaqItem` to `FAQ_ITEMS` in `src/data/faq.ts`: kebab-case `id`, the
`question`, the `answer`, and the chosen `icon` token. Order: append to the end
unless the developer wants it grouped near a related entry.

### 5. Verify

```txt
pnpm run typecheck && pnpm run lint && pnpm run stylelint && pnpm run format:check && pnpm run build
```

Then on the running dev server: `/faq` renders the new item with its icon, and
the `FAQPage` JSON-LD includes the new `Question`/`Answer` (both automatic).
Report; **leave the commit/push to the developer** (memory `feedback-user-owns-commits`).

---

# Rules

- **Under 50 words** per answer; restrained editorial voice; British spelling.
- **Never invent policy/claims** (returns, guarantees, shipping, price) — ASK.
- **Reuse an icon** when one fits; only add a new one for a genuinely new topic.
- New icons are **in-house Art Deco**, `currentColor`, no inline styles, distinct
  from existing glyphs.
- Content lives only in `FAQ_ITEMS` — there is no raw FAQ source to reconcile.
- The list is meant to grow; appending an entry needs **no** page/route/SEO/
  sitemap changes (only a new icon token touches `FaqIcon.tsx`).
- Don't commit or push — report and let the developer do it.

---

# Quick checklist

```txt
[ ] read existing FAQ_ITEMS for voice + the FaqIcon set
[ ] draft question + answer (< 50 words, brand voice, British spelling)
[ ] ASK to confirm any policy/claim/price/timeframe substance
[ ] icon chosen: reuse existing OR add new Art Deco glyph (union + branch)
[ ] FaqItem appended to FAQ_ITEMS (id, question, answer, icon)
[ ] typecheck + lint + stylelint + format + build green
[ ] /faq shows the item + icon; FAQPage JSON-LD includes it
[ ] reported; commit left to developer
```
