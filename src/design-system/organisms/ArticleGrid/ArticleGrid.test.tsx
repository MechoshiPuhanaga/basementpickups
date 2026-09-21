import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { articles } from '../../../data/articles';
import { ArticleGrid } from './ArticleGrid';

describe('ArticleGrid', () => {
  it('renders a card per article without a header by default', () => {
    render(
      <MemoryRouter>
        <ArticleGrid articles={articles.slice(0, 2)} />
      </MemoryRouter>,
    );
    const grid = screen.getByTestId('article-grid');
    expect(grid.querySelectorAll('[data-testid^="article-card-"]')).toHaveLength(2);
    expect(grid.querySelector('h2')).toBeNull();
  });

  it('renders eyebrow, title and lead when given and prioritises the first card', () => {
    render(
      <MemoryRouter>
        <ArticleGrid
          articles={articles.slice(0, 2)}
          eyebrow="Journal"
          title="On tone"
          lead="Notes"
          columns={2}
          priorityFirst
          data-testid="ag"
        />
      </MemoryRouter>,
    );
    const grid = screen.getByTestId('ag');
    expect(grid).toHaveTextContent('Journal');
    expect(grid.querySelector('h2')).toHaveTextContent('On tone');
    expect(grid).toHaveTextContent('Notes');
    const imgs = grid.querySelectorAll('img');
    expect(imgs[0]).toHaveAttribute('loading', 'eager');
    expect(imgs[1]).toHaveAttribute('loading', 'lazy');
  });
});
