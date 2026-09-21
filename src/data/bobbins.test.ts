import { describe, expect, it } from 'vitest';

import { availableBobbinColors, bobbinStyleLabel, deriveBobbinLabels } from './bobbins';
import type { PickupBobbin, PickupHardware } from './pickups';

const bobbin = (id: string, style: PickupBobbin['style'], label?: string): PickupBobbin => ({
  id,
  style,
  palette: ['black'],
  defaultColor: 'black',
  ...(label !== undefined ? { label } : {}),
});

describe('bobbinStyleLabel', () => {
  it('maps each style to display text', () => {
    expect(bobbinStyleLabel('slug')).toBe('Slug coil');
    expect(bobbinStyleLabel('screw')).toBe('Screw coil');
    expect(bobbinStyleLabel('blade')).toBe('Blade coil');
  });
});

describe('deriveBobbinLabels', () => {
  it('uses the style label when each style appears once', () => {
    expect(deriveBobbinLabels([bobbin('a', 'slug'), bobbin('b', 'screw')])).toEqual([
      'Slug coil',
      'Screw coil',
    ]);
  });

  it('numbers bobbins that share a style', () => {
    expect(
      deriveBobbinLabels([bobbin('a', 'screw'), bobbin('b', 'screw'), bobbin('c', 'blade')]),
    ).toEqual(['Screw coil 1', 'Screw coil 2', 'Blade coil']);
  });

  it('prefers an explicit label and still numbers the remaining siblings', () => {
    expect(
      deriveBobbinLabels([
        bobbin('a', 'screw', 'North'),
        bobbin('b', 'screw'),
        bobbin('c', 'screw'),
      ]),
    ).toEqual(['North', 'Screw coil 1', 'Screw coil 2']);
  });

  it('returns an empty list for no bobbins', () => {
    expect(deriveBobbinLabels([])).toEqual([]);
  });
});

describe('availableBobbinColors', () => {
  const polepieces = { options: ['nickel' as const], defaultOption: 'nickel' as const };

  it('falls back to bobbinColors when there are no bobbins', () => {
    const hw: PickupHardware = { bobbinColors: ['cream', 'black'], polepieces };
    expect(availableBobbinColors(hw)).toEqual(['cream', 'black']);
    expect(availableBobbinColors({ ...hw, bobbins: [] })).toEqual(['cream', 'black']);
  });

  it('unions the bobbin palettes in order without duplicates', () => {
    const hw: PickupHardware = {
      bobbinColors: ['ignored'],
      polepieces,
      bobbins: [
        { id: 'a', style: 'slug', palette: ['black', 'white'], defaultColor: 'black' },
        { id: 'b', style: 'screw', palette: ['white', 'cream'], defaultColor: 'cream' },
      ],
    };
    expect(availableBobbinColors(hw)).toEqual(['black', 'white', 'cream']);
  });
});
