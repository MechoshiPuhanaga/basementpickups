import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { ArticleBrowser } from '../../design-system/organisms/ArticleBrowser';
import { articles } from '../../data/articles';

export default function ArticlesIndexPage() {
  return (
    <Section spacing="lg" maxWidth="default">
      <Stack direction="column" gap="xl" align="stretch">
        <Stack direction="column" gap="xs" align="center">
          <Text variant="label" tone="gold" align="center">
            The journal
          </Text>
          <Heading level={1} variant="display" align="center">
            Articles
          </Heading>
          <DecoSeparator variant="medallion" />
          <Text variant="lead" tone="muted" align="center">
            Notes from the bench on winding, magnets, tone, and the work that doesn&rsquo;t make it
            into spec sheets.
          </Text>
        </Stack>
        <ArticleBrowser articles={articles} />
      </Stack>
    </Section>
  );
}
