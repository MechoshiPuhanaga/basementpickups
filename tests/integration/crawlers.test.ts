import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { pickups } from '../../src/data/pickups';
import { articles } from '../../src/data/articles';
import { ORIGIN, startApp, type RunningApp } from './helpers';

let app: RunningApp;

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await app.close();
});

const CRAWLER_CACHE = 'public, max-age=3600';

describe('robots.txt', () => {
  it('allows crawling except the cart and API, and points at the sitemap', async () => {
    const res = await app.get('/robots.txt');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe(CRAWLER_CACHE);
    const text = await res.text();
    expect(text).toContain('User-agent: *');
    expect(text).toContain('Allow: /');
    expect(text).toContain('Disallow: /cart');
    expect(text).toContain('Disallow: /api/');
    expect(text).toContain(`Sitemap: ${ORIGIN}/sitemap.xml`);
  });
});

describe('sitemap.xml', () => {
  it('lists static pages, product sets and articles, but no variants', async () => {
    const res = await app.get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/xml; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe(CRAWLER_CACHE);
    const xml = await res.text();
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    for (const pathname of ['/', '/shop', '/about', '/articles', '/faq', '/contact']) {
      expect(xml).toContain(`<loc>${ORIGIN}${pathname}</loc>`);
    }
    expect(xml).not.toContain(`<loc>${ORIGIN}/cart</loc>`);

    for (const pickup of pickups) {
      expect(xml).toContain(`<loc>${ORIGIN}/products/${pickup.slug}</loc>`);
      for (const variant of pickup.variants ?? []) {
        expect(xml).not.toContain(`/products/${variant.slug}<`);
      }
    }
    for (const article of articles) {
      expect(xml).toContain(
        `<loc>${ORIGIN}/articles/${article.slug}</loc><lastmod>${article.metadata.publishedAt}</lastmod>`,
      );
    }

    const locs = xml.match(/<loc>/g) ?? [];
    expect(locs.length).toBe(6 + pickups.length + articles.length);
  });
});

describe('llms.txt', () => {
  it('describes the site, every product and every article with absolute links', async () => {
    const res = await app.get('/llms.txt');
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(res.headers.get('cache-control')).toBe(CRAWLER_CACHE);
    const text = await res.text();
    expect(text.startsWith('# Basement Pickups')).toBe(true);
    expect(text).toContain(`- [Shop](${ORIGIN}/shop)`);
    expect(text).toContain(`- [Contact](${ORIGIN}/contact)`);
    for (const pickup of pickups) {
      expect(text).toContain(`[${pickup.name}](${ORIGIN}/products/${pickup.slug})`);
      for (const variant of pickup.variants ?? []) {
        expect(text).toContain(`[${variant.name}](${ORIGIN}/products/${variant.slug})`);
      }
    }
    for (const article of articles) {
      expect(text).toContain(`[${article.headline}](${ORIGIN}/articles/${article.slug})`);
    }
  });
});
