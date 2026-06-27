import { useState } from 'react';
import { useParams } from 'react-router';

import { Badge } from '../../design-system/atoms/Badge';
import { Button } from '../../design-system/atoms/Button';
import { Heading } from '../../design-system/atoms/Heading';
import { Price } from '../../design-system/atoms/Price';
import { Stack } from '../../design-system/atoms/Stack';
import { Swatch } from '../../design-system/atoms/Swatch';
import { Text } from '../../design-system/atoms/Text';
import { ProductLayout } from '../../design-system/layouts/ProductLayout';
import { Section } from '../../design-system/layouts/Section';
import { BobbinConfigurator } from '../../design-system/molecules/BobbinConfigurator';
import { Disclosure } from '../../design-system/molecules/Disclosure';
import { ProductGallery } from '../../design-system/molecules/ProductGallery';
import { useCart } from '../../cart/CartContext';
import { bobbinColorLabel } from '../../data/bobbinColors';
import { availableBobbinColors, cartLineKey, type BobbinSelection } from '../../data/bobbins';
import {
  getPickupAndParent,
  type Pickup,
  type PickupCover,
  type PickupMagnet,
  type PickupPolepiece,
  type PickupPosition,
  type PickupSevenString,
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

const POLEPIECE_LABEL: Record<PickupPolepiece, string> = {
  chrome: 'Chrome',
  black: 'Black',
  nickel: 'Nickel',
  gold: 'Gold',
};

function formatSpacing(mm: number | readonly number[]): string {
  const values: readonly number[] = typeof mm === 'number' ? [mm] : mm;
  return `${values.map((n) => (Number.isInteger(n) ? String(n) : n.toFixed(1))).join(' or ')} mm`;
}

function formatCover(cover: PickupCover | undefined): string {
  if (cover === undefined) return 'None';
  const material = cover.material.charAt(0).toUpperCase() + cover.material.slice(1);
  return cover.optional ? `${material} (optional)` : material;
}

function formatSevenString(sevenString: PickupSevenString | undefined): string | undefined {
  if (sevenString === undefined) return undefined;
  return `Available (${sevenString.colors.map(bobbinColorLabel).join(', ').toLowerCase()} only)`;
}

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

/**
 * Like {@link formatMagnet}: on the base view of a set, show string spacing per
 * position (e.g. "50 mm (neck) · 52 mm (bridge)") when the variants differ, or a
 * single value when they match. Variant/single pages show their own spacing.
 * Returns undefined when no spacing is known.
 */
function formatSpacingRow(active: Pickup, parent: Pickup): string | undefined {
  const isBase = active.slug === parent.slug;
  const variants = parent.variants ?? [];

  if (isBase && variants.length > 0) {
    const positional = variants
      .map((variant) => ({
        spacing: variant.hardware.spacingMm,
        position: variant.positions.length === 1 ? variant.positions[0] : undefined,
      }))
      .filter(
        (entry): entry is { spacing: number | readonly number[]; position: PickupPosition } =>
          entry.position !== undefined && entry.spacing !== undefined,
      );

    const first = positional[0];
    if (first !== undefined) {
      const distinct = new Set(positional.map((entry) => formatSpacing(entry.spacing)));
      if (distinct.size > 1) {
        return positional
          .slice()
          .sort((a, b) => POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position))
          .map((entry) => `${formatSpacing(entry.spacing)} (${entry.position})`)
          .join(' · ');
      }
      return formatSpacing(first.spacing);
    }
  }

  return active.hardware.spacingMm !== undefined
    ? formatSpacing(active.hardware.spacingMm)
    : undefined;
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

function SwatchRow({ label, colors }: { label: string; colors: readonly string[] }) {
  return (
    <div className={styles['specRow']}>
      <Text variant="label" tone="muted">
        {label}
      </Text>
      <Stack direction="row" gap="xs" wrap>
        {colors.map((color) => (
          <Swatch key={color} color={color} label={bobbinColorLabel(color)} size="sm" />
        ))}
      </Stack>
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
  const isBase = active.slug === parent.slug;

  return (
    <Stack direction="column" gap="sm" align="stretch">
      <Heading level={2} variant="section">
        Variants
      </Heading>
      {isBase && (
        <Text variant="meta" tone="muted">
          Choose a position (neck or bridge) to add it to your enquiry.
        </Text>
      )}
      <div className={styles['variantRow']}>
        {options.map((option) => {
          const isActive = option.slug === active.slug;
          return (
            <Button
              key={option.slug}
              linkTo={`/products/${option.slug}`}
              linkState={{ preserveScroll: true }}
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

/**
 * Bobbin configuration + the Add-to-enquiry button for an addable pickup. Owns
 * the colour selection (seeded from each bobbin's default); rendered with a
 * `key={slug}` so switching variants reseeds to the new pickup's defaults. The
 * "Configure" section only appears when at least one bobbin offers a choice; the
 * chosen colours travel onto the cart line either way (so emails list them).
 */
function AddToEnquiry({ pickup }: { pickup: Pickup }) {
  const cart = useCart();
  const bobbins = pickup.hardware.bobbins;
  const [selection, setSelection] = useState<BobbinSelection>(() =>
    bobbins === undefined
      ? {}
      : Object.fromEntries(bobbins.map((bobbin) => [bobbin.id, bobbin.defaultColor])),
  );
  // Only offer the Configure section when at least one bobbin has a real choice.
  const choosableBobbins = (bobbins ?? []).some((bobbin) => bobbin.palette.length > 1)
    ? bobbins
    : undefined;
  const lineId = cartLineKey(pickup.slug, bobbins !== undefined ? selection : undefined);
  const inEnquiry = cart.items.find((item) => item.id === lineId)?.qty ?? 0;

  return (
    <>
      {choosableBobbins !== undefined && (
        <Disclosure title="Configure" desktop="heading" headingLevel={2}>
          <BobbinConfigurator
            bobbins={choosableBobbins}
            value={selection}
            onChange={(bobbinId, color) => {
              setSelection((prev) => ({ ...prev, [bobbinId]: color }));
            }}
          />
        </Disclosure>
      )}
      <Button
        variant="solid"
        size="lg"
        onClick={() => {
          cart.add({
            slug: pickup.slug,
            name: pickup.name,
            price: pickup.price,
            ...(bobbins !== undefined ? { config: selection } : {}),
          });
        }}
      >
        {inEnquiry > 0 ? `Added to enquiry (${String(inEnquiry)})` : 'Add to enquiry'}
      </Button>
    </>
  );
}

export default function ProductPage() {
  const { slug = '' } = useParams<{ slug: string }>();
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
  const sevenStringLabel = formatSevenString(pickup.hardware.sevenString);
  const spacingRow = formatSpacingRow(pickup, parent);
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
              <Stack direction="row" gap="sm" align="center" wrap>
                <Price amount={pickup.price} size="lg" tone="primary" />
                <Stack direction="row" gap="xs" wrap>
                  {pickup.positions.map((position) => (
                    <Badge key={position} variant="outline" tone="gold" size="sm">
                      {position}
                    </Badge>
                  ))}
                </Stack>
              </Stack>
            </Stack>
            <Text variant="body">{pickup.description}</Text>
            <VariantSelector parent={parent} active={pickup} />
            <Disclosure title="Specifications" desktop="heading" headingLevel={2}>
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
                {spacingRow !== undefined && <SpecRow label="String spacing" value={spacingRow} />}
                <SpecRow label="Pole pieces" value={POLEPIECE_LABEL[pickup.hardware.polepieces]} />
                <SpecRow label="Cover" value={formatCover(pickup.hardware.cover)} />
                {sevenStringLabel !== undefined && (
                  <SpecRow label="7-string" value={sevenStringLabel} />
                )}
                <SwatchRow label="Bobbin colours" colors={availableBobbinColors(pickup.hardware)} />
              </div>
            </Disclosure>
            {!isBaseWithVariants && <AddToEnquiry pickup={pickup} key={pickup.slug} />}
          </Stack>
        }
      />
    </Section>
  );
}
