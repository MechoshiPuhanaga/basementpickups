import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { FaqIcon } from '../../design-system/atoms/FaqIcon';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { FAQ_ITEMS } from '../../data/faq';

export default function FaqPage() {
  return (
    <Section spacing="sm" maxWidth="narrow">
      <Stack direction="column" gap="xl" align="stretch">
        <Stack direction="column" gap="md" align="center">
          <Text variant="label" tone="gold" align="center">
            Questions &amp; answers
          </Text>
          <Heading level={1} variant="display" align="center">
            Good to know
          </Heading>
          <DecoSeparator variant="medallion" />
          <Text variant="lead" tone="muted" align="center">
            A few honest notes on how each pickup is made, measured, and what to expect when you
            order one.
          </Text>
        </Stack>

        <Stack direction="column" gap="xl" align="stretch">
          {FAQ_ITEMS.map((item) => (
            <Stack key={item.id} direction="column" gap="sm" align="start">
              <Stack direction="row" gap="sm" align="center">
                <FaqIcon name={item.icon} size={32} />
                <Heading level={2} variant="section">
                  {item.question}
                </Heading>
              </Stack>
              <Text variant="body" tone="muted">
                {item.answer}
              </Text>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Section>
  );
}
