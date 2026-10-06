import { useParams } from 'react-router';

import { Button } from '../../design-system/atoms/Button';
import { Heading } from '../../design-system/atoms/Heading';
import { Image } from '../../design-system/atoms/Image';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { ArticleLayout } from '../../design-system/layouts/ArticleLayout';
import { Section } from '../../design-system/layouts/Section';
import { Breadcrumbs } from '../../design-system/molecules/Breadcrumbs';
import { ArticleGrid } from '../../design-system/organisms/ArticleGrid';
import { ProductGrid } from '../../design-system/organisms/ProductGrid';
import { articleCrumbs } from '../../seo/breadcrumbs';
import { articles, getArticleBySlug } from '../../data/articles';
import { getPickupBySlug, type Pickup } from '../../data/pickups';
import { formatReadingTime } from '../../utils/readingTime';
import styles from './ArticlePage.module.css';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

function paragraphsFromBody(body: string): readonly string[] {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export default function ArticlePage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const article = getArticleBySlug(slug);

  if (article === undefined) {
    return (
      <Section spacing="lg" maxWidth="narrow" data-testid="article-not-found">
        <Stack direction="column" gap="md" align="center">
          <Heading level={1} variant="display" align="center">
            Article not found
          </Heading>
          <Text variant="editorial" tone="muted" align="center">
            We couldn&rsquo;t find that article. Browse the latest writing from the workshop.
          </Text>
          <Button
            linkTo="/articles"
            variant="primary"
            size="md"
            data-testid="article-not-found-link"
          >
            Read articles
          </Button>
        </Stack>
      </Section>
    );
  }

  const meta = [
    formatDate(article.metadata.publishedAt),
    article.metadata.author,
    formatReadingTime(article.body),
  ]
    .filter((s): s is string => Boolean(s))
    .join(' · ');

  const paragraphs = paragraphsFromBody(article.body);

  const featured = article.relatedProducts
    .map((slug) => getPickupBySlug(slug))
    .filter((pickup): pickup is Pickup => pickup !== undefined);
  const otherArticles = articles.filter((a) => a.slug !== article.slug);
  const crumbs = articleCrumbs(article).map((crumb) => ({ label: crumb.name, to: crumb.path }));

  return (
    <Section spacing="lg" maxWidth="default" data-testid="article-page">
      <Stack direction="column" gap="xl" align="stretch">
        <Breadcrumbs items={crumbs} />
        <ArticleLayout
          data-testid="article"
          hero={
            <div className={styles['heroWrap']}>
              <Image
                src={article.mainImage.src}
                alt={article.mainImage.alt}
                width={article.mainImage.width}
                height={article.mainImage.height}
                sizes="(max-width: 768px) 90vw, 720px"
                priority
                className={styles['hero']}
                data-testid="article-hero-image"
              />
              {article.mainImage.caption !== undefined && (
                <Text variant="meta" tone="muted" align="center">
                  {article.mainImage.caption}
                </Text>
              )}
            </div>
          }
          header={
            <Stack direction="column" gap="md" align="center">
              <Text variant="label" tone="gold" align="center" data-testid="article-meta">
                {meta}
              </Text>
              <Heading level={1} variant="display" align="center" data-testid="article-headline">
                {article.headline}
              </Heading>
              {article.subheadline !== undefined && (
                <Text variant="lead" tone="muted" align="center">
                  {article.subheadline}
                </Text>
              )}
            </Stack>
          }
          body={
            <Stack direction="column" gap="md" align="stretch">
              {paragraphs.map((paragraph, i) => (
                <Text key={i} variant="body">
                  {paragraph}
                </Text>
              ))}
            </Stack>
          }
        />
        {featured.length > 0 && (
          <ProductGrid
            pickups={featured}
            eyebrow="From the shop"
            title="Pickups in this story"
            data-testid="article-pickups"
          />
        )}
        {otherArticles.length > 0 && (
          <ArticleGrid
            articles={otherArticles}
            eyebrow="Keep reading"
            title="Related articles"
            data-testid="article-related"
          />
        )}
        <Stack direction="column" align="center">
          <Button linkTo="/shop" variant="primary" size="md" data-testid="article-explore">
            Explore our pickups
          </Button>
        </Stack>
      </Stack>
    </Section>
  );
}
