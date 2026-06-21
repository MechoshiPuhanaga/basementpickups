import { useMemo, useState } from 'react';

import { Select } from '../../atoms/Select';
import { Text } from '../../atoms/Text';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import { ArticleGrid } from '../ArticleGrid';
import type { Article } from '../../../data/articles';
import styles from './ArticleBrowser.module.css';

export interface ArticleBrowserProps {
  articles: readonly Article[];
  className?: string | undefined;
}

type SortKey = 'newest' | 'oldest';

function publishedTime(article: Article): number {
  const time = Date.parse(article.metadata.publishedAt);
  return Number.isNaN(time) ? 0 : time;
}

export function ArticleBrowser({ articles, className }: ArticleBrowserProps) {
  const [sort, setSort] = useState<SortKey>('newest');
  const [keyword, setKeyword] = useState<string>('all');

  const availableKeywords = useMemo(() => {
    const set = new Set<string>();
    for (const article of articles) {
      for (const value of article.keywords) set.add(value);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [articles]);

  const visible = useMemo(() => {
    const list = articles.filter(
      (article) => keyword === 'all' || article.keywords.includes(keyword),
    );
    return [...list].sort((a, b) =>
      sort === 'newest' ? publishedTime(b) - publishedTime(a) : publishedTime(a) - publishedTime(b),
    );
  }, [articles, sort, keyword]);

  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <VisuallyHidden as="h2">All articles</VisuallyHidden>
      <div className={styles['controls']}>
        <div className={styles['fields']}>
          <label className={styles['field']}>
            <Text variant="label" tone="muted" as="span">
              Sort
            </Text>
            <Select
              selectSize="sm"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as SortKey);
              }}
            >
              <option value="newest">Date (newest first)</option>
              <option value="oldest">Date (oldest first)</option>
            </Select>
          </label>
          <label className={styles['field']}>
            <Text variant="label" tone="muted" as="span">
              Topic
            </Text>
            <Select
              selectSize="sm"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
              }}
            >
              <option value="all">All topics</option>
              {availableKeywords.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <div className={styles['count']} role="status" aria-live="polite">
          <Text variant="meta" tone="muted">
            {visible.length} {visible.length === 1 ? 'article' : 'articles'}
          </Text>
        </div>
      </div>
      {visible.length > 0 ? (
        <ArticleGrid articles={visible} />
      ) : (
        <Text variant="editorial" tone="muted" align="center">
          No articles match that topic. Try another.
        </Text>
      )}
    </div>
  );
}
