/**
 * Bobbin helpers: turn the structural `PickupBobbin[]` into display labels and a
 * pickup's overall available-colour set. Colour tokens → human labels live in
 * `bobbinColors.ts`; this module is about the bobbins (coils) themselves.
 */
import { bobbinColorLabel } from './bobbinColors';
import type { BobbinStyle, PickupBobbin, PickupHardware } from './pickups';

/** Chosen colour per bobbin, keyed by `PickupBobbin.id`. */
export type BobbinSelection = Readonly<Record<string, string>>;

/**
 * Stable identity for a cart line: a pickup slug plus its chosen bobbin colours.
 * Two lines with the same slug and the same colours share a key (and so
 * aggregate); changing a colour yields a new key. Keys are sorted so order never
 * affects identity. Absent/empty config → just the slug (non-configurable item).
 */
export function cartLineKey(slug: string, config?: BobbinSelection): string {
  if (config === undefined) return slug;
  const ids = Object.keys(config).sort();
  if (ids.length === 0) return slug;
  return `${slug}#${ids.map((id) => `${id}:${config[id] ?? ''}`).join(',')}`;
}

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

/** A resolved coil → colour pair for the enquiry/email (human-readable). */
export interface BobbinOption {
  readonly label: string;
  readonly value: string;
}

/**
 * Per-bobbin {coil label, colour name} for a chosen selection (missing entries
 * fall back to the bobbin's default). Used to show colours in the enquiry and to
 * send them as per-item options to the email backend.
 */
export function bobbinOptions(
  bobbins: readonly PickupBobbin[],
  config: BobbinSelection | undefined,
): BobbinOption[] {
  const labels = deriveBobbinLabels(bobbins);
  return bobbins.map((bobbin, index) => ({
    label: labels[index] ?? bobbinStyleLabel(bobbin.style),
    value: bobbinColorLabel(config?.[bobbin.id] ?? bobbin.defaultColor),
  }));
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
