export type BrandValueIcon = 'handwound' | 'materials' | 'tone' | 'workshop';

export interface BrandValue {
  readonly id: string;
  readonly icon: BrandValueIcon;
  readonly title: string;
  readonly description: string;
}

export const brandValues: readonly BrandValue[] = [
  {
    id: 'handwound',
    icon: 'handwound',
    title: 'Handwound In House',
    description:
      'Every coil is wound on the bench in our workshop. No contracted assembly, no shortcuts.',
  },
  {
    id: 'materials',
    icon: 'materials',
    title: 'Materials That Sing',
    description:
      'Aged Alnico magnets, plain-enamel magnet wire, cloth-braid lead — chosen for tone, not cost.',
  },
  {
    id: 'tone',
    icon: 'tone',
    title: 'Voiced By Ear',
    description:
      'Every pickup is auditioned against a reference rig before it leaves the bench. Spec sheets only tell part of the story.',
  },
];
