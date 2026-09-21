import { describe, expect, it } from 'vitest';

import { buildLlmsTxt, buildRobotsTxt, buildSitemapXml, escapeXml } from './crawlers';
import { articles } from '../src/data/articles';
import { pickups } from '../src/data/pickups';

const ORIGIN = 'https://basementpickups.com';

describe('escapeXml', () => {
  it('escapes the five XML specials', () => {
    expect(escapeXml(`a&b<c>d"e'f`)).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f');
  });
});

describe('buildRobotsTxt', () => {
  it('allows everything except the cart and API, and points at the sitemap', () => {
    expect(buildRobotsTxt(ORIGIN)).toBe(
      `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /api/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`,
    );
  });
});

describe('buildSitemapXml', () => {
  const xml = buildSitemapXml(ORIGIN);
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  it('is a well-formed urlset', () => {
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns=')).toBe(true);
    expect(xml.endsWith('</urlset>\n')).toBe(true);
    expect((xml.match(/<url>/g) ?? []).length).toBe((xml.match(/<\/url>/g) ?? []).length);
  });

  it('lists the static pages first (never the cart)', () => {
    expect(locs.slice(0, 6)).toEqual(
      ['/', '/shop', '/about', '/articles', '/faq', '/contact'].map((p) => `${ORIGIN}${p}`),
    );
    expect(locs).not.toContain(`${ORIGIN}/cart`);
  });

  it('lists every set page but no neck/bridge variant', () => {
    for (const p of pickups) {
      expect(locs).toContain(`${ORIGIN}/products/${p.slug}`);
      for (const v of p.variants ?? []) {
        expect(locs).not.toContain(`${ORIGIN}/products/${v.slug}`);
      }
    }
  });

  it('lists every article with its lastmod', () => {
    for (const a of articles) {
      expect(xml).toContain(
        `<url><loc>${ORIGIN}/articles/${a.slug}</loc><lastmod>${a.metadata.publishedAt}</lastmod></url>`,
      );
    }
    expect(locs).toHaveLength(6 + pickups.length + articles.length);
  });

  it('escapes the origin', () => {
    expect(buildSitemapXml('https://x.test/?a=1&b=2')).toContain(
      '<loc>https://x.test/?a=1&amp;b=2/</loc>',
    );
  });
});

describe('buildLlmsTxt', () => {
  const txt = buildLlmsTxt(ORIGIN);

  it('starts with the brand heading and lists the pages', () => {
    expect(txt.startsWith('# Basement Pickups\n')).toBe(true);
    for (const p of ['/', '/shop', '/about', '/articles', '/faq', '/contact']) {
      expect(txt).toContain(`](${ORIGIN}${p})`);
    }
  });

  it('lists products with nested variants and every article', () => {
    for (const p of pickups) {
      expect(txt).toContain(`- [${p.name}](${ORIGIN}/products/${p.slug}): ${p.description}`);
      for (const v of p.variants ?? []) {
        expect(txt).toContain(`  - [${v.name}](${ORIGIN}/products/${v.slug}): ${v.seoDescription}`);
      }
    }
    for (const a of articles) {
      expect(txt).toContain(`- [${a.headline}](${ORIGIN}/articles/${a.slug}): ${a.excerpt}`);
    }
  });
});
