import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { ProductBrowser } from '../../design-system/organisms/ProductBrowser';
import { pickups } from '../../data/pickups';

export default function ShopPage() {
  return (
    <Section spacing="sm" maxWidth="default">
      <Stack direction="column" gap="lg" align="stretch">
        <Stack direction="column" gap="md" align="center">
          <Text variant="label" tone="gold" align="center">
            Catalog
          </Text>
          <Heading level={1} variant="display" align="center">
            Shop Pickups
          </Heading>
          <DecoSeparator variant="medallion" />
          <Text variant="lead" tone="muted" align="center">
            Handwound humbuckers, each voiced for a specific musical character. Calibrated neck and
            bridge sets are noted where available.
          </Text>
        </Stack>
        <ProductBrowser pickups={pickups} />
      </Stack>
    </Section>
  );
}
