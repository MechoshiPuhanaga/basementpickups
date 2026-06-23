import { useMemo, useState } from 'react';

import { Select } from '../../atoms/Select';
import { Text } from '../../atoms/Text';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import { FilterDisclosure } from '../../molecules/FilterDisclosure';
import { ProductGrid } from '../ProductGrid';
import type { Pickup, PickupMagnet, PickupType } from '../../../data/pickups';
import styles from './ProductBrowser.module.css';

export interface ProductBrowserProps {
  pickups: readonly Pickup[];
  className?: string | undefined;
}

type SortKey =
  | 'featured'
  | 'name'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'inductance-asc'
  | 'inductance-desc';
type MagnetFilter = 'all' | PickupMagnet;
type TypeFilter = 'all' | PickupType;

const SORT_LABEL: Record<SortKey, string> = {
  featured: 'Featured',
  name: 'Name (A–Z)',
  'name-desc': 'Name (Z–A)',
  'price-asc': 'Price (low to high)',
  'price-desc': 'Price (high to low)',
  'inductance-asc': 'Inductance (low to high)',
  'inductance-desc': 'Inductance (high to low)',
};

const TYPE_LABEL: Record<PickupType, string> = {
  humbucker: 'Humbucker',
  single: 'Single Coil',
  p90: 'P-90',
};

const TYPE_ORDER: readonly PickupType[] = ['humbucker', 'single', 'p90'];

const MAGNET_LABEL: Record<PickupMagnet, string> = {
  'alnico-2': 'Alnico 2',
  'alnico-3': 'Alnico 3',
  'alnico-4': 'Alnico 4',
  'alnico-5': 'Alnico 5',
  'alnico-8': 'Alnico 8',
  ceramic: 'Ceramic',
  neodymium: 'Neodymium',
};

const MAGNET_ORDER: readonly PickupMagnet[] = [
  'alnico-2',
  'alnico-3',
  'alnico-4',
  'alnico-5',
  'alnico-8',
  'ceramic',
  'neodymium',
];

/** Every magnet a model offers — its own plus any variant (neck/bridge) magnet. */
function magnetsOf(pickup: Pickup): readonly PickupMagnet[] {
  const set = new Set<PickupMagnet>([pickup.magnet]);
  for (const variant of pickup.variants ?? []) set.add(variant.magnet);
  return [...set];
}

/** Every type a model offers — its own plus any variant type. */
function typesOf(pickup: Pickup): readonly PickupType[] {
  const set = new Set<PickupType>([pickup.type]);
  for (const variant of pickup.variants ?? []) set.add(variant.type);
  return [...set];
}

/** First numeric value in an inductance string ("2.8H" or "2.8H–3.5H"). */
function parseInductance(value: string | undefined): number {
  if (value === undefined) return Number.POSITIVE_INFINITY;
  const match = /([\d.]+)/.exec(value);
  const num = match?.[1];
  return num !== undefined ? Number.parseFloat(num) : Number.POSITIVE_INFINITY;
}

export function ProductBrowser({ pickups, className }: ProductBrowserProps) {
  const [sort, setSort] = useState<SortKey>('featured');
  const [magnet, setMagnet] = useState<MagnetFilter>('all');
  const [type, setType] = useState<TypeFilter>('all');

  const availableMagnets = useMemo(() => {
    const set = new Set<PickupMagnet>();
    for (const pickup of pickups) {
      for (const value of magnetsOf(pickup)) set.add(value);
    }
    return MAGNET_ORDER.filter((value) => set.has(value));
  }, [pickups]);

  const availableTypes = useMemo(() => {
    const set = new Set<PickupType>();
    for (const pickup of pickups) {
      for (const value of typesOf(pickup)) set.add(value);
    }
    return TYPE_ORDER.filter((value) => set.has(value));
  }, [pickups]);

  const visible = useMemo(() => {
    const list = pickups.filter(
      (pickup) =>
        (magnet === 'all' || magnetsOf(pickup).includes(magnet)) &&
        (type === 'all' || typesOf(pickup).includes(type)),
    );
    const sorted = [...list];
    switch (sort) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'inductance-asc':
        sorted.sort(
          (a, b) => parseInductance(a.specs.inductance) - parseInductance(b.specs.inductance),
        );
        break;
      case 'inductance-desc':
        sorted.sort(
          (a, b) => parseInductance(b.specs.inductance) - parseInductance(a.specs.inductance),
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [pickups, sort, magnet, type]);

  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const activeFilters = [
    SORT_LABEL[sort],
    type !== 'all' ? TYPE_LABEL[type] : undefined,
    magnet !== 'all' ? MAGNET_LABEL[magnet] : undefined,
  ].filter((value): value is string => value !== undefined);

  return (
    <div className={classes}>
      <VisuallyHidden as="h2">All pickups</VisuallyHidden>
      <div className={styles['controls']}>
        <FilterDisclosure filters={activeFilters}>
          <div className={styles['fields']}>
            <label className={styles['field']}>
              <Text variant="label" tone="muted" as="span">
                Sort
              </Text>
              <Select
                selectSize="sm"
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortKey);
                }}
              >
                <option value="featured">Featured</option>
                <option value="name">Name (A–Z)</option>
                <option value="name-desc">Name (Z–A)</option>
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
                <option value="inductance-asc">Inductance (low to high)</option>
                <option value="inductance-desc">Inductance (high to low)</option>
              </Select>
            </label>
            <label className={styles['field']}>
              <Text variant="label" tone="muted" as="span">
                Type
              </Text>
              <Select
                selectSize="sm"
                value={type}
                onChange={(event) => {
                  setType(event.target.value as TypeFilter);
                }}
              >
                <option value="all">All types</option>
                {availableTypes.map((value) => (
                  <option key={value} value={value}>
                    {TYPE_LABEL[value]}
                  </option>
                ))}
              </Select>
            </label>
            <label className={styles['field']}>
              <Text variant="label" tone="muted" as="span">
                Magnet
              </Text>
              <Select
                selectSize="sm"
                value={magnet}
                onChange={(event) => {
                  setMagnet(event.target.value as MagnetFilter);
                }}
              >
                <option value="all">All magnets</option>
                {availableMagnets.map((value) => (
                  <option key={value} value={value}>
                    {MAGNET_LABEL[value]}
                  </option>
                ))}
              </Select>
            </label>
          </div>
        </FilterDisclosure>
        <div className={styles['count']} role="status" aria-live="polite">
          <Text variant="meta" tone="muted">
            {visible.length} {visible.length === 1 ? 'model' : 'models'}
          </Text>
        </div>
      </div>
      {visible.length > 0 ? (
        <ProductGrid pickups={visible} />
      ) : (
        <Text variant="editorial" tone="muted" align="center">
          No pickups match that magnet. Try a different filter.
        </Text>
      )}
    </div>
  );
}
