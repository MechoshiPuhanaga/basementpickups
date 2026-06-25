import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Grid } from '../../design-system/atoms/Grid';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { BrandValueCard } from '../../design-system/molecules/BrandValueCard';
import { FramedImage } from '../../design-system/molecules/FramedImage';
import { brandValues } from '../../data/brandValues';

export default function AboutPage() {
  return (
    <>
      <Section spacing="sm" maxWidth="narrow">
        <Stack direction="column" gap="lg" align="stretch">
          <Stack direction="column" gap="md" align="center">
            <Text variant="label" tone="gold" align="center">
              The story
            </Text>
            <Heading level={1} variant="display" align="center">
              Passion for sound
            </Heading>
            <DecoSeparator variant="medallion" />
            <Text variant="lead" tone="muted" align="center">
              Basement Pickups is the offspring of my lifelong love and passion for rock music and
              the fascinating sound of the electric guitar.
            </Text>
          </Stack>
          <Stack direction="column" gap="md" align="start">
            <Text variant="body">
              At an early age, I was introduced to the songs of The Beatles, Smokey, Santana, and
              Jimi Hendrix by my mother and my uncle. Rock music and playing guitar became my refuge
              during my teenage years. I still remember turning the volume to the maximum and
              pressing the headphones to my ears, listening to Accept, Iron Maiden, and Judas
              Priest. The roar of the galloping rhythm guitars and the soaring heights of the lead
              axes were my dream space &ndash; my meditation.
            </Text>
            <Text variant="body">
              Decades later, my journey as a chemical engineer, copywriter, web developer and a
              living room guitarist culminated in my hobby of creating electric guitar pickups.
              It&rsquo;s something that comes from deep within my soul &ndash; and my home basement
              &ndash; that I sincerely want to share with you.
            </Text>
            <Stack direction="column" gap="none" align="start">
              <Text variant="lead" tone="primary" italic>
                Roumen Kirov
              </Text>
              <Text variant="label" tone="gold">
                Founder
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Section>
      <Section spacing="md" maxWidth="narrow">
        <FramedImage
          src="/assets/images/spirit-photos/bp-spirit-2.png"
          alt="A guitar resting in the workshop under warm, low light"
          ratio="landscape"
        />
      </Section>
      <Section spacing="lg" maxWidth="default">
        <Stack direction="column" gap="xl" align="stretch">
          <Stack direction="column" gap="md" align="center">
            <Text variant="label" tone="gold" align="center">
              What we stand for
            </Text>
            <Heading level={2} variant="display" align="center">
              Three quiet rules
            </Heading>
          </Stack>
          <Grid columns={3} gap="xl" align="start">
            {brandValues.map((value) => (
              <BrandValueCard key={value.id} value={value} />
            ))}
          </Grid>
        </Stack>
      </Section>
    </>
  );
}
