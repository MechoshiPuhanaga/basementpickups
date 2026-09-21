import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { getSeoForUrl } from '../../src/seo/getSeoForUrl';
import { pickups } from '../../src/data/pickups';
import { articles } from '../../src/data/articles';
import { cspNonce, escapeHtml, findTag, ORIGIN, startApp, type RunningApp } from './helpers';

const STATIC_ROUTES = ['/', '/shop', '/about', '/articles', '/faq', '/contact', '/cart'];

const setPickup = pickups.find((p) => (p.variants?.length ?? 0) > 0);
const variant = setPickup?.variants?.[0];
const article = articles[0];
if (setPickup === undefined || variant === undefined || article === undefined) {
  throw new Error('Catalog fixtures missing: need a set with variants and one article');
}

const SET_PATH = `/products/${setPickup.slug}`;
const VARIANT_PATH = `/products/${variant.slug}`;
const ARTICLE_PATH = `/articles/${article.slug}`;

let app: RunningApp;

function productOffers(html: string): Record<string, unknown> {
  const product = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1] ?? '') as Record<string, unknown>)
    .find((block) => block['@type'] === 'Product');
  expect(product).toBeDefined();
  return product?.['offers'] as Record<string, unknown>;
}

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await app.close();
});

describe('SSR pages', () => {
  it.each([...STATIC_ROUTES, SET_PATH, VARIANT_PATH, ARTICLE_PATH])(
    'GET %s streams a 200 HTML page with the resolved SEO title',
    async (pathname) => {
      const res = await app.get(pathname);
      expect(res.status).toBe(200);
      expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
      expect(res.headers.get('cache-control')).toBe('no-cache');

      const html = await res.text();
      const seo = getSeoForUrl(pathname, ORIGIN);
      expect(html).toContain(`<title>${escapeHtml(seo.title)}</title>`);
      expect(html).toContain(
        `<meta name="description" content="${escapeHtml(seo.description)}" />`,
      );
      expect(html).toContain('<div id="root">');
      expect(html).toContain('data-testid="page-shell"');
      expect(html).toContain('data-testid="site-header"');
      expect(html).toContain('data-testid="main"');
      expect(html).toContain('</html>');
    },
  );

  it.each(STATIC_ROUTES.filter((p) => p !== '/cart'))(
    'GET %s carries a canonical link to itself and no robots meta',
    async (pathname) => {
      const html = await (await app.get(pathname)).text();
      expect(html).toContain(`<link rel="canonical" href="${ORIGIN}${pathname}" />`);
      expect(findTag(html, 'meta', 'name', 'robots')).toBeNull();
    },
  );

  it('the cart page is noindex and canonical', async () => {
    const html = await (await app.get('/cart')).text();
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/cart" />`);
  });

  it('a variant page canonicalises to its set page', async () => {
    const html = await (await app.get(VARIANT_PATH)).text();
    expect(html).toContain(`<title>${escapeHtml(`${variant.name} | Basement Pickups`)}</title>`);
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}${SET_PATH}" />`);
    expect(html).toContain(`<meta property="og:url" content="${ORIGIN}${SET_PATH}" />`);
  });

  it('a set page canonicalises to itself with product Open Graph type', async () => {
    const html = await (await app.get(SET_PATH)).text();
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}${SET_PATH}" />`);
    expect(html).toContain('<meta property="og:type" content="product" />');
  });

  it('an article page carries article Open Graph metadata', async () => {
    const html = await (await app.get(ARTICLE_PATH)).text();
    expect(html).toContain('<meta property="og:type" content="article" />');
    expect(html).toContain(
      `<meta property="article:published_time" content="${article.metadata.publishedAt}" />`,
    );
  });

  it.each(['/', SET_PATH, VARIANT_PATH, ARTICLE_PATH])(
    'GET %s embeds JSON-LD structured data',
    async (pathname) => {
      const html = await (await app.get(pathname)).text();
      const blocks = html.match(/<script type="application\/ld\+json">/g) ?? [];
      expect(blocks.length).toBeGreaterThan(0);
      for (const json of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
        const parsed = JSON.parse(json[1] ?? '') as Record<string, unknown>;
        expect(parsed['@context']).toBe('https://schema.org');
      }
    },
  );

  it('a set page aggregates its variants into an AggregateOffer in euros', async () => {
    const html = await (await app.get(SET_PATH)).text();
    const offers = productOffers(html);
    expect(offers['@type']).toBe('AggregateOffer');
    expect(offers['priceCurrency']).toBe('EUR');
    expect(offers['offerCount']).toBe(setPickup.variants?.length);
    expect(offers['lowPrice']).toBe(Math.min(...(setPickup.variants ?? []).map((v) => v.price)));
  });

  it('a variant page offers its own catalogue price in euros', async () => {
    const html = await (await app.get(VARIANT_PATH)).text();
    const offers = productOffers(html);
    expect(offers['@type']).toBe('Offer');
    expect(offers['priceCurrency']).toBe('EUR');
    expect(offers['price']).toBe(variant.price);
  });

  it('the hydration script carries the same nonce as the CSP header', async () => {
    const res = await app.get('/shop');
    const nonce = cspNonce(res);
    const html = await res.text();
    const inlineScripts =
      html.match(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>/g) ?? [];
    expect(inlineScripts.length).toBeGreaterThan(0);
    for (const tag of inlineScripts) {
      expect(tag).toContain(`nonce="${nonce}"`);
    }
  });

  it('each response gets a fresh nonce', async () => {
    const [a, b] = await Promise.all([app.get('/'), app.get('/')]);
    expect(cspNonce(a)).not.toBe(cspNonce(b));
  });

  it.each(['/nope', '/products/does-not-exist', '/articles/does-not-exist', '/shop/extra'])(
    'GET %s is a real 404 that still streams the not-found page',
    async (pathname) => {
      const res = await app.get(pathname);
      expect(res.status).toBe(404);
      expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
      const html = await res.text();
      expect(html).toContain('<title>Not Found | Basement Pickups</title>');
      expect(html).toContain('<meta name="robots" content="noindex, follow" />');
      expect(findTag(html, 'link', 'rel', 'canonical')).toBeNull();
      expect(html).toContain('data-testid="main"');
      expect(html).toContain('</html>');
    },
  );

  it('HEAD requests return the page headers without a body', async () => {
    const res = await app.get('/about', { method: 'HEAD' });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/html; charset=utf-8');
    expect(await res.text()).toBe('');
  });

  it('query strings do not change the resolved page', async () => {
    const res = await app.get('/shop?utm_source=test');
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain(`<link rel="canonical" href="${ORIGIN}/shop" />`);
  });
});

describe('publicOrigin option', () => {
  it('trims a trailing slash from the configured origin', async () => {
    const custom = await startApp({ isProd: true, publicOrigin: 'https://x.test/' });
    try {
      const html = await (await custom.get('/about')).text();
      expect(html).toContain('<link rel="canonical" href="https://x.test/about" />');
    } finally {
      await custom.close();
    }
  });
});
