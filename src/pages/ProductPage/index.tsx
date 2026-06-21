import { useParams } from 'react-router';

import { Badge } from '../../design-system/atoms/Badge';
import { Button } from '../../design-system/atoms/Button';
import { Heading } from '../../design-system/atoms/Heading';
import { Price } from '../../design-system/atoms/Price';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { ProductLayout } from '../../design-system/layouts/ProductLayout';
import { Section } from '../../design-system/layouts/Section';
import { ProductGallery } from '../../design-system/molecules/ProductGallery';
import { useCart } from '../../cart/CartContext';
import {
  getPickupAndParent,
  type Pickup,
  type PickupMagnet,
  type PickupPosition,
  type PickupType,
} from '../../data/pickups';
import styles from './ProductPage.module.css';

const TYPE_LABEL: Record<PickupType, string> = {
  humbucker: 'Humbucker',
  single: 'Single Coil',
  p90: 'P-90',
};

const MAGNET_LABEL: Record<PickupMagnet, string> = {
  'alnico-2': 'Alnico 2',
  'alnico-3': 'Alnico 3',
  'alnico-4': 'Alnico 4',
  'alnico-5': 'Alnico 5',
  'alnico-8': 'Alnico 8',
  ceramic: 'Ceramic',
  neodymium: 'Neodymium',
};

const POSITION_ORDER: readonly PickupPosition[] = ['neck', 'middle', 'bridge'];

/**
 * On the base (parent) view, if the calibrated neck/bridge variants use
 * different magnets, list them per position (e.g. "Alnico 3 (neck) · Alnico 4
 * (bridge)"). Otherwise show the single magnet.
 */
function formatMagnet(active: Pickup, parent: Pickup): string {
  const isBase = active.slug === parent.slug;
  const variants = parent.variants ?? [];

  if (isBase && variants.length > 0) {
    const positional = variants
      .map((variant) => ({
        magnet: variant.magnet,
        position: variant.positions.length === 1 ? variant.positions[0] : undefined,
      }))
      .filter(
        (entry): entry is { magnet: PickupMagnet; position: PickupPosition } =>
          entry.position !== undefined,
      );

    const distinctMagnets = new Set(positional.map((entry) => entry.magnet));

    if (positional.length > 0 && distinctMagnets.size > 1) {
      return positional
        .slice()
        .sort((a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position))
        .map((entry) => `${MAGNET_LABEL[entry.magnet]} (${entry.position})`)
        .join(' · ');
    }
  }

  return MAGNET_LABEL[active.magnet];
}

function buildGalleryImages(pickup: Pickup) {
  const main = { src: pickup.images.main, alt: pickup.name };
  const extras = (pickup.images.gallery ?? []).map((src) => ({
    src,
    alt: pickup.name,
  }));
  return [main, ...extras];
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles['specRow']}>
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <Text variant="body">{value}</Text>
    </div>
  );
}

interface VariantSelectorProps {
  parent: Pickup;
  active: Pickup;
}

function VariantSelector({ parent, active }: VariantSelectorProps) {
  if (parent.variants === undefined || parent.variants.length === 0) return null;
  const options: readonly Pickup[] = [parent, ...parent.variants];

  return (
    <Stack direction="column" gap="sm" align="stretch">
      <Heading level={2} variant="section">
        Variants
      </Heading>
      <div className={styles['variantRow']}>
        {options.map((option) => {
          const isActive = option.slug === active.slug;
          return (
            <Button
              key={option.slug}
              linkTo={`/products/${option.slug}`}
              variant={isActive ? 'primary' : 'ghost'}
              size="sm"
            >
              {option.slug === parent.slug ? 'Base' : option.name.replace(`${parent.name} · `, '')}
            </Button>
          );
        })}
      </div>
    </Stack>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const cart = useCart();
  const found = getPickupAndParent(slug);

  if (found === undefined) {
    return (
      <Section spacing="lg" maxWidth="narrow">
        <Stack direction="column" gap="md" align="center">
          <Heading level={1} variant="display" align="center">
            Pickup not found
          </Heading>
          <Text variant="editorial" tone="muted" align="center">
            We couldn&rsquo;t find a pickup matching that URL. Try the shop.
          </Text>
          <Button linkTo="/shop" variant="primary" size="md">
            Shop pickups
          </Button>
        </Stack>
      </Section>
    );
  }

  const { pickup, parent } = found;
  const images = buildGalleryImages(pickup);
  const inEnquiry = cart.items.find((i) => i.slug === pickup.slug)?.qty ?? 0;
  // The base view of a set (neck + bridge variants) is ambiguous — the buyer
  // must choose a position before it can go into the enquiry.
  const isBaseWithVariants = pickup.slug === parent.slug && (parent.variants?.length ?? 0) > 0;

  return (
    <Section spacing="lg" maxWidth="default">
      <ProductLayout
        gallery={<ProductGallery images={images} productName={pickup.name} />}
        details={
          <Stack direction="column" gap="lg" align="stretch">
            <Stack direction="column" gap="xs" align="start">
              <Text variant="label" tone="gold">
                {TYPE_LABEL[pickup.type]}
              </Text>
              <Heading level={1} variant="display" align="start">
                {pickup.name}
              </Heading>
              <Price amount={pickup.price} size="lg" tone="primary" />
            </Stack>
            <Text variant="body">{pickup.description}</Text>
            <Stack direction="row" gap="xs" wrap>
              {pickup.positions.map((position) => (
                <Badge key={position} variant="outline" tone="gold" size="sm">
                  {position}
                </Badge>
              ))}
            </Stack>
            <VariantSelector parent={parent} active={pickup} />
            <Stack direction="column" gap="sm" align="stretch">
              <Heading level={2} variant="section">
                Specifications
              </Heading>
              <div className={styles['specs']}>
                <SpecRow label="Type" value={TYPE_LABEL[pickup.type]} />
                <SpecRow label="Magnet" value={formatMagnet(pickup, parent)} />
                <SpecRow label="Positions" value={pickup.positions.join(', ')} />
                <SpecRow label="Conductors" value={pickup.conductors.join(', ')} />
                <SpecRow label="Potting" value={pickup.potting} />
                {pickup.specs.dcr !== undefined && <SpecRow label="DCR" value={pickup.specs.dcr} />}
                {pickup.specs.inductance !== undefined && (
                  <SpecRow label="Inductance" value={pickup.specs.inductance} />
                )}
                {pickup.specs.selfResonantPeak !== undefined && (
                  <SpecRow label="Self-resonant peak" value={pickup.specs.selfResonantPeak} />
                )}
                {pickup.specs.loadedResonantPeak !== undefined && (
                  <SpecRow label="Loaded resonant peak" value={pickup.specs.loadedResonantPeak} />
                )}
                <SpecRow label="Colors" value={pickup.colors.join(', ')} />
              </div>
            </Stack>
            {isBaseWithVariants ? (
              <Text variant="meta" tone="muted">
                Choose a position (neck or bridge) above to add it to your enquiry.
              </Text>
            ) : (
              <Button
                variant="solid"
                size="lg"
                onClick={() => {
                  cart.add({
                    slug: pickup.slug,
                    name: pickup.name,
                    price: pickup.price,
                  });
                }}
              >
                {inEnquiry > 0 ? `Added to enquiry (${String(inEnquiry)})` : 'Add to enquiry'}
              </Button>
            )}
          </Stack>
        }
      />
    </Section>
  );
}
