/**
 * Human-readable labels for pickup build options. The single source for the
 * product page, JSON-LD, the configurator, and the enquiry/email, so a token
 * such as `vintage-braided` always reads the same everywhere.
 */
import type {
  Choice,
  PickupConductor,
  PickupCoverFinish,
  PickupPolepiece,
  PickupPotting,
} from './pickups';

const CONDUCTOR_LABEL: Record<PickupConductor, string> = {
  'vintage-braided': 'Vintage braided (2-conductor)',
  '2-conductor': '2-conductor',
  '4-conductor': '4-conductor (coil split)',
};

const POLEPIECE_LABEL: Record<PickupPolepiece, string> = {
  nickel: 'Nickel',
  black: 'Black',
  gold: 'Gold',
};

const COVER_LABEL: Record<PickupCoverFinish, string> = {
  none: 'No cover',
  nickel: 'Nickel cover',
  black: 'Black cover',
  gold: 'Gold cover',
};

const POTTING_LABEL: Record<PickupPotting, string> = {
  potted: 'Potted',
  unpotted: 'Unpotted',
};

export function pottingLabel(value: PickupPotting): string {
  return POTTING_LABEL[value];
}

export function conductorLabel(value: PickupConductor): string {
  return CONDUCTOR_LABEL[value];
}

export function polepieceLabel(value: PickupPolepiece): string {
  return POLEPIECE_LABEL[value];
}

export function coverLabel(value: PickupCoverFinish): string {
  return COVER_LABEL[value];
}

/** `52` → "52 mm"; `49.2` → "49.2 mm". */
export function spacingLabel(mm: number): string {
  return `${Number.isInteger(mm) ? String(mm) : mm.toFixed(1)} mm`;
}

/** "A", "A or B", "A, B or C" — for listing a choice's options in specs. */
export function joinOr(labels: readonly string[]): string {
  if (labels.length <= 1) return labels[0] ?? '';
  return `${labels.slice(0, -1).join(', ')} or ${labels[labels.length - 1] ?? ''}`;
}

/** All options of a choice as one readable phrase, e.g. "Nickel, Black or Gold". */
export function choiceLabel<T>(choice: Choice<T>, label: (value: T) => string): string {
  return joinOr(choice.options.map(label));
}

/** The cover offer as shown in specs: "None" or "Optional (nickel, black or gold)". */
export function formatCoverOffer(cover: Choice<PickupCoverFinish> | undefined): string {
  if (cover === undefined) return 'None';
  const finishes = cover.options.filter((finish) => finish !== 'none');
  if (finishes.length === 0) return 'None';
  const list = joinOr(finishes);
  return cover.defaultOption === 'none' ? `Optional (${list})` : `${list} (fitted)`;
}

/** String spacing as shown in specs: a fixed value or "50 or 52 mm". */
export function formatSpacing(spacing: number | Choice<number>): string {
  if (typeof spacing === 'number') return spacingLabel(spacing);
  return `${spacing.options.map((mm) => spacingLabel(mm).replace(' mm', '')).join(' or ')} mm`;
}
