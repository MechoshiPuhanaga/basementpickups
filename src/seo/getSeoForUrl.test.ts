import { describe, expect, it } from 'vitest';

import { getSeoForUrl, getStatusForUrl, toOgImage } from './getSeoForUrl';
import { articles } from '../data/articles';
import { pickups } from '../data/pickups';

const ORIGIN = 'https://basementpickups.com';
const DEFAULT_OG = `${ORIGIN}/assets/images/spirit-photos/bp-spirit-1-og.jpg`;

describe('toOgImage', () => {
  it('maps raster sources to their generated -og.jpg', () => {
    expect(toOgImage('/a/b/photo.png')).toBe('/a/b/photo-og.jpg');
    expect(toOgImage('/a/b/photo.JPG')).toBe('/a/b/photo-og.jpg');
    expect(toOgImage('/a/b/photo.jpeg')).toBe('/a/b/photo-og.jpg');
  });

  it('falls back to the site default for non-raster sources', () => {
    expect(toOgImage('/a/b/placeholder.svg')).toBe(
      '/assets/images/spirit-photos/bp-spirit-1-og.jpg',
    );
  });
});

describe('getSeoForUrl — static pages', () => {
  it.each([
    ['/', 'Handcrafted Guitar Pickups | Basement Pickups'],
    ['/shop', 'Shop Pickups | Basement Pickups'],
    ['/about', 'About | Basement Pickups'],
    ['/articles', 'Articles | Basement Pickups'],
    ['/faq', 'Q&A — Lead Times, Specs and Handwork | Basement Pickups'],
    ['/contact', 'Contact | Basement Pickups'],
  ])('%s resolves an indexable website page', (pathname, title) => {
    const seo = getSeoForUrl(pathname, ORIGIN);
    expect(seo.title).toBe(title);
    expect(seo.ogTitle).toBe(title);
    expect(seo.description).not.toBe('');
    expect(seo.ogDescription).toBe(seo.description);
    expect(seo.ogType).toBe('website');
    expect(seo.canonicalUrl).toBe(`${ORIGIN}${pathname}`);
    expect(seo.ogUrl).toBe(`${ORIGIN}${pathname}`);
    expect(seo.ogImage).toBe(DEFAULT_OG);
    expect(seo.ogImageWidth).toBe(1200);
    expect(seo.ogImageHeight).toBe(630);
    expect(seo.ogImageType).toBe('image/jpeg');
    expect(seo.ogImageAlt).toBe('Basement Pickups — handcrafted boutique guitar pickups');
    expect(seo.robots).toBeUndefined();
    expect(seo.article).toBeUndefined();
  });

  it('marks the cart as noindex, nofollow but still canonical', () => {
    const seo = getSeoForUrl('/cart', ORIGIN);
    expect(seo.title).toBe('Your enquiry | Basement Pickups');
    expect(seo.robots).toBe('noindex, nofollow');
    expect(seo.canonicalUrl).toBe(`${ORIGIN}/cart`);
  });

  it('normalises trailing slashes and an empty origin', () => {
    expect(getSeoForUrl('/shop/', ORIGIN)).toEqual(getSeoForUrl('/shop', ORIGIN));
    expect(getSeoForUrl('///', ORIGIN)).toEqual(getSeoForUrl('/', ORIGIN));
    const bare = getSeoForUrl('/about');
    expect(bare.canonicalUrl).toBe('/about');
    expect(bare.ogImage).toBe('/assets/images/spirit-photos/bp-spirit-1-og.jpg');
  });

  it('strips a trailing slash from the origin', () => {
    expect(getSeoForUrl('/shop', `${ORIGIN}/`).canonicalUrl).toBe(`${ORIGIN}/shop`);
  });
});

describe('getSeoForUrl — products', () => {
  it('describes a set page with its own photo', () => {
    const seo = getSeoForUrl('/products/rockroach', ORIGIN);
    expect(seo.title).toBe('Rockroach | Basement Pickups');
    expect(seo.ogType).toBe('product');
    expect(seo.canonicalUrl).toBe(`${ORIGIN}/products/rockroach`);
    expect(seo.ogImage).toBe(`${ORIGIN}/assets/images/product-photos/rockroach-og.jpg`);
    expect(seo.ogImageAlt).toBe('Rockroach — Basement Pickups');
    expect(seo.description).toBe(pickups.find((p) => p.slug === 'rockroach')?.seoDescription);
  });

  it('canonicalises a neck/bridge variant to its set page but keeps its own copy', () => {
    const seo = getSeoForUrl('/products/white-pearl-neck', ORIGIN);
    expect(seo.title).toBe('White Pearl · Neck | Basement Pickups');
    expect(seo.canonicalUrl).toBe(`${ORIGIN}/products/white-pearl`);
    expect(seo.ogUrl).toBe(`${ORIGIN}/products/white-pearl`);
    expect(seo.robots).toBeUndefined();
  });

  it('falls through to Not Found for unknown product slugs and nested paths', () => {
    for (const pathname of ['/products/nope', '/products/rockroach/extra', '/products']) {
      const seo = getSeoForUrl(pathname, ORIGIN);
      expect(seo.title, pathname).toBe('Not Found | Basement Pickups');
    }
  });
});

describe('getSeoForUrl — articles', () => {
  it('describes an article with article metadata and the default OG image', () => {
    const article = articles[0];
    if (article === undefined) throw new Error('fixture');
    const seo = getSeoForUrl(`/articles/${article.slug}`, ORIGIN);
    expect(seo.title).toBe(`${article.headline} | Basement Pickups`);
    expect(seo.description).toBe(article.excerpt);
    expect(seo.ogType).toBe('article');
    expect(seo.canonicalUrl).toBe(`${ORIGIN}/articles/${article.slug}`);
    // placeholder SVG → site default OG image
    expect(seo.ogImage).toBe(DEFAULT_OG);
    expect(seo.ogImageAlt).toBe(article.mainImage.alt);
    expect(seo.article).toEqual({
      publishedTime: article.metadata.publishedAt,
      author: article.metadata.author,
      tags: article.keywords,
    });
  });

  it('falls through to Not Found for unknown article slugs', () => {
    expect(getSeoForUrl('/articles/missing', ORIGIN).title).toBe('Not Found | Basement Pickups');
  });
});

describe('getSeoForUrl — not found', () => {
  it('is noindex, follow with no canonical link', () => {
    const seo = getSeoForUrl('/anything/else', ORIGIN);
    expect(seo.title).toBe('Not Found | Basement Pickups');
    expect(seo.robots).toBe('noindex, follow');
    expect(seo.canonicalUrl).toBeUndefined();
    expect(seo.ogUrl).toBe(`${ORIGIN}/anything/else`);
    expect(seo.ogType).toBe('website');
  });
});

describe('getStatusForUrl', () => {
  it('returns 200 for every static page, with or without a trailing slash', () => {
    for (const p of ['/', '/shop', '/about', '/articles', '/faq', '/contact', '/cart']) {
      expect(getStatusForUrl(p), p).toBe(200);
      expect(getStatusForUrl(`${p}/`), `${p}/`).toBe(200);
    }
  });

  it('returns 200 for known products (incl. variants) and articles', () => {
    expect(getStatusForUrl('/products/twin-bliss')).toBe(200);
    expect(getStatusForUrl('/products/macho-heaven-bridge')).toBe(200);
    expect(getStatusForUrl('/articles/the-language-of-paf')).toBe(200);
  });

  it('returns 404 for unknown slugs and anything else', () => {
    expect(getStatusForUrl('/products/nope')).toBe(404);
    expect(getStatusForUrl('/articles/nope')).toBe(404);
    expect(getStatusForUrl('/nope')).toBe(404);
    expect(getStatusForUrl('/products')).toBe(404);
    expect(getStatusForUrl('/shop/extra')).toBe(404);
  });
});
