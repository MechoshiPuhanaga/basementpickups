export type PickupType = 'humbucker' | 'single' | 'p90';

export type PickupMagnet =
  | 'alnico-2'
  | 'alnico-3'
  | 'alnico-4'
  | 'alnico-5'
  | 'alnico-8'
  | 'ceramic'
  | 'neodymium';

export type PickupPosition = 'neck' | 'middle' | 'bridge';

export type PickupConductor = 'vintage-braided' | '2-conductor' | '4-conductor';

export type PickupPotting = 'potted' | 'unpotted' | 'optional';

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

export interface Pickup {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly type: PickupType;
  readonly magnet: PickupMagnet;
  readonly price: number;
  readonly positions: readonly PickupPosition[];
  readonly colors: readonly string[];
  readonly conductors: readonly PickupConductor[];
  readonly potting: PickupPotting;
  readonly specs: PickupSpecs;
  readonly images: PickupImages;
  readonly variants?: readonly Pickup[];
}

const PHOTO = (slug: string): string => `/assets/images/product-photos/${slug}.png`;

export const pickups: readonly Pickup[] = [
  {
    id: 'white-pearl',
    slug: 'white-pearl',
    name: 'White Pearl',
    description:
      'A Strat-style humbucker set built for clarity, openness, and articulation. Airy top end, controlled lows, and a balanced, musical voice that rewards picking dynamics and the volume knob.',
    type: 'humbucker',
    magnet: 'alnico-4',
    price: 125,
    positions: ['neck', 'bridge'],
    colors: ['cream', 'parchment', 'aged-white'],
    conductors: ['vintage-braided', '4-conductor'],
    potting: 'optional',
    specs: { dcr: '5.9k–6.8k', inductance: '2.8H–3.5H' },
    images: { main: PHOTO('white-pearl') },
    variants: [
      {
        id: 'white-pearl-neck',
        slug: 'white-pearl-neck',
        name: 'White Pearl · Neck',
        description:
          'Designed for players seeking maximum clarity, openness, and articulation from a humbucker-equipped Strat-style guitar. Its relatively low inductance and high resonant frequency create an airy top end with excellent note separation and dynamic response. Clean tones stay sparkling and detailed; overdriven sounds reveal complex harmonic content without becoming harsh. The bass response is intentionally controlled and tight, avoiding the boominess often associated with neck humbuckers.',
        type: 'humbucker',
        magnet: 'alnico-3',
        price: 125,
        positions: ['neck'],
        colors: ['cream', 'parchment', 'aged-white'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
        type: 'humbucker',
        magnet: 'alnico-4',
        price: 125,
        positions: ['bridge'],
        colors: ['cream', 'parchment', 'aged-white'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
    type: 'humbucker',
    magnet: 'alnico-4',
    price: 140,
    positions: ['neck', 'bridge'],
    colors: ['gold-cover', 'nickel', 'aged-nickel'],
    conductors: ['vintage-braided', '4-conductor'],
    potting: 'optional',
    specs: { dcr: '7.4k–8.1k', inductance: '4.3H–5.1H' },
    images: { main: PHOTO('macho-heaven') },
    variants: [
      {
        id: 'macho-heaven-neck',
        slug: 'macho-heaven-neck',
        name: 'Macho Heaven · Neck',
        description:
          'Captures the sweetness and expressiveness of a classic PAF while eliminating the muddiness often found in traditional neck humbuckers. The voice is warm, open, and highly articulate, letting every note within complex chords stay distinct. The low end is tight and controlled while the midrange carries a vocal quality that enhances both clean and overdriven tones. Excels in Les Paul-style guitars where extra clarity and definition are desired.',
        type: 'humbucker',
        magnet: 'alnico-3',
        price: 140,
        positions: ['neck'],
        colors: ['gold-cover', 'nickel', 'aged-nickel'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
        type: 'humbucker',
        magnet: 'alnico-4',
        price: 140,
        positions: ['bridge'],
        colors: ['gold-cover', 'nickel', 'aged-nickel'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
    type: 'humbucker',
    magnet: 'alnico-2',
    price: 140,
    positions: ['neck', 'bridge'],
    colors: ['nickel', 'black', 'zebra'],
    conductors: ['vintage-braided', '4-conductor'],
    potting: 'optional',
    specs: { dcr: '7.6k–8.3k', inductance: '4.4H–5.3H' },
    images: { main: PHOTO('chow-chow') },
    variants: [
      {
        id: 'chow-chow-neck',
        slug: 'chow-chow-neck',
        name: 'Chow Chow · Neck',
        description:
          'Delivers the unmistakable warmth and sweetness associated with classic Alnico 2 PAF designs. Rich mids, smooth highs, and natural compression create an expressive and musical response. Single notes bloom with harmonic complexity while chords remain full and balanced. Particularly well suited to vintage rock, blues, and melodic lead playing.',
        type: 'humbucker',
        magnet: 'alnico-2',
        price: 140,
        positions: ['neck'],
        colors: ['nickel', 'black', 'zebra'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
        type: 'humbucker',
        magnet: 'alnico-2',
        price: 140,
        positions: ['bridge'],
        colors: ['nickel', 'black', 'zebra'],
        conductors: ['vintage-braided', '4-conductor'],
        potting: 'optional',
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
    type: 'humbucker',
    magnet: 'alnico-5',
    price: 125,
    positions: ['bridge'],
    colors: ['black', 'nickel'],
    conductors: ['4-conductor'],
    potting: 'potted',
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
    type: 'humbucker',
    magnet: 'alnico-8',
    price: 125,
    positions: ['bridge'],
    colors: ['black', 'gold-cover'],
    conductors: ['4-conductor'],
    potting: 'potted',
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
    type: 'humbucker',
    magnet: 'alnico-8',
    price: 140,
    positions: ['bridge'],
    colors: ['black', 'nickel'],
    conductors: ['4-conductor'],
    potting: 'potted',
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
    type: 'humbucker',
    magnet: 'alnico-5',
    price: 140,
    positions: ['neck', 'bridge'],
    colors: ['aged-nickel', 'gold-cover', 'zebra'],
    conductors: ['vintage-braided', '4-conductor'],
    potting: 'optional',
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
