import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { articles, type Article } from '../../../data/articles';
import { ArticleBrowser } from './ArticleBrowser';

function cardSlugs(): string[] {
  return Array.from(
    screen.getByTestId('article-browser-grid').querySelectorAll('[data-testid^="article-card-"]'),
  ).map((el) => el.getAttribute('data-testid')?.replace('article-card-', '') ?? '');
}

function renderBrowser(list: readonly Article[] = articles) {
  return render(
    <MemoryRouter>
      <ArticleBrowser articles={list} />
    </MemoryRouter>,
  );
}

describe('ArticleBrowser', () => {
  it('lists every article newest first with the count and filter chips', () => {
    renderBrowser();
    expect(screen.getByTestId('article-browser-count')).toHaveTextContent(
      `${String(articles.length)} articles`,
    );
    expect(screen.getByTestId('article-browser-filters-trigger')).toHaveTextContent('Newest first');
    const sorted = [...articles].sort(
      (a, b) => Date.parse(b.metadata.publishedAt) - Date.parse(a.metadata.publishedAt),
    );
    expect(cardSlugs()).toEqual(sorted.map((a) => a.slug));
  });

  it('sorts oldest first and filters by topic', async () => {
    const user = userEvent.setup();
    renderBrowser();
    await user.selectOptions(screen.getByTestId('article-browser-sort-select'), 'oldest');
    const oldest = [...articles].sort(
      (a, b) => Date.parse(a.metadata.publishedAt) - Date.parse(b.metadata.publishedAt),
    );
    expect(cardSlugs()).toEqual(oldest.map((a) => a.slug));
    expect(screen.getByTestId('article-browser-filters-trigger')).toHaveTextContent('Oldest first');

    await user.selectOptions(screen.getByTestId('article-browser-topic-select'), 'PAF');
    const paf = articles.filter((a) => a.keywords.includes('PAF'));
    expect(cardSlugs()).toEqual(expect.arrayContaining(paf.map((a) => a.slug)));
    expect(cardSlugs()).toHaveLength(paf.length);
    expect(screen.getByTestId('article-browser-filters-trigger')).toHaveTextContent('PAF');
    expect(screen.getByTestId('article-browser-count')).toHaveTextContent(
      paf.length === 1 ? '1 article' : `${String(paf.length)} articles`,
    );
  });

  it('offers the topics alphabetically from the article keywords', () => {
    renderBrowser();
    const select = screen.getByTestId<HTMLSelectElement>('article-browser-topic-select');
    const options = Array.from(select.options)
      .map((o) => o.value)
      .slice(1);
    const expected = [...new Set(articles.flatMap((a) => a.keywords))].sort((a, b) =>
      a.localeCompare(b),
    );
    expect(options).toEqual(expected);
  });

  it('shows an empty state when nothing matches', () => {
    renderBrowser([]);
    expect(screen.getByTestId('article-browser-count')).toHaveTextContent('0 articles');
    expect(screen.getByTestId('article-browser-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('article-browser-grid')).toBeNull();
  });

  it('treats an unparseable date as the oldest', () => {
    const first = articles[0];
    if (first === undefined) throw new Error('fixture');
    const broken: Article = {
      ...first,
      id: 'broken',
      slug: 'broken',
      metadata: { ...first.metadata, publishedAt: 'nope' },
    };
    renderBrowser([broken, ...articles]);
    const slugs = cardSlugs();
    expect(slugs[slugs.length - 1]).toBe('broken');
    expect(
      within(screen.getByTestId('article-browser-grid')).getByTestId('article-card-broken'),
    ).toBeInTheDocument();
  });
});
