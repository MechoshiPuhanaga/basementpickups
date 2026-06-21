import { useParams } from 'react-router';

import { Button } from '../../design-system/atoms/Button';
import { Heading } from '../../design-system/atoms/Heading';
import { Image } from '../../design-system/atoms/Image';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { ArticleLayout } from '../../design-system/layouts/ArticleLayout';
import { Section } from '../../design-system/layouts/Section';
import { getArticleBySlug } from '../../data/articles';
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
      <Section spacing="lg" maxWidth="narrow">
        <Stack direction="column" gap="md" align="center">
          <Heading level={1} variant="display" align="center">
            Article not found
          </Heading>
          <Text variant="editorial" tone="muted" align="center">
            We couldn&rsquo;t find that article. Browse the latest writing from the workshop.
          </Text>
          <Button linkTo="/articles" variant="primary" size="md">
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

  return (
    <Section spacing="lg" maxWidth="default">
      <ArticleLayout
        hero={
          <div className={styles['heroWrap']}>
            <Image
              src={article.mainImage.src}
              alt={article.mainImage.alt}
              sizes="(max-width: 768px) 90vw, 720px"
              className={styles['hero']}
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
            <Text variant="label" tone="gold" align="center">
              {meta}
            </Text>
            <Heading level={1} variant="display" align="center">
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
    </Section>
  );
}
