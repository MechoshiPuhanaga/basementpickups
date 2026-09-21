import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/routes';
import { articles } from '../../data/articles';

describe('ArticlesIndexPage', () => {
  it('renders the journal intro and the article browser', () => {
    render(
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/articles'] })} />,
    );
    expect(screen.getByTestId('articles-page').querySelector('h1')).toHaveTextContent('Articles');
    expect(screen.getByTestId('article-browser-count')).toHaveTextContent(
      `${String(articles.length)} articles`,
    );
    for (const article of articles) {
      expect(screen.getByTestId(`article-card-${article.slug}`)).toBeInTheDocument();
    }
  });
});
