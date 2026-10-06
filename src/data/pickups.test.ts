import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  getPickupAndParent,
  getPickupBySlug,
  getRelatedPickups,
  pickups,
  type Pickup,
} from './pickups';
import { BOBBIN_COLOR_LABELS } from './bobbinColors';

const PUBLIC_DIR = path.resolve(import.meta.dirname, '../../public');

/** Every pickup in the catalog, variants included. */
const allPickups: readonly Pickup[] = pickups.flatMap((p) => [p, ...(p.variants ?? [])]);

describe('related pickups', () => {
  it('gives every set/single three distinct related set/single pickups, never itself', () => {
    const topSlugs = new Set(pickups.map((p) => p.slug));
    for (const p of pickups) {
      const related = p.related ?? [];
      expect(related, p.slug).toHaveLength(3);
      expect(new Set(related).size, p.slug).toBe(related.length);
      expect(related, p.slug).not.toContain(p.slug);
      for (const slug of related) expect(topSlugs.has(slug), `${p.slug} → ${slug}`).toBe(true);
    }
  });

  it('leaves related lists to the set (variants carry none)', () => {
    for (const p of pickups) {
      for (const v of p.variants ?? []) expect(v.related, v.slug).toBeUndefined();
    }
  });

  it('resolves slugs in order and skips unknown ones', () => {
    const base = pickups[0];
    if (base === undefined) throw new Error('fixture: empty catalog');
    expect(getRelatedPickups(base).map((p) => p.slug)).toEqual(base.related);
    expect(getRelatedPickups({ ...base, related: ['nope', 'rockroach'] })).toHaveLength(1);
    const variant = base.variants?.[0];
    if (variant === undefined) throw new Error('fixture: first pickup has no variants');
    expect(getRelatedPickups(variant)).toEqual([]);
  });
});

describe('catalog invariants', () => {
  it('has the seven real products', () => {
    expect(pickups.map((p) => p.slug)).toEqual([
      'white-pearl',
      'macho-heaven',
      'chow-chow',
      'rockroach',
      'karakonjul',
      'little-karakonjul',
      'twin-bliss',
    ]);
  });

  it('uses unique slugs and ids across products and variants', () => {
    const slugs = allPickups.map((p) => p.slug);
    const ids = allPickups.map((p) => p.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has a positive integer euro price and non-empty copy on every pickup', () => {
    for (const p of allPickups) {
      expect(p.price, p.slug).toBeGreaterThan(0);
      expect(Number.isInteger(p.price), p.slug).toBe(true);
      expect(p.name.trim(), p.slug).not.toBe('');
      expect(p.description.trim(), p.slug).not.toBe('');
      expect(p.seoDescription.trim(), p.slug).not.toBe('');
      expect(p.seoDescription.length, `${p.slug} seoDescription ≤ 160`).toBeLessThanOrEqual(160);
      if (p.seoTitle !== undefined) {
        expect(p.seoTitle.startsWith(p.name), `${p.slug} seoTitle starts with the name`).toBe(true);
        // Leaves room for the " | Basement Pickups" suffix within a 60-char title.
        expect(p.seoTitle.length, `${p.slug} seoTitle ≤ 41`).toBeLessThanOrEqual(41);
      }
      expect(p.positions.length, p.slug).toBeGreaterThan(0);
    }
  });

  it('references product photos and OG images that exist on disk', () => {
    for (const p of allPickups) {
      const main = path.join(PUBLIC_DIR, p.images.main);
      expect(fs.existsSync(main), p.images.main).toBe(true);
      const og = main.replace(/\.png$/, '-og.jpg');
      expect(fs.existsSync(og), og).toBe(true);
      for (const extra of p.images.gallery ?? []) {
        expect(fs.existsSync(path.join(PUBLIC_DIR, extra)), extra).toBe(true);
      }
    }
  });

  it('keeps every Choice default inside its options', () => {
    const check = <T>(choice: { options: readonly T[]; defaultOption: T }, label: string) => {
      expect(choice.options, label).toContain(choice.defaultOption);
      expect(new Set(choice.options).size, `${label} has duplicate options`).toBe(
        choice.options.length,
      );
    };
    for (const p of allPickups) {
      check(p.conductors, `${p.slug} conductors`);
      check(p.potting, `${p.slug} potting`);
      check(p.hardware.polepieces, `${p.slug} polepieces`);
      if (p.hardware.cover) check(p.hardware.cover, `${p.slug} cover`);
      if (typeof p.hardware.spacingMm === 'object') {
        check(p.hardware.spacingMm, `${p.slug} spacing`);
      }
    }
  });

  it('gives every bobbin a unique id, a known palette and a default inside it', () => {
    for (const p of allPickups) {
      const bobbins = p.hardware.bobbins ?? [];
      const ids = bobbins.map((b) => b.id);
      expect(new Set(ids).size, p.slug).toBe(ids.length);
      for (const b of bobbins) {
        expect(b.palette, `${p.slug}/${b.id}`).toContain(b.defaultColor);
        for (const colour of b.palette) {
          expect(BOBBIN_COLOR_LABELS, `${p.slug}/${b.id} colour ${colour}`).toHaveProperty(colour);
        }
      }
      for (const colour of p.hardware.bobbinColors) {
        expect(BOBBIN_COLOR_LABELS, `${p.slug} bobbinColors ${colour}`).toHaveProperty(colour);
      }
      for (const colour of p.hardware.sevenString?.colors ?? []) {
        expect(BOBBIN_COLOR_LABELS, `${p.slug} 7-string ${colour}`).toHaveProperty(colour);
      }
    }
  });

  it('gives variants a single position and the parent both', () => {
    for (const parent of pickups) {
      for (const v of parent.variants ?? []) {
        expect(v.positions, v.slug).toHaveLength(1);
        expect(parent.positions, parent.slug).toContain(v.positions[0]);
        expect(v.variants, v.slug).toBeUndefined();
        expect(v.slug.startsWith(`${parent.slug}-`), v.slug).toBe(true);
      }
    }
  });
});

describe('getPickupBySlug', () => {
  it('finds a top-level product', () => {
    expect(getPickupBySlug('rockroach')?.name).toBe('Rockroach');
  });

  it('finds a variant', () => {
    expect(getPickupBySlug('white-pearl-neck')?.name).toBe('White Pearl · Neck');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getPickupBySlug('nope')).toBeUndefined();
    expect(getPickupBySlug('')).toBeUndefined();
  });
});

describe('getPickupAndParent', () => {
  it('returns the product as its own parent', () => {
    const found = getPickupAndParent('twin-bliss');
    expect(found?.pickup.slug).toBe('twin-bliss');
    expect(found?.parent.slug).toBe('twin-bliss');
  });

  it('returns the parent set for a variant', () => {
    const found = getPickupAndParent('chow-chow-bridge');
    expect(found?.pickup.slug).toBe('chow-chow-bridge');
    expect(found?.parent.slug).toBe('chow-chow');
  });

  it('returns undefined for unknown slugs', () => {
    expect(getPickupAndParent('chow-chow-middle')).toBeUndefined();
  });
});
