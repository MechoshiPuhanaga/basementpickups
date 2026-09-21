import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { articles } from '../../../data/articles';
import { ArticleCard } from './ArticleCard';

const article = articles[0];
if (article === undefined) throw new Error('fixture: no articles');

describe('ArticleCard', () => {
  it('links to the article and shows headline, excerpt and meta', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>,
    );
    const card = screen.getByTestId(`article-card-${article.slug}`);
    expect(card.tagName).toBe('A');
    expect(card).toHaveAttribute('href', `/articles/${article.slug}`);
    expect(card).toHaveTextContent(article.headline);
    expect(card).toHaveTextContent(article.excerpt);
    expect(card).toHaveTextContent(/min read/);
  });

  it('accepts an explicit test id and a priority flag', () => {
    render(
      <MemoryRouter>
        <ArticleCard article={article} priority data-testid="card" />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('falls back to the raw date when it cannot be parsed', () => {
    const broken = { ...article, metadata: { ...article.metadata, publishedAt: 'not-a-date' } };
    render(
      <MemoryRouter>
        <ArticleCard article={broken} data-testid="card" />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('card')).toHaveTextContent('not-a-date');
  });
});
