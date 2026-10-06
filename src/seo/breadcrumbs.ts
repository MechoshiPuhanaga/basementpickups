import type { Article } from '../data/articles';
import type { Pickup } from '../data/pickups';

/** One step of a page's trail: a visible label and its site-relative path. */
export interface Crumb {
  readonly name: string;
  readonly path: string;
}

const HOME: Crumb = { name: 'Home', path: '/' };
const SHOP: Crumb = { name: 'Shop', path: '/shop' };
const ARTICLES: Crumb = { name: 'Articles', path: '/articles' };

/**
 * The single source for breadcrumb trails: the visible `Breadcrumbs` on pages
 * and the `BreadcrumbList` JSON-LD both read from here, so they can't drift.
 * The last crumb is always the current page.
 */
export const FAQ_CRUMBS: readonly Crumb[] = [HOME, { name: 'Q&A', path: '/faq' }];

/** Home › Shop › (set ›) pickup. Variant pages sit under their set. */
export function productCrumbs(pickup: Pickup, parent: Pickup): readonly Crumb[] {
  const crumbs: Crumb[] = [HOME, SHOP];
  if (parent.slug !== pickup.slug) {
    crumbs.push({ name: parent.name, path: `/products/${parent.slug}` });
  }
  crumbs.push({ name: pickup.name, path: `/products/${pickup.slug}` });
  return crumbs;
}

/** Home › Articles › article. */
export function articleCrumbs(article: Article): readonly Crumb[] {
  return [HOME, ARTICLES, { name: article.headline, path: `/articles/${article.slug}` }];
}
