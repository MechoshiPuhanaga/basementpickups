import { Link } from 'react-router';

import { Heading } from '../../atoms/Heading';
import { Image } from '../../atoms/Image';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import type { Article } from '../../../data/articles';
import { formatReadingTime } from '../../../utils/readingTime';
import styles from './ArticleCard.module.css';

export interface ArticleCardProps {
  article: Article;
  className?: string | undefined;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

function formatPublishedAt(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return dateFormatter.format(date);
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const dateLabel = formatPublishedAt(article.metadata.publishedAt);
  const metaLabel = `${dateLabel} · ${formatReadingTime(article.body)}`;

  return (
    <Link
      to={`/articles/${article.slug}`}
      className={classes}
      aria-label={`${article.headline} — read article`}
    >
      <Stack direction="column" gap="md" align="stretch">
        <div className={styles['imageWrap']}>
          <Image
            src={article.mainImage.src}
            alt=""
            sizes="(max-width: 768px) 90vw, 33vw"
            className={styles['image']}
          />
        </div>
        <Stack direction="column" gap="xs">
          <Text variant="label" tone="muted">
            {metaLabel}
          </Text>
          <Heading level={3} variant="editorial">
            {article.headline}
          </Heading>
          <Text variant="editorial" tone="muted">
            {article.excerpt}
          </Text>
        </Stack>
      </Stack>
    </Link>
  );
}
