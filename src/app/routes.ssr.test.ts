/**
 * SSR safety: every route renders to a string in a plain node environment (no
 * window/document). Runs in the `unit` project on purpose — the component
 * project's jsdom setup would mask DOM access during render.
 */
import { createElement, StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { articles } from '../data/articles';
import { pickups } from '../data/pickups';
import { routes } from './routes';

const ORIGIN = 'https://example.test';

async function renderPath(pathname: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`${ORIGIN}${pathname}`));
  if (context instanceof Response) throw new Error(`unexpected redirect for ${pathname}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  return renderToString(
    createElement(StrictMode, null, createElement(StaticRouterProvider, { router, context })),
  );
}

const staticRoutes: readonly [string, string][] = [
  ['/', 'hero'],
  ['/shop', 'shop-page'],
  ['/about', 'about-page'],
  ['/articles', 'articles-page'],
  ['/faq', 'faq-page'],
  ['/contact', 'contact-page'],
  ['/cart', 'cart-empty'],
  ['/definitely/not/here', 'not-found'],
  ['/products/nope', 'product-not-found'],
  ['/articles/nope', 'article-not-found'],
];

const productRoutes: [string, string][] = pickups.flatMap((pickup) => [
  [`/products/${pickup.slug}`, 'product-page'] as [string, string],
  ...(pickup.variants ?? []).map(
    (variant) => [`/products/${variant.slug}`, 'product-page'] as [string, string],
  ),
]);

const articleRoutes: [string, string][] = articles.map((article) => [
  `/articles/${article.slug}`,
  'article-page',
]);

describe('SSR safety', () => {
  it('runs without a DOM', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
  });

  it.each([...staticRoutes, ...productRoutes, ...articleRoutes])(
    'renders %s on the server with the %s root',
    async (pathname, rootId) => {
      const html = await renderPath(pathname);
      expect(html).toContain('data-testid="page-shell"');
      expect(html).toContain('data-testid="main"');
      expect(html).toContain(`data-testid="${rootId}"`);
      // The cart starts empty on the server so hydration matches.
      expect(html).toContain('Your enquiry list is empty');
    },
  );

  it('renders a variant page with its configurator but no hydration-only state', async () => {
    const html = await renderPath('/products/white-pearl-neck');
    expect(html).toContain('data-testid="add-to-cart"');
    expect(html).toContain('data-testid="pickup-configurator"');
  });
});
