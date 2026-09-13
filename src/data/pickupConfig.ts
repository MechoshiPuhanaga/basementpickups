/**
 * A customer's build configuration for one pickup — the chosen bobbin colours,
 * lead wire, pole-piece finish, cover, and (when offered) string spacing.
 *
 * Both the product page and each cart line hold a `PickupConfig`; everything
 * that reads one goes through `resolveConfig` so a partial or stale config
 * (older storage, a removed option) always yields a complete, valid build. The
 * enquiry/email reads the same resolved values via `configOptions`.
 */
import { bobbinColorLabel } from './bobbinColors';
import { deriveBobbinLabels } from './bobbins';
import {
  conductorLabel,
  coverLabel,
  polepieceLabel,
  pottingLabel,
  spacingLabel,
} from './pickupLabels';
import type {
  Choice,
  Pickup,
  PickupConductor,
  PickupCoverFinish,
  PickupPolepiece,
  PickupPotting,
} from './pickups';

/** Chosen colour per bobbin, keyed by `PickupBobbin.id`. */
export type BobbinSelection = Readonly<Record<string, string>>;

export interface PickupConfig {
  readonly bobbins?: BobbinSelection;
  readonly conductors?: PickupConductor;
  readonly polepieces?: PickupPolepiece;
  readonly cover?: PickupCoverFinish;
  readonly potting?: PickupPotting;
  readonly spacingMm?: number;
}

/** A resolved option → value pair for the enquiry summary and workshop email. */
export interface ConfigOption {
  readonly label: string;
  readonly value: string;
}

function pick<T>(choice: Choice<T> | undefined, value: T | undefined): T | undefined {
  if (choice === undefined) return undefined;
  return value !== undefined && choice.options.includes(value) ? value : choice.defaultOption;
}

/**
 * Fill a (possibly partial or invalid) config with the pickup's defaults. Every
 * value is checked against the offered options, so the result is always a
 * complete build the workshop can make. Keys the pickup doesn't offer are
 * dropped.
 */
export function resolveConfig(pickup: Pickup, config: PickupConfig | undefined): PickupConfig {
  const bobbins = pickup.hardware.bobbins ?? [];
  const bobbinSelection: Record<string, string> = {};
  for (const bobbin of bobbins) {
    const chosen = config?.bobbins?.[bobbin.id];
    bobbinSelection[bobbin.id] =
      chosen !== undefined && bobbin.palette.includes(chosen) ? chosen : bobbin.defaultColor;
  }
  const spacing = pickup.hardware.spacingMm;
  const spacingChoice = typeof spacing === 'object' ? spacing : undefined;

  const conductors = pick(pickup.conductors, config?.conductors);
  const polepieces = pick(pickup.hardware.polepieces, config?.polepieces);
  const cover = pick(pickup.hardware.cover, config?.cover);
  const potting = pick(pickup.potting, config?.potting);
  const spacingMm = pick(spacingChoice, config?.spacingMm);

  return {
    ...(bobbins.length > 0 ? { bobbins: bobbinSelection } : {}),
    ...(conductors !== undefined ? { conductors } : {}),
    ...(polepieces !== undefined ? { polepieces } : {}),
    ...(cover !== undefined ? { cover } : {}),
    ...(potting !== undefined ? { potting } : {}),
    ...(spacingMm !== undefined ? { spacingMm } : {}),
  };
}

export function defaultConfig(pickup: Pickup): PickupConfig {
  return resolveConfig(pickup, undefined);
}

/** True when the customer has at least one real decision to make. */
export function hasConfigChoices(pickup: Pickup): boolean {
  const h = pickup.hardware;
  return (
    (h.bobbins ?? []).some((bobbin) => bobbin.palette.length > 1) ||
    pickup.conductors.options.length > 1 ||
    h.polepieces.options.length > 1 ||
    (h.cover?.options.length ?? 0) > 1 ||
    pickup.potting.options.length > 1 ||
    (typeof h.spacingMm === 'object' && h.spacingMm.options.length > 1)
  );
}

/**
 * Stable identity for a cart line: a pickup slug plus its build. Two lines with
 * the same slug and the same build share a key (and so aggregate); changing any
 * option yields a new key. Keys are sorted so order never affects identity.
 * Absent/empty config → just the slug (non-configurable item).
 */
export function cartLineKey(slug: string, config?: PickupConfig): string {
  if (config === undefined) return slug;
  const parts: string[] = [];
  const bobbins = config.bobbins ?? {};
  for (const id of Object.keys(bobbins).sort()) {
    parts.push(`${id}:${bobbins[id] ?? ''}`);
  }
  if (config.conductors !== undefined) parts.push(`conductors:${config.conductors}`);
  if (config.polepieces !== undefined) parts.push(`polepieces:${config.polepieces}`);
  if (config.cover !== undefined) parts.push(`cover:${config.cover}`);
  if (config.potting !== undefined) parts.push(`potting:${config.potting}`);
  if (config.spacingMm !== undefined) parts.push(`spacing:${String(config.spacingMm)}`);
  return parts.length === 0 ? slug : `${slug}#${parts.join(',')}`;
}

/**
 * Human-readable option list for a build (resolved against the pickup, so
 * missing entries show the defaults). Fixed values (a single-option choice) are
 * still listed so the workshop email carries the complete build.
 */
export function configOptions(pickup: Pickup, config: PickupConfig | undefined): ConfigOption[] {
  const resolved = resolveConfig(pickup, config);
  const bobbins = pickup.hardware.bobbins ?? [];
  const labels = deriveBobbinLabels(bobbins);
  const options: ConfigOption[] = bobbins.map((bobbin, index) => ({
    label: labels[index] ?? bobbin.style,
    value: bobbinColorLabel(resolved.bobbins?.[bobbin.id] ?? bobbin.defaultColor),
  }));
  if (resolved.conductors !== undefined) {
    options.push({ label: 'Wire', value: conductorLabel(resolved.conductors) });
  }
  if (resolved.polepieces !== undefined) {
    options.push({ label: 'Pole pieces', value: polepieceLabel(resolved.polepieces) });
  }
  if (resolved.cover !== undefined) {
    options.push({ label: 'Cover', value: coverLabel(resolved.cover) });
  }
  if (resolved.potting !== undefined) {
    options.push({ label: 'Potting', value: pottingLabel(resolved.potting) });
  }
  if (resolved.spacingMm !== undefined) {
    options.push({ label: 'String spacing', value: spacingLabel(resolved.spacingMm) });
  }
  return options;
}

/**
 * A config from untrusted storage. Accepts both the current shape and the
 * pre-2026-09 flat `{ [bobbinId]: colour }` record (migrated into `bobbins`).
 * Values are only shape-checked here; `resolveConfig` validates them against
 * the pickup's actual options.
 */
export function readStoredConfig(value: unknown): PickupConfig | undefined {
  if (typeof value !== 'object' || value === null) return undefined;
  const raw = value as Record<string, unknown>;
  const known = ['bobbins', 'conductors', 'polepieces', 'cover', 'potting', 'spacingMm'];
  const isCurrentShape = known.some((key) => key in raw);

  const bobbins: Record<string, string> = {};
  const bobbinSource = isCurrentShape ? raw['bobbins'] : raw;
  if (typeof bobbinSource === 'object' && bobbinSource !== null) {
    for (const [key, val] of Object.entries(bobbinSource)) {
      if (typeof val === 'string') bobbins[key] = val;
    }
  }
  const str = (key: string): string | undefined =>
    isCurrentShape && typeof raw[key] === 'string' ? raw[key] : undefined;
  const spacing =
    isCurrentShape && typeof raw['spacingMm'] === 'number' ? raw['spacingMm'] : undefined;

  const config: PickupConfig = {
    ...(Object.keys(bobbins).length > 0 ? { bobbins } : {}),
    ...(str('conductors') !== undefined
      ? { conductors: str('conductors') as PickupConductor }
      : {}),
    ...(str('polepieces') !== undefined
      ? { polepieces: str('polepieces') as PickupPolepiece }
      : {}),
    ...(str('cover') !== undefined ? { cover: str('cover') as PickupCoverFinish } : {}),
    ...(str('potting') !== undefined ? { potting: str('potting') as PickupPotting } : {}),
    ...(spacing !== undefined ? { spacingMm: spacing } : {}),
  };
  return Object.keys(config).length > 0 ? config : undefined;
}
