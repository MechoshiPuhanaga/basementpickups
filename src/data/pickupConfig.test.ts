import { describe, expect, it } from 'vitest';

import {
  cartLineKey,
  configOptions,
  defaultConfig,
  hasConfigChoices,
  readStoredConfig,
  resolveConfig,
  type PickupConfig,
} from './pickupConfig';
import { getPickupBySlug, type Pickup } from './pickups';

function pickup(slug: string): Pickup {
  const found = getPickupBySlug(slug);
  if (found === undefined) throw new Error(`Missing fixture pickup: ${slug}`);
  return found;
}

/** A minimal non-configurable pickup: no bobbins, single-option choices, no cover. */
const FIXED: Pickup = {
  id: 'fixed',
  slug: 'fixed',
  name: 'Fixed',
  description: 'd',
  seoDescription: 's',
  type: 'single',
  magnet: 'alnico-5',
  price: 10,
  positions: ['middle'],
  hardware: {
    bobbinColors: ['black'],
    polepieces: { options: ['nickel'], defaultOption: 'nickel' },
  },
  conductors: { options: ['2-conductor'], defaultOption: '2-conductor' },
  potting: { options: ['potted'], defaultOption: 'potted' },
  specs: {},
  images: { main: '/x.png' },
};

describe('resolveConfig', () => {
  it('fills every offered option with the default when nothing is chosen', () => {
    const rockroach = pickup('rockroach');
    expect(resolveConfig(rockroach, undefined)).toEqual({
      bobbins: { 'coil-1': 'light-blue', 'coil-2': 'light-blue' },
      conductors: '4-conductor',
      polepieces: 'black',
      cover: 'none',
      potting: 'potted',
    });
  });

  it('keeps valid choices and replaces invalid ones with defaults', () => {
    const rockroach = pickup('rockroach');
    const resolved = resolveConfig(rockroach, {
      bobbins: { 'coil-1': 'red', 'coil-2': 'not-a-colour', stray: 'blue' },
      conductors: 'vintage-braided',
      polepieces: 'purple' as never,
      cover: 'gold',
      potting: 'unpotted',
      spacingMm: 52,
    });
    expect(resolved).toEqual({
      bobbins: { 'coil-1': 'red', 'coil-2': 'light-blue' },
      conductors: 'vintage-braided',
      polepieces: 'black',
      cover: 'gold',
      // potting is fixed to potted on Rockroach, so unpotted is dropped
      potting: 'potted',
    });
    // Rockroach has fixed spacing, so no spacing key survives
    expect('spacingMm' in resolved).toBe(false);
  });

  it('resolves a spacing choice when the pickup offers one', () => {
    const twinBliss = pickup('twin-bliss');
    expect(resolveConfig(twinBliss, undefined).spacingMm).toBe(50);
    expect(resolveConfig(twinBliss, { spacingMm: 52 }).spacingMm).toBe(52);
    expect(resolveConfig(twinBliss, { spacingMm: 49.2 }).spacingMm).toBe(50);
    expect('cover' in resolveConfig(twinBliss, { cover: 'gold' })).toBe(false);
  });

  it('omits bobbins for a pickup without configurable bobbins', () => {
    expect(resolveConfig(FIXED, { bobbins: { coil: 'red' } })).toEqual({
      conductors: '2-conductor',
      polepieces: 'nickel',
      potting: 'potted',
    });
  });

  it('defaultConfig equals resolving an empty config', () => {
    for (const slug of ['white-pearl', 'macho-heaven-neck', 'twin-bliss']) {
      expect(defaultConfig(pickup(slug))).toEqual(resolveConfig(pickup(slug), {}));
    }
  });
});

describe('hasConfigChoices', () => {
  it('is true when at least one real decision exists', () => {
    expect(hasConfigChoices(pickup('rockroach'))).toBe(true);
    expect(hasConfigChoices(pickup('karakonjul'))).toBe(true); // wire + polepieces + cover
    expect(hasConfigChoices(pickup('twin-bliss'))).toBe(true);
  });

  it('is false for a pickup with only fixed options', () => {
    expect(hasConfigChoices(FIXED)).toBe(false);
  });

  it('detects each choice dimension independently', () => {
    const base = FIXED;
    expect(
      hasConfigChoices({
        ...base,
        hardware: {
          ...base.hardware,
          bobbins: [{ id: 'c', style: 'slug', palette: ['black', 'white'], defaultColor: 'black' }],
        },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        conductors: { options: ['2-conductor', '4-conductor'], defaultOption: '2-conductor' },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        hardware: {
          ...base.hardware,
          polepieces: { options: ['nickel', 'gold'], defaultOption: 'nickel' },
        },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        hardware: { ...base.hardware, cover: { options: ['none', 'gold'], defaultOption: 'none' } },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        hardware: { ...base.hardware, cover: { options: ['none'], defaultOption: 'none' } },
      }),
    ).toBe(false);
    expect(
      hasConfigChoices({
        ...base,
        potting: { options: ['potted', 'unpotted'], defaultOption: 'potted' },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        hardware: { ...base.hardware, spacingMm: { options: [50, 52], defaultOption: 50 } },
      }),
    ).toBe(true);
    expect(
      hasConfigChoices({
        ...base,
        hardware: { ...base.hardware, spacingMm: 52 },
      }),
    ).toBe(false);
  });
});

describe('cartLineKey', () => {
  it('is just the slug without a config or with an empty config', () => {
    expect(cartLineKey('rockroach')).toBe('rockroach');
    expect(cartLineKey('rockroach', {})).toBe('rockroach');
    expect(cartLineKey('rockroach', { bobbins: {} })).toBe('rockroach');
  });

  it('serialises every option in a stable, sorted order', () => {
    const config: PickupConfig = {
      spacingMm: 52,
      potting: 'potted',
      cover: 'gold',
      polepieces: 'black',
      conductors: '4-conductor',
      bobbins: { 'coil-2': 'red', 'coil-1': 'blue' },
    };
    expect(cartLineKey('x', config)).toBe(
      'x#coil-1:blue,coil-2:red,conductors:4-conductor,polepieces:black,cover:gold,potting:potted,spacing:52',
    );
  });

  it('gives the same key regardless of bobbin insertion order', () => {
    const a = cartLineKey('x', { bobbins: { 'coil-1': 'red', 'coil-2': 'blue' } });
    const b = cartLineKey('x', { bobbins: { 'coil-2': 'blue', 'coil-1': 'red' } });
    expect(a).toBe(b);
  });

  it('changes when any option changes', () => {
    const base = defaultConfig(pickup('rockroach'));
    const changed = { ...base, cover: 'gold' as const };
    expect(cartLineKey('rockroach', base)).not.toBe(cartLineKey('rockroach', changed));
  });
});

describe('configOptions', () => {
  it('lists bobbins by derived label plus every resolved option', () => {
    const rockroach = pickup('rockroach');
    expect(configOptions(rockroach, undefined)).toEqual([
      { label: 'Slug coil', value: 'Light blue' },
      { label: 'Screw coil', value: 'Light blue' },
      { label: 'Wire', value: '4-conductor (coil split)' },
      { label: 'Pole pieces', value: 'Black' },
      { label: 'Cover', value: 'No cover' },
      { label: 'Potting', value: 'Potted' },
    ]);
  });

  it('numbers bobbins that share a style and lists spacing when offered', () => {
    const twinBliss = pickup('twin-bliss');
    const options = configOptions(twinBliss, {
      bobbins: { 'coil-1': 'red' },
      spacingMm: 52,
      potting: 'potted',
    });
    expect(options).toEqual([
      { label: 'Screw coil 1', value: 'Red' },
      { label: 'Screw coil 2', value: 'Orange' },
      { label: 'Wire', value: '4-conductor (coil split)' },
      { label: 'Pole pieces', value: 'Nickel' },
      { label: 'Potting', value: 'Potted' },
      { label: 'String spacing', value: '52 mm' },
    ]);
  });

  it('has no bobbin rows for a pickup without configurable bobbins', () => {
    expect(configOptions(FIXED, undefined)).toEqual([
      { label: 'Wire', value: '2-conductor' },
      { label: 'Pole pieces', value: 'Nickel' },
      { label: 'Potting', value: 'Potted' },
    ]);
  });
});

describe('readStoredConfig', () => {
  it('rejects non-objects and empty objects', () => {
    expect(readStoredConfig(undefined)).toBeUndefined();
    expect(readStoredConfig(null)).toBeUndefined();
    expect(readStoredConfig('red')).toBeUndefined();
    expect(readStoredConfig(42)).toBeUndefined();
    expect(readStoredConfig({})).toBeUndefined();
  });

  it('reads the current shape and drops non-string / wrong-typed values', () => {
    expect(
      readStoredConfig({
        bobbins: { 'coil-1': 'red', 'coil-2': 7 },
        conductors: '4-conductor',
        polepieces: 3,
        cover: 'gold',
        potting: 'unpotted',
        spacingMm: 52,
        junk: 'x',
      }),
    ).toEqual({
      bobbins: { 'coil-1': 'red' },
      conductors: '4-conductor',
      cover: 'gold',
      potting: 'unpotted',
      spacingMm: 52,
    });
  });

  it('ignores a non-object bobbins value and a string spacing', () => {
    expect(readStoredConfig({ bobbins: 'red', spacingMm: '52' })).toBeUndefined();
    expect(readStoredConfig({ bobbins: null, cover: 'none' })).toEqual({ cover: 'none' });
  });

  it('migrates the legacy flat { bobbinId: colour } record into bobbins', () => {
    expect(readStoredConfig({ 'coil-1': 'red', 'coil-2': 'blue', bad: 1 })).toEqual({
      bobbins: { 'coil-1': 'red', 'coil-2': 'blue' },
    });
  });

  it('treats the legacy shape as legacy even when other keys look like options', () => {
    // No known key → whole object is the bobbin map; a non-string value is dropped.
    expect(readStoredConfig({ coil: 'cream', count: 2 })).toEqual({ bobbins: { coil: 'cream' } });
  });
});
