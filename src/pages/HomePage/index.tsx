import { Section } from '../../design-system/layouts/Section';
import { ArticleGrid } from '../../design-system/organisms/ArticleGrid';
import { Hero } from '../../design-system/organisms/Hero';
import { ProductGrid } from '../../design-system/organisms/ProductGrid';
import { articles } from '../../data/articles';
import { pickups } from '../../data/pickups';

export default function HomePage() {
  const featured = pickups.slice(0, 3);
  const latest = articles.slice(0, 3);

  return (
    <>
      <Hero
        eyebrow="Basement Pickups"
        headline="Tone that's built different"
        lead="Handwound boutique pickups, voiced on the bench. Built for players who care where the magic comes from."
        primaryCta={{ label: 'Shop Pickups', href: '/shop' }}
        secondaryCta={{ label: 'Read the journal', href: '/articles' }}
        imageSrc="/assets/images/spirit-photos/bp-spirit-1.png"
        imageAlt="A handwound humbucker resting under warm workshop light"
        imagePosition="left"
      />
      <Section spacing="lg" maxWidth="default">
        <ProductGrid
          eyebrow="Featured"
          title="Built by hand"
          lead="A small, considered range. Wound by ear, voiced against a real rig."
          pickups={featured}
        />
      </Section>
      <Section spacing="lg" maxWidth="default">
        <ArticleGrid
          eyebrow="From the journal"
          title="On tone and craft"
          lead="Field notes on winding, magnets, and what actually moves a pickup."
          articles={latest}
        />
      </Section>
    </>
  );
}
