export type PickupType = 'humbucker' | 'single' | 'p90';

export type PickupMagnet =
  'alnico-2' | 'alnico-3' | 'alnico-4' | 'alnico-5' | 'alnico-8' | 'ceramic' | 'neodymium';

export type PickupPosition = 'neck' | 'middle' | 'bridge';

export type PickupConductor = 'vintage-braided' | '2-conductor' | '4-conductor';

export type PickupPotting = 'potted' | 'unpotted';

/**
 * A customer-selectable build option: the finishes/variants offered for a
 * pickup and the one it ships with when nothing is chosen. `defaultOption` must
 * be one of `options`. A single-entry `options` means the value is fixed (shown
 * read-only, never asked). Keeps rules in the data, so a future single coil or
 * P-90 just lists its own options — nothing in the UI hardcodes humbucker rules.
 */
export interface Choice<T> {
  readonly options: readonly T[];
  readonly defaultOption: T;
}

export interface PickupSpecs {
  readonly inductance?: string;
  readonly dcr?: string;
  readonly selfResonantPeak?: string;
  readonly loadedResonantPeak?: string;
}

export interface PickupImages {
  readonly main: string;
  readonly gallery?: readonly string[];
}

/** Pole-piece finish offered for a pickup. */
export type PickupPolepiece = 'nickel' | 'black' | 'gold';

/** Metal cover finish; `none` = uncovered (open bobbins). */
export type PickupCoverFinish = 'none' | 'nickel' | 'black' | 'gold';

/** A 7-string variant option. Present means the pickup is offered in 7-string. */
export interface PickupSevenString {
  /** Bobbin colors the 7-string version is available in. */
  readonly colors: readonly string[];
}

/**
 * Pole-piece style of a single bobbin (coil). A humbucker has two bobbins in any
 * combination (slug/screw, screw/screw, slug/blade, blade/blade, …); a single
 * coil or P-90 has one. Drives the bobbin's label and swatch.
 */
export type BobbinStyle = 'slug' | 'screw' | 'blade';

/**
 * One physical bobbin a customer can colour. The palette is **per bobbin** (the
 * available finishes depend on spacing / 7-string / future bobbin styles), so it
 * lives here rather than once per pickup. `id` is a neutral, stable key unique
 * within the pickup (`coil-1` / `coil-2`, or `coil` for a single bobbin) used for
 * cart configuration and de-duplication — never shown. `label` is optional
 * display text; when absent it is derived from `style` (with an index when two
 * bobbins share a style).
 */
export interface PickupBobbin {
  readonly id: string;
  readonly style: BobbinStyle;
  /** Colours available for THIS bobbin, as name tokens (see `bobbinColors.ts`). */
  readonly palette: readonly string[];
  /** Default colour when added without customization; must be one of `palette`. */
  readonly defaultColor: string;
  readonly label?: string;
}

/**
 * Physical build / configuration of a pickup. Bobbin colors are name tokens the
 * DS `Swatch` / `BobbinIcon` atoms can render. Spacing is the string spacing in
 * millimetres; pole pieces are a customer choice (see `Choice`).
 */
export interface PickupHardware {
  /** String spacing in mm. A `Choice` means the customer picks one. */
  readonly spacingMm?: number | Choice<number>;
  readonly bobbinColors: readonly string[];
  /**
   * Configurable bobbins (coils) with their per-bobbin palette + default colour.
   * Optional during rollout: when absent, the pickup is not yet configurable and
   * behaves exactly as before (display falls back to `bobbinColors`).
   */
  readonly bobbins?: readonly PickupBobbin[];
  /** Pole-piece finish: one finish for all coils of the pickup. */
  readonly polepieces: Choice<PickupPolepiece>;
  /** Cover choice (usually defaulting to `none`). Absent = no cover offered at all. */
  readonly cover?: Choice<PickupCoverFinish>;
  readonly sevenString?: PickupSevenString;
}

export interface Pickup {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  /** Search-result snippet (≤155 chars): the description distilled, not truncated. */
  readonly seoDescription: string;
  readonly type: PickupType;
  readonly magnet: PickupMagnet;
  readonly price: number;
  readonly positions: readonly PickupPosition[];
  readonly hardware: PickupHardware;
  /** Lead wire: vintage braided (2-conductor) or 4-conductor (coil split). */
  readonly conductors: Choice<PickupConductor>;
  /** Wax potting: a customer choice, or fixed when only one option is listed. */
  readonly potting: Choice<PickupPotting>;
  readonly specs: PickupSpecs;
  readonly images: PickupImages;
  readonly variants?: readonly Pickup[];
}

const PHOTO = (slug: string): string => `/assets/images/product-photos/${slug}.png`;

/**
 * The boutique bobbin-color palette shared by the high-output single humbuckers
 * (Rockroach, Little Karakonjul, Twin Bliss). These are name tokens (not hex) —
 * resolved to display labels via `bobbinColorLabel` and to swatch fills by the
 * DS `Swatch` atom. See `src/data/bobbinColors.ts`.
 */
const STANDARD_BOBBIN_COLORS: readonly string[] = [
  'black',
  'white',
  'cream',
  'coral',
  'red',
  'blue',
  'light-blue',
  'pink',
  'green',
  'orange',
];

/** PAF-set palette (49.2 mm bobbins): cream / white / black only. */
const PAF_BOBBIN_COLORS: readonly string[] = ['cream', 'white', 'black'];

/** 49.2 mm (PAF) pole pieces come in nickel only. */
const PAF_POLEPIECES: Choice<PickupPolepiece> = { options: ['nickel'], defaultOption: 'nickel' };

/** 50 / 52 mm pole pieces: nickel, black or gold, with a per-model default. */
function polepieceChoice(defaultOption: PickupPolepiece): Choice<PickupPolepiece> {
  return { options: ['nickel', 'black', 'gold'], defaultOption };
}

/** Every humbucker is offered with either lead wire; the default is per model. */
function wireChoice(defaultOption: PickupConductor): Choice<PickupConductor> {
  return { options: ['vintage-braided', '4-conductor'], defaultOption };
}

/** Optional metal cover, shipped uncovered unless chosen. */
const COVER_OPTIONAL: Choice<PickupCoverFinish> = {
  options: ['none', 'nickel', 'black', 'gold'],
  defaultOption: 'none',
};

/** Potting offered either way, shipped unpotted unless chosen. */
const POTTING_OPTIONAL: Choice<PickupPotting> = {
  options: ['unpotted', 'potted'],
  defaultOption: 'unpotted',
};

/** Always wax potted (high-output models). */
const POTTING_FIXED: Choice<PickupPotting> = { options: ['potted'], defaultOption: 'potted' };

const WIRE_BRAIDED = wireChoice('vintage-braided');
const WIRE_FOUR = wireChoice('4-conductor');
const POLEPIECES_NICKEL = polepieceChoice('nickel');
const POLEPIECES_BLACK = polepieceChoice('black');

/** A classic two-coil humbucker (slug + screw) sharing one palette, with per-coil defaults. */
function humbuckerCoils(
  palette: readonly string[],
  slugColor: string,
  screwColor: string,
): readonly PickupBobbin[] {
  return [
    { id: 'coil-1', style: 'slug', palette, defaultColor: slugColor },
    { id: 'coil-2', style: 'screw', palette, defaultColor: screwColor },
  ];
}

const WHITE_PEARL_BOBBINS = humbuckerCoils(['white'], 'white', 'white');
const PAF_BOBBINS = humbuckerCoils(PAF_BOBBIN_COLORS, 'black', 'cream');
const ROCKROACH_BOBBINS = humbuckerCoils(STANDARD_BOBBIN_COLORS, 'light-blue', 'light-blue');
const KARAKONJUL_BOBBINS = humbuckerCoils(['black'], 'black', 'black');
const LITTLE_KARAKONJUL_BOBBINS = humbuckerCoils(STANDARD_BOBBIN_COLORS, 'green', 'green');
// Twin Bliss is wound on two screw coils (no slug row).
const TWIN_BLISS_BOBBINS: readonly PickupBobbin[] = [
  { id: 'coil-1', style: 'screw', palette: STANDARD_BOBBIN_COLORS, defaultColor: 'orange' },
  { id: 'coil-2', style: 'screw', palette: STANDARD_BOBBIN_COLORS, defaultColor: 'orange' },
];

export const pickups: readonly Pickup[] = [
  {
    id: 'white-pearl',
    slug: 'white-pearl',
    name: 'White Pearl',
    description:
      'A Strat-style humbucker set built for clarity, openness, and articulation. Airy top end, controlled lows, and a balanced, musical voice that rewards picking dynamics and the volume knob.',
    seoDescription:
      'Hand-wound Alnico 4 humbucker set for Strat-style guitars: airy highs, tight lows and a balanced voice that rewards picking dynamics and the volume knob.',
    type: 'humbucker',
    magnet: 'alnico-4',
    price: 125,
    positions: ['neck', 'bridge'],
    hardware: {
      polepieces: POLEPIECES_NICKEL,
      cover: COVER_OPTIONAL,
      bobbinColors: ['white'],
      bobbins: WHITE_PEARL_BOBBINS,
    },
    conductors: WIRE_FOUR,
    potting: POTTING_OPTIONAL,
    specs: { dcr: '5.9k–6.8k', inductance: '2.8H–3.5H' },
    images: { main: PHOTO('white-pearl') },
    variants: [
      {
        id: 'white-pearl-neck',
        slug: 'white-pearl-neck',
        name: 'White Pearl · Neck',
        description:
          'Designed for players seeking maximum clarity, openness, and articulation from a humbucker-equipped Strat-style guitar. Its relatively low inductance and high resonant frequency create an airy top end with excellent note separation and dynamic response. Clean tones stay sparkling and detailed; overdriven sounds reveal complex harmonic content without becoming harsh. The bass response is intentionally controlled and tight, avoiding the boominess often associated with neck humbuckers.',
        seoDescription:
          'Neck humbucker for Strat-style guitars: low inductance for sparkling cleans, clear note separation and tight, controlled bass without the boom.',
        type: 'humbucker',
        magnet: 'alnico-3',
        price: 125,
        positions: ['neck'],
        hardware: {
          spacingMm: 50,
          polepieces: POLEPIECES_NICKEL,
          cover: COVER_OPTIONAL,
          bobbinColors: ['white'],
          bobbins: WHITE_PEARL_BOBBINS,
        },
        conductors: WIRE_FOUR,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '5.9k',
          inductance: '2.8H',
          selfResonantPeak: '8.4 kHz',
          loadedResonantPeak: '3.9 kHz',
        },
        images: { main: PHOTO('white-pearl') },
      },
      {
        id: 'white-pearl-bridge',
        slug: 'white-pearl-bridge',
        name: 'White Pearl · Bridge',
        description:
          'Complements the neck with additional authority, harmonic richness, and sustain while preserving the set’s overall clarity. Articulate lows, detailed mids, and smooth highs that cut through a mix without sounding aggressive. Rich overtones emerge naturally when driven, making it equally suitable for expressive lead work and rhythm playing.',
        seoDescription:
          'Bridge humbucker with authority and sustain: articulate lows, detailed mids and smooth highs that cut through a mix without turning harsh.',
        type: 'humbucker',
        magnet: 'alnico-4',
        price: 125,
        positions: ['bridge'],
        hardware: {
          spacingMm: 52,
          polepieces: POLEPIECES_NICKEL,
          cover: COVER_OPTIONAL,
          bobbinColors: ['white'],
          bobbins: WHITE_PEARL_BOBBINS,
        },
        conductors: WIRE_FOUR,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '6.8k',
          inductance: '3.5H',
          selfResonantPeak: '7.4 kHz',
          loadedResonantPeak: '3.4 kHz',
        },
        images: { main: PHOTO('white-pearl') },
      },
    ],
  },
  {
    id: 'macho-heaven',
    slug: 'macho-heaven',
    name: 'Macho Heaven',
    description:
      'A vintage PAF set that captures the sweetness and expressiveness of a classic humbucker while eliminating the muddiness of traditional designs. Warm, open, and highly articulate, with a vocal midrange that flatters both clean and overdriven tones.',
    seoDescription:
      'Vintage PAF humbucker set, hand-wound with Alnico 4: warm, open and articulate with a vocal midrange, minus the mud of traditional designs.',
    type: 'humbucker',
    magnet: 'alnico-4',
    price: 140,
    positions: ['neck', 'bridge'],
    hardware: {
      spacingMm: 49.2,
      polepieces: PAF_POLEPIECES,
      bobbinColors: ['cream', 'white', 'black'],
      bobbins: PAF_BOBBINS,
      cover: COVER_OPTIONAL,
    },
    conductors: WIRE_BRAIDED,
    potting: POTTING_OPTIONAL,
    specs: { dcr: '7.4k–8.1k', inductance: '4.3H–5.1H' },
    images: { main: PHOTO('macho-heaven') },
    variants: [
      {
        id: 'macho-heaven-neck',
        slug: 'macho-heaven-neck',
        name: 'Macho Heaven · Neck',
        description:
          'Captures the sweetness and expressiveness of a classic PAF while eliminating the muddiness often found in traditional neck humbuckers. The voice is warm, open, and highly articulate, letting every note within complex chords stay distinct. The low end is tight and controlled while the midrange carries a vocal quality that enhances both clean and overdriven tones. Excels in Les Paul-style guitars where extra clarity and definition are desired.',
        seoDescription:
          'PAF-voiced neck humbucker: warm and open with a tight low end and a vocal midrange. Extra clarity and definition for Les Paul-style guitars.',
        type: 'humbucker',
        magnet: 'alnico-3',
        price: 140,
        positions: ['neck'],
        hardware: {
          spacingMm: 49.2,
          polepieces: PAF_POLEPIECES,
          bobbinColors: ['cream', 'white', 'black'],
          bobbins: PAF_BOBBINS,
          cover: COVER_OPTIONAL,
        },
        conductors: WIRE_BRAIDED,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '7.4k',
          inductance: '4.3H',
          selfResonantPeak: '6.8 kHz',
          loadedResonantPeak: '2.9 kHz',
        },
        images: { main: PHOTO('macho-heaven') },
      },
      {
        id: 'macho-heaven-bridge',
        slug: 'macho-heaven-bridge',
        name: 'Macho Heaven · Bridge',
        description:
          'Delivers classic PAF dynamics with slightly increased aggression and authority. Despite its vintage output level, it offers impressive articulation and punch, with a focused attack, balanced lows, and smooth highs. The response stays tight and controlled under gain, making it ideal for expressive blues, rock, and classic lead tones.',
        seoDescription:
          'PAF-voiced bridge humbucker with added punch and authority: focused attack, balanced lows and smooth highs that stay tight under gain.',
        type: 'humbucker',
        magnet: 'alnico-4',
        price: 140,
        positions: ['bridge'],
        hardware: {
          spacingMm: 49.2,
          polepieces: PAF_POLEPIECES,
          bobbinColors: ['cream', 'white', 'black'],
          bobbins: PAF_BOBBINS,
          cover: COVER_OPTIONAL,
        },
        conductors: WIRE_BRAIDED,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '8.1k',
          inductance: '5.1H',
          selfResonantPeak: '6.2 kHz',
          loadedResonantPeak: '2.6 kHz',
        },
        images: { main: PHOTO('macho-heaven') },
      },
    ],
  },
  {
    id: 'chow-chow',
    slug: 'chow-chow',
    name: 'Chow Chow',
    description:
      'An Alnico 2 PAF set with the unmistakable warmth and sweetness of the classic late-seventies voice. Rich mids, smooth highs, and natural compression make single notes bloom and chords stay full and balanced.',
    seoDescription:
      'Alnico 2 PAF humbucker set with late-seventies warmth: rich mids, smooth highs and natural compression that lets single notes bloom.',
    type: 'humbucker',
    magnet: 'alnico-2',
    price: 140,
    positions: ['neck', 'bridge'],
    hardware: {
      spacingMm: 49.2,
      polepieces: PAF_POLEPIECES,
      bobbinColors: ['cream', 'white', 'black'],
      bobbins: PAF_BOBBINS,
      cover: COVER_OPTIONAL,
    },
    conductors: WIRE_BRAIDED,
    potting: POTTING_OPTIONAL,
    specs: { dcr: '7.6k–8.3k', inductance: '4.4H–5.3H' },
    images: { main: PHOTO('chow-chow') },
    variants: [
      {
        id: 'chow-chow-neck',
        slug: 'chow-chow-neck',
        name: 'Chow Chow · Neck',
        description:
          'Delivers the unmistakable warmth and sweetness associated with classic Alnico 2 PAF designs. Rich mids, smooth highs, and natural compression create an expressive and musical response. Single notes bloom with harmonic complexity while chords remain full and balanced. Particularly well suited to vintage rock, blues, and melodic lead playing.',
        seoDescription:
          'Alnico 2 neck humbucker: warm, sweet and naturally compressed, with blooming single notes and full chords for vintage rock, blues and leads.',
        type: 'humbucker',
        magnet: 'alnico-2',
        price: 140,
        positions: ['neck'],
        hardware: {
          spacingMm: 49.2,
          polepieces: PAF_POLEPIECES,
          bobbinColors: ['cream', 'white', 'black'],
          bobbins: PAF_BOBBINS,
          cover: COVER_OPTIONAL,
        },
        conductors: WIRE_BRAIDED,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '7.6k',
          inductance: '4.4H',
          selfResonantPeak: '6.5 kHz',
          loadedResonantPeak: '3.0 kHz',
        },
        images: { main: PHOTO('chow-chow') },
      },
      {
        id: 'chow-chow-bridge',
        slug: 'chow-chow-bridge',
        name: 'Chow Chow · Bridge',
        description:
          'Expands on the classic Alnico 2 character with additional midrange presence and sustain. The tone is rich, smooth, and harmonically dense, delivering the iconic vintage rock sound of legendary late-seventies and early-eighties recordings. Dynamic and responsive, it cleans up beautifully with the guitar volume while staying powerful enough for soaring leads and punchy rhythm work.',
        seoDescription:
          'Alnico 2 bridge humbucker with extra midrange presence and sustain: the harmonically dense vintage rock voice that cleans up with the volume.',
        type: 'humbucker',
        magnet: 'alnico-2',
        price: 140,
        positions: ['bridge'],
        hardware: {
          spacingMm: 49.2,
          polepieces: PAF_POLEPIECES,
          bobbinColors: ['cream', 'white', 'black'],
          bobbins: PAF_BOBBINS,
          cover: COVER_OPTIONAL,
        },
        conductors: WIRE_BRAIDED,
        potting: POTTING_OPTIONAL,
        specs: {
          dcr: '8.3k',
          inductance: '5.3H',
          selfResonantPeak: '5.7 kHz',
          loadedResonantPeak: '2.6 kHz',
        },
        images: { main: PHOTO('chow-chow') },
      },
    ],
  },
  {
    id: 'rockroach',
    slug: 'rockroach',
    name: 'Rockroach',
    description:
      'A high-output rock bridge humbucker developed for classic hard rock and traditional metal. Its Alnico 5 magnet provides strong attack, tight bass, and excellent note definition; articulate highs and focused mids stay clear even under significant distortion — punchy for rhythm, cutting for lead.',
    seoDescription:
      'High-output Alnico 5 bridge humbucker for hard rock and metal: strong attack, tight bass and clear, focused mids that hold up under distortion.',
    type: 'humbucker',
    magnet: 'alnico-5',
    price: 125,
    positions: ['bridge'],
    hardware: {
      spacingMm: 52,
      polepieces: POLEPIECES_BLACK,
      cover: COVER_OPTIONAL,
      bobbinColors: STANDARD_BOBBIN_COLORS,
      bobbins: ROCKROACH_BOBBINS,
      sevenString: { colors: ['black'] },
    },
    conductors: WIRE_FOUR,
    potting: POTTING_FIXED,
    specs: {
      dcr: '12.2k',
      inductance: '5.9H',
      selfResonantPeak: '5.3 kHz',
      loadedResonantPeak: '2.4 kHz',
    },
    images: { main: PHOTO('rockroach') },
  },
  {
    id: 'karakonjul',
    slug: 'karakonjul',
    name: 'Karakonjul',
    description:
      'The most powerful pickup in the lineup, engineered for maximum impact without sacrificing articulation. The Alnico 8 magnet produces immense output, dense mids, and exceptionally tight lows while avoiding muddiness. Harmonics jump effortlessly off the strings, and coil-splitting reveals an unexpectedly balanced, clear voice.',
    seoDescription:
      'Our most powerful humbucker: an Alnico 8 bridge pickup with immense output, dense mids and tight lows that stay articulate. Splits cleanly, too.',
    type: 'humbucker',
    magnet: 'alnico-8',
    price: 125,
    positions: ['bridge'],
    hardware: {
      spacingMm: 52,
      polepieces: POLEPIECES_BLACK,
      cover: COVER_OPTIONAL,
      bobbinColors: ['black'],
      bobbins: KARAKONJUL_BOBBINS,
      sevenString: { colors: ['black'] },
    },
    conductors: WIRE_FOUR,
    potting: POTTING_FIXED,
    specs: {
      dcr: '17.9k',
      inductance: '8.8H',
      selfResonantPeak: '4.2 kHz',
      loadedResonantPeak: '1.8 kHz',
    },
    images: { main: PHOTO('karakonjul') },
  },
  {
    id: 'little-karakonjul',
    slug: 'little-karakonjul',
    name: 'Little Karakonjul',
    description:
      'A thicker winding wire gives this bridge humbucker a rare combination of low DCR and surprisingly strong output. Fast attack, pronounced harmonics, and exceptional clarity define its character — tight percussive bass, lively overtone-rich highs, and a bold voice far larger than its measured output suggests.',
    seoDescription:
      'Thick-wire Alnico 8 bridge humbucker: low DCR yet strong output, with fast attack, tight percussive bass and lively, overtone-rich highs.',
    type: 'humbucker',
    magnet: 'alnico-8',
    price: 140,
    positions: ['bridge'],
    hardware: {
      spacingMm: 52,
      polepieces: POLEPIECES_BLACK,
      cover: COVER_OPTIONAL,
      bobbinColors: STANDARD_BOBBIN_COLORS,
      bobbins: LITTLE_KARAKONJUL_BOBBINS,
      sevenString: { colors: ['black'] },
    },
    conductors: WIRE_FOUR,
    potting: POTTING_FIXED,
    specs: {
      dcr: '5.6k',
      inductance: '3.2H',
      selfResonantPeak: '7.4 kHz',
      loadedResonantPeak: '3.2 kHz',
    },
    images: { main: PHOTO('little-karakonjul') },
  },
  {
    id: 'twin-bliss',
    slug: 'twin-bliss',
    name: 'Twin Bliss',
    description:
      'A dual-magnet PAF humbucker using two smaller Alnico 5 bar magnets beneath the slug and screw rows rather than a single central magnet. The result is an exceptionally balanced frequency response: velvety cleans in the neck, articulate vintage tones with tight lows and sweet highs in the bridge. A versatile, classic-voiced all-rounder.',
    seoDescription:
      'Dual-magnet PAF humbucker with two Alnico 5 bars: velvety neck cleans, articulate vintage bridge tones and a balanced, classic all-round voice.',
    type: 'humbucker',
    magnet: 'alnico-5',
    price: 140,
    positions: ['neck', 'bridge'],
    hardware: {
      spacingMm: { options: [50, 52], defaultOption: 50 },
      polepieces: POLEPIECES_NICKEL,
      bobbinColors: STANDARD_BOBBIN_COLORS,
      bobbins: TWIN_BLISS_BOBBINS,
    },
    conductors: WIRE_FOUR,
    potting: POTTING_OPTIONAL,
    specs: {
      dcr: '7.4k',
      inductance: '4.0H',
      selfResonantPeak: '7.0 kHz',
      loadedResonantPeak: '3.2 kHz',
    },
    images: { main: PHOTO('twin-bliss') },
  },
];

export function getPickupBySlug(slug: string): Pickup | undefined {
  for (const pickup of pickups) {
    if (pickup.slug === slug) return pickup;
    if (pickup.variants !== undefined) {
      const variant = pickup.variants.find((v) => v.slug === slug);
      if (variant !== undefined) return variant;
    }
  }
  return undefined;
}

export interface PickupWithParent {
  readonly pickup: Pickup;
  readonly parent: Pickup;
}

export function getPickupAndParent(slug: string): PickupWithParent | undefined {
  for (const top of pickups) {
    if (top.slug === slug) return { pickup: top, parent: top };
    if (top.variants !== undefined) {
      const variant = top.variants.find((v) => v.slug === slug);
      if (variant !== undefined) return { pickup: variant, parent: top };
    }
  }
  return undefined;
}
