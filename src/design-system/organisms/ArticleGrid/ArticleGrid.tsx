import { Grid, type GridColumns } from '../../atoms/Grid';
import { Heading } from '../../atoms/Heading';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import { ArticleCard } from '../../molecules/ArticleCard';
import type { Article } from '../../../data/articles';
import styles from './ArticleGrid.module.css';

export interface ArticleGridProps {
  articles: readonly Article[];
  eyebrow?: string | undefined;
  title?: string | undefined;
  lead?: string | undefined;
  columns?: GridColumns | undefined;
  className?: string | undefined;
}

export function ArticleGrid({
  articles,
  eyebrow,
  title,
  lead,
  columns = 3,
  className,
}: ArticleGridProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const hasHeader = eyebrow !== undefined || title !== undefined || lead !== undefined;

  return (
    <section className={classes}>
      <Stack direction="column" gap="xl" align="stretch">
        {hasHeader && (
          <Stack direction="column" gap="xs" align="center" className={styles['header']}>
            {eyebrow !== undefined && (
              <Text variant="label" tone="gold" align="center">
                {eyebrow}
              </Text>
            )}
            {title !== undefined && (
              <Heading level={2} variant="display" align="center">
                {title}
              </Heading>
            )}
            {lead !== undefined && (
              <Text variant="lead" tone="muted" align="center">
                {lead}
              </Text>
            )}
          </Stack>
        )}
        <Grid columns={columns} gap="xl" align="start">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      </Stack>
    </section>
  );
}
