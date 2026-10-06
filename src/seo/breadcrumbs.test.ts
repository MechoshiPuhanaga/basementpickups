import { describe, expect, it } from 'vitest';

import { articles } from '../data/articles';
import { getPickupAndParent } from '../data/pickups';
import { articleCrumbs, FAQ_CRUMBS, productCrumbs } from './breadcrumbs';

function pair(slug: string) {
  const found = getPickupAndParent(slug);
  if (found === undefined) throw new Error(`fixture: ${slug}`);
  return found;
}

describe('breadcrumbs', () => {
  it('puts a set or single pickup under the shop', () => {
    const { pickup, parent } = pair('white-pearl');
    expect(productCrumbs(pickup, parent)).toEqual([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/shop' },
      { name: 'White Pearl', path: '/products/white-pearl' },
    ]);
  });

  it('puts a variant under its set', () => {
    const { pickup, parent } = pair('white-pearl-neck');
    expect(productCrumbs(pickup, parent).map((c) => c.path)).toEqual([
      '/',
      '/shop',
      '/products/white-pearl',
      '/products/white-pearl-neck',
    ]);
  });

  it('puts an article under the articles index', () => {
    const article = articles[0];
    if (article === undefined) throw new Error('fixture: no articles');
    expect(articleCrumbs(article)).toEqual([
      { name: 'Home', path: '/' },
      { name: 'Articles', path: '/articles' },
      { name: article.headline, path: `/articles/${article.slug}` },
    ]);
  });

  it('names the FAQ page as Q&A', () => {
    expect(FAQ_CRUMBS.at(-1)).toEqual({ name: 'Q&A', path: '/faq' });
  });
});
