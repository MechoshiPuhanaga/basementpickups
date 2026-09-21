import { describe, expect, it } from 'vitest';

import { getJsonLdForUrl, type JsonLd } from './getJsonLdForUrl';
import { articles } from '../data/articles';
import { FAQ_ITEMS } from '../data/faq';
import { getPickupBySlug } from '../data/pickups';

const ORIGIN = 'https://basementpickups.com';

function typeOf(block: JsonLd | undefined): unknown {
  return block?.['@type'];
}

function props(block: JsonLd | undefined): Record<string, unknown> {
  const list = block?.['additionalProperty'];
  if (!Array.isArray(list)) throw new Error('additionalProperty missing');
  const out: Record<string, unknown> = {};
  for (const entry of list as { name: string; value: unknown }[]) out[entry.name] = entry.value;
  return out;
}

describe('getJsonLdForUrl — home', () => {
  it('returns Organization and WebSite with absolute URLs', () => {
    const [org, site] = getJsonLdForUrl('/', ORIGIN);
    expect(typeOf(org)).toBe('Organization');
    expect(org?.['url']).toBe(`${ORIGIN}/`);
    expect(org?.['logo']).toBe(`${ORIGIN}/icons/icon-512.png`);
    expect(typeOf(site)).toBe('WebSite');
    expect(site?.['inLanguage']).toBe('en');
    expect((site?.['publisher'] as JsonLd)['@type']).toBe('Organization');
  });

  it('normalises trailing slashes on both path and origin', () => {
    expect(getJsonLdForUrl('///', `${ORIGIN}/`)).toEqual(getJsonLdForUrl('/', ORIGIN));
  });

  it('works with an empty origin', () => {
    expect(getJsonLdForUrl('/')[0]?.['url']).toBe('/');
  });
});

describe('getJsonLdForUrl — faq', () => {
  it('returns an FAQPage with every question plus breadcrumbs', () => {
    const [faq, crumbs] = getJsonLdForUrl('/faq', ORIGIN);
    expect(typeOf(faq)).toBe('FAQPage');
    const entities = faq?.['mainEntity'] as { name: string; acceptedAnswer: { text: string } }[];
    expect(entities).toHaveLength(FAQ_ITEMS.length);
    expect(entities[0]?.name).toBe(FAQ_ITEMS[0]?.question);
    expect(entities[0]?.acceptedAnswer.text).toBe(FAQ_ITEMS[0]?.answer);
    expect(typeOf(crumbs)).toBe('BreadcrumbList');
    expect(crumbs?.['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Q&A', item: `${ORIGIN}/faq` },
    ]);
  });
});

describe('getJsonLdForUrl — products', () => {
  it('describes a single-price product with an Offer and its spec properties', () => {
    const [product, crumbs] = getJsonLdForUrl('/products/rockroach', ORIGIN);
    expect(typeOf(product)).toBe('Product');
    expect(product?.['sku']).toBe('rockroach');
    expect(product?.['category']).toBe('humbucker');
    expect(product?.['material']).toBe('Alnico 5');
    expect(product?.['image']).toBe(`${ORIGIN}/assets/images/product-photos/rockroach.png`);
    expect(product?.['offers']).toEqual({
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: 125,
      availability: 'https://schema.org/MadeToOrder',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${ORIGIN}/products/rockroach`,
    });
    const p = props(product);
    expect(p['Magnet']).toBe('Alnico 5');
    expect(p['Pole pieces']).toBe('Nickel, Black or Gold');
    expect(p['Lead wire']).toBe('Vintage braided (2-conductor) or 4-conductor (coil split)');
    expect(p['String spacing']).toBe(52);
    expect(p['Cover']).toBe('Optional (nickel, black or gold)');
    expect(p['7-string']).toBe('Available (black only)');
    expect(p['Bobbin colours']).toContain('Light blue');
    expect(p['DCR']).toBe('12.2k');
    expect(p['Inductance']).toBe('5.9H');
    expect(crumbs?.['itemListElement']).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${ORIGIN}/shop` },
      { '@type': 'ListItem', position: 3, name: 'Rockroach', item: `${ORIGIN}/products/rockroach` },
    ]);
  });

  it('describes a set with an AggregateOffer across its variants', () => {
    const [product] = getJsonLdForUrl('/products/white-pearl', ORIGIN);
    const set = getPickupBySlug('white-pearl');
    expect(product?.['offers']).toEqual({
      '@type': 'AggregateOffer',
      priceCurrency: 'EUR',
      lowPrice: 125,
      highPrice: 125,
      offerCount: set?.variants?.length,
      availability: 'https://schema.org/MadeToOrder',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${ORIGIN}/products/white-pearl`,
    });
    // The set has no fixed spacing → no String spacing property, no 7-string.
    const p = props(product);
    expect(p).not.toHaveProperty('String spacing');
    expect(p).not.toHaveProperty('7-string');
  });

  it('formats a spacing choice as text with no unit code', () => {
    const [product] = getJsonLdForUrl('/products/twin-bliss', ORIGIN);
    const list = product?.['additionalProperty'] as JsonLd[];
    const spacing = list.find((e) => e['name'] === 'String spacing');
    expect(spacing).toEqual({
      '@type': 'PropertyValue',
      name: 'String spacing',
      value: '50 or 52 mm',
    });
    // Twin Bliss offers no cover at all.
    expect(props(product)['Cover']).toBe('None');
  });

  it('nests a variant under its parent in the breadcrumb trail', () => {
    const [product, crumbs] = getJsonLdForUrl('/products/chow-chow-neck', ORIGIN);
    expect(product?.['name']).toBe('Chow Chow · Neck');
    expect(product?.['material']).toBe('Alnico 2');
    expect(props(product)['Pole pieces']).toBe('Nickel');
    const items = crumbs?.['itemListElement'] as { name: string; item: string }[];
    expect(items.map((c) => c.name)).toEqual(['Home', 'Shop', 'Chow Chow', 'Chow Chow · Neck']);
    expect(items[3]?.item).toBe(`${ORIGIN}/products/chow-chow-neck`);
  });

  it('returns nothing for unknown products', () => {
    expect(getJsonLdForUrl('/products/nope', ORIGIN)).toEqual([]);
  });
});

describe('getJsonLdForUrl — articles', () => {
  it('describes a BlogPosting with publisher and breadcrumbs', () => {
    const article = articles[0];
    if (article === undefined) throw new Error('fixture');
    const [post, crumbs] = getJsonLdForUrl(`/articles/${article.slug}`, ORIGIN);
    expect(typeOf(post)).toBe('BlogPosting');
    expect(post?.['headline']).toBe(article.headline);
    expect(post?.['datePublished']).toBe(article.metadata.publishedAt);
    expect(post).not.toHaveProperty('dateModified');
    expect(post?.['author']).toEqual({ '@type': 'Organization', name: article.metadata.author });
    expect(post?.['image']).toBe(`${ORIGIN}/assets/images/spirit-photos/bp-spirit-1-og.jpg`);
    expect(post?.['url']).toBe(`${ORIGIN}/articles/${article.slug}`);
    expect(post?.['mainEntityOfPage']).toBe(`${ORIGIN}/articles/${article.slug}`);
    const items = crumbs?.['itemListElement'] as { name: string }[];
    expect(items.map((c) => c.name)).toEqual(['Home', 'Articles', article.headline]);
  });

  it('returns nothing for unknown articles', () => {
    expect(getJsonLdForUrl('/articles/nope', ORIGIN)).toEqual([]);
  });
});

describe('getJsonLdForUrl — pages without structured data', () => {
  it.each(['/shop', '/about', '/articles', '/contact', '/cart', '/nope'])(
    '%s returns an empty list',
    (pathname) => {
      expect(getJsonLdForUrl(pathname, ORIGIN)).toEqual([]);
    },
  );
});
