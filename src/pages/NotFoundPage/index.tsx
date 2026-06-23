import { Button } from '../../design-system/atoms/Button';
import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';

export default function NotFoundPage() {
  return (
    <Section spacing="xl" maxWidth="narrow">
      <Stack direction="column" gap="md" align="center">
        <Text variant="label" tone="gold" align="center">
          404
        </Text>
        <Heading level={1} variant="display" align="center">
          Off the bench
        </Heading>
        <DecoSeparator variant="medallion" />
        <Text variant="lead" tone="muted" align="center">
          The page you were looking for isn&rsquo;t here. It may have moved, or never existed. Take
          the workshop tour instead.
        </Text>
        <Stack direction="row" gap="md" justify="center" wrap>
          <Button linkTo="/" variant="primary" size="md">
            Return home
          </Button>
          <Button linkTo="/shop" variant="ghost" size="md">
            Shop pickups
          </Button>
        </Stack>
      </Stack>
    </Section>
  );
}
