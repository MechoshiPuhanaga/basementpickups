import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartProvider, useCart } from './CartContext';
import { cartLineKey, resolveConfig, type PickupConfig } from '../data/pickupConfig';
import { getPickupBySlug } from '../data/pickups';

const STORAGE_KEY = 'bp-enquiry-cart-v1';

/** The id a catalog line settles on: slug + build resolved against the catalog. */
function lineId(slug: string, config?: PickupConfig): string {
  const pickup = getPickupBySlug(slug);
  if (pickup === undefined) throw new Error(`not in catalog: ${slug}`);
  return cartLineKey(slug, resolveConfig(pickup, config));
}

function wrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

function renderCart() {
  return renderHook(() => useCart(), { wrapper });
}

const plain = { slug: 'macho-heaven', name: 'Macho Heaven', price: 250 };
const rockBlue = {
  slug: 'rockroach',
  name: 'Rockroach',
  price: 130,
  config: { bobbins: { 'coil-1': 'light-blue', 'coil-2': 'light-blue' } },
};
const rockRed = { ...rockBlue, config: { bobbins: { 'coil-1': 'red', 'coil-2': 'red' } } };
const plainId = lineId('macho-heaven');
const blueId = lineId('rockroach', rockBlue.config);
const redId = lineId('rockroach', rockRed.config);

function stored(): unknown {
  return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useCart', () => {
  it('throws outside a CartProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider');
  });

  it('starts empty and adds lines, aggregating identical builds', async () => {
    const { result } = renderCart();
    expect(result.current.items).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toBe(0);

    act(() => {
      result.current.add(plain);
      result.current.add(rockBlue);
      result.current.add(rockBlue);
      result.current.add(rockRed);
    });
    expect(result.current.items.map((i) => [i.id, i.qty])).toEqual([
      [plainId, 1],
      [blueId, 2],
      [redId, 1],
    ]);
    // A partial config is completed at add time, so reload can't re-key the line.
    expect(result.current.items[0]?.config).toMatchObject({ conductors: 'vintage-braided' });
    expect(result.current.count).toBe(4);
    expect(result.current.subtotal).toBe(250 + 130 * 3);
    await waitFor(() => {
      expect(stored()).toHaveLength(3);
    });
  });

  it('removes, sets quantities (0 removes) and clears', () => {
    const { result } = renderCart();
    act(() => {
      result.current.add(plain);
      result.current.add(rockBlue);
    });
    act(() => {
      result.current.setQty(plainId, 5);
    });
    expect(result.current.items[0]?.qty).toBe(5);
    act(() => {
      result.current.setQty(plainId, 0);
    });
    expect(result.current.items.map((i) => i.id)).toEqual([blueId]);
    act(() => {
      result.current.remove(blueId);
    });
    expect(result.current.items).toEqual([]);
    act(() => {
      result.current.add(plain);
      result.current.clear();
    });
    expect(result.current.items).toEqual([]);
  });

  it('updates a build in place, re-keys it, or merges into a colliding line', () => {
    const { result } = renderCart();
    act(() => {
      result.current.add(rockBlue);
      result.current.add(rockRed);
      result.current.add(rockRed);
    });

    // unknown id: no-op
    act(() => {
      result.current.updateConfig('nope', rockRed.config);
    });
    expect(result.current.items).toHaveLength(2);

    // same key (different object, different key order): config replaced, id unchanged
    const sameBlue = { bobbins: { 'coil-2': 'light-blue', 'coil-1': 'light-blue' } };
    const before = result.current.items[0]?.config;
    act(() => {
      result.current.updateConfig(blueId, sameBlue);
    });
    expect(result.current.items[0]?.id).toBe(blueId);
    expect(result.current.items[0]?.config).not.toBe(before);
    expect(result.current.items[0]?.config).toEqual(before);

    // new key, no collision: line re-keyed (partial config completed, as on add)
    const green = { bobbins: { 'coil-1': 'green', 'coil-2': 'green' } };
    const greenId = lineId('rockroach', green);
    act(() => {
      result.current.updateConfig(blueId, green);
    });
    expect(result.current.items[0]?.id).toBe(greenId);

    // collision: merged into the red line (1 + 2 = 3), edited line dropped
    act(() => {
      result.current.updateConfig(greenId, rockRed.config);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]?.id).toBe(redId);
    expect(result.current.items[0]?.qty).toBe(3);
  });
});

describe('CartProvider storage', () => {
  it('restores persisted lines after mount, resolving builds against the catalog', async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { slug: 'macho-heaven', name: 'Macho Heaven', price: 250, qty: 2, id: 'stale-id' },
        // stale colour (not in palette) + legacy flat config shape
        {
          slug: 'rockroach',
          name: 'Rockroach',
          price: 130,
          qty: 1,
          config: { 'coil-1': 'purple' },
        },
        // unknown slug keeps whatever build was stored (or none)
        { slug: 'ghost', name: 'Ghost', price: 1, qty: 1, config: { cover: 'gold' } },
        { slug: 'ghost', name: 'Ghost', price: 1, qty: 1 },
        // invalid entries are dropped
        { slug: 'x', name: 'X', price: 1, qty: 0 },
        { slug: 'y', name: 'Y', price: '1', qty: 1 },
        null,
        'junk',
      ]),
    );
    const { result } = renderCart();
    await waitFor(() => {
      expect(result.current.items).toHaveLength(4);
    });
    const [macho, rock, ghost, bare] = result.current.items;
    // A catalog line always settles on a complete build, never the stored id.
    expect(macho).toMatchObject({ slug: 'macho-heaven', qty: 2 });
    expect(macho?.id).toMatch(/^macho-heaven#/);
    expect(macho?.config).toMatchObject({ conductors: 'vintage-braided', potting: 'unpotted' });
    expect(rock?.config).toMatchObject({
      bobbins: { 'coil-1': 'light-blue', 'coil-2': 'light-blue' },
    });
    expect(rock?.id).toContain('rockroach#coil-1:light-blue,coil-2:light-blue');
    expect(ghost).toMatchObject({ id: 'ghost#cover:gold', config: { cover: 'gold' } });
    expect(bare).toMatchObject({ id: 'ghost' });
    expect(bare?.config).toBeUndefined();
  });

  it.each([
    ['malformed JSON', '{not json'],
    ['non-array', JSON.stringify({ slug: 'macho-heaven' })],
  ])('ignores %s in storage', async (_label, raw) => {
    window.localStorage.setItem(STORAGE_KEY, raw);
    const { result } = renderCart();
    await waitFor(() => {
      expect(stored()).toEqual([]);
    });
    expect(result.current.items).toEqual([]);
  });

  it('survives storage that throws on write', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota');
    });
    const { result } = renderCart();
    act(() => {
      result.current.add(plain);
    });
    await waitFor(() => {
      expect(result.current.count).toBe(1);
    });
  });
});
