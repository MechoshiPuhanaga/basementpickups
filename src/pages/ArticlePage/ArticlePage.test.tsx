import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/routes';
import { articles } from '../../data/articles';

const withCaption = articles.find((a) => a.mainImage.caption !== undefined);
if (withCaption === undefined) throw new Error('fixture');

function renderArticle(slug: string) {
  render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [`/articles/${slug}`] })}
    />,
  );
}

describe('ArticlePage', () => {
  it('renders hero image, caption, meta line, headline, subheadline and paragraphs', () => {
    renderArticle(withCaption.slug);
    expect(screen.getByTestId('article-page')).toBeInTheDocument();
    expect(screen.getByTestId('article-headline')).toHaveTextContent(withCaption.headline);
    expect(screen.getByTestId('article-hero')).toHaveTextContent(
      withCaption.mainImage.caption ?? '',
    );
    const meta = screen.getByTestId('article-meta');
    expect(meta).toHaveTextContent(/min read/);
    if (withCaption.metadata.author !== undefined) {
      expect(meta).toHaveTextContent(withCaption.metadata.author);
    }
    if (withCaption.subheadline !== undefined) {
      expect(screen.getByTestId('article-header')).toHaveTextContent(withCaption.subheadline);
    }
    const paragraphs = withCaption.body.split(/\n{2,}/).filter((p) => p.trim().length > 0);
    expect(screen.getByTestId('article-body').querySelectorAll('p')).toHaveLength(
      paragraphs.length,
    );
  });

  it('shows a not-found state for an unknown slug', () => {
    renderArticle('does-not-exist');
    expect(screen.getByTestId('article-not-found')).toHaveTextContent('Article not found');
    expect(screen.getByTestId('article-not-found-link')).toHaveAttribute('href', '/articles');
    expect(screen.queryByTestId('article-page')).toBeNull();
  });
});
