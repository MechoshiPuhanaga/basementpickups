/**
 * Bobbin helpers: turn the structural `PickupBobbin[]` into display labels and a
 * pickup's overall available-colour set. Colour tokens → human labels live in
 * `bobbinColors.ts`; the customer's chosen build lives in `pickupConfig.ts`.
 * This module is about the bobbins (coils) themselves.
 */
import type { BobbinStyle, PickupBobbin, PickupHardware } from './pickups';

const BOBBIN_STYLE_LABELS: Record<BobbinStyle, string> = {
  slug: 'Slug coil',
  screw: 'Screw coil',
  blade: 'Blade coil',
};

export function bobbinStyleLabel(style: BobbinStyle): string {
  return BOBBIN_STYLE_LABELS[style];
}

/**
 * Display label for each bobbin, index-aligned to the input. Uses an explicit
 * `label` when set; otherwise derives from `style`, appending a 1-based index
 * when two or more bobbins share the same style (e.g. "Screw coil 1" / "…2").
 */
export function deriveBobbinLabels(bobbins: readonly PickupBobbin[]): string[] {
  const styleCounts = new Map<BobbinStyle, number>();
  for (const bobbin of bobbins) {
    styleCounts.set(bobbin.style, (styleCounts.get(bobbin.style) ?? 0) + 1);
  }
  const seen = new Map<BobbinStyle, number>();
  return bobbins.map((bobbin) => {
    if (bobbin.label !== undefined) return bobbin.label;
    const base = bobbinStyleLabel(bobbin.style);
    if ((styleCounts.get(bobbin.style) ?? 0) <= 1) return base;
    const index = (seen.get(bobbin.style) ?? 0) + 1;
    seen.set(bobbin.style, index);
    return `${base} ${String(index)}`;
  });
}

/**
 * The colours a pickup can show overall — the union of its bobbins' palettes
 * (order preserved, de-duplicated). Falls back to `bobbinColors` for pickups not
 * yet given a `bobbins` array, so existing display/JSON-LD keep working.
 */
export function availableBobbinColors(hardware: PickupHardware): readonly string[] {
  if (hardware.bobbins === undefined || hardware.bobbins.length === 0) {
    return hardware.bobbinColors;
  }
  const seen = new Set<string>();
  const colors: string[] = [];
  for (const bobbin of hardware.bobbins) {
    for (const color of bobbin.palette) {
      if (!seen.has(color)) {
        seen.add(color);
        colors.push(color);
      }
    }
  }
  return colors;
}
