import { getPickupAndParent } from '../data/pickups';
import type { Pickup } from '../data/pickups';
import { getArticleBySlug } from '../data/articles';

const SITE_NAME = 'Basement Pickups';
const SITE_DESCRIPTION =
  'Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship.';
const PRICE_CURRENCY = 'EUR';
// Pickups are wound to order rather than held as stock — schema.org/MadeToOrder
// is the honest availability for the enquiry-based (no checkout) model.
const AVAILABILITY = 'https://schema.org/MadeToOrder';

/**
 * A single JSON-LD block. The shape is intentionally loose: schema.org graphs
 * are heterogeneous and validated by consumers (Google, LLM crawlers), not by
 * us. `renderJsonLd` (server/seo.ts) serializes these into <script> tags.
 */
export type JsonLd = Record<string, unknown>;

function organizationLd(base: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: `${base}/`,
    description: SITE_DESCRIPTION,
    logo: `${base}/assets/images/spirit-photos/bp-spirit-1-og.jpg`,
  };
}

function websiteLd(base: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${base}/`,
  };
}

function productLd(base: string, pickup: Pickup): JsonLd {
  const variants = pickup.variants ?? [];
  const offers =
    variants.length > 0
      ? {
          '@type': 'AggregateOffer',
          priceCurrency: PRICE_CURRENCY,
          lowPrice: Math.min(...variants.map((v) => v.price)),
          highPrice: Math.max(...variants.map((v) => v.price)),
          offerCount: variants.length,
          availability: AVAILABILITY,
        }
      : {
          '@type': 'Offer',
          priceCurrency: PRICE_CURRENCY,
          price: pickup.price,
          availability: AVAILABILITY,
          url: `${base}/products/${pickup.slug}`,
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pickup.name,
    description: pickup.description,
    sku: pickup.id,
    category: pickup.type,
    image: `${base}${pickup.images.main}`,
    url: `${base}/products/${pickup.slug}`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers,
  };
}

function breadcrumbLd(
  base: string,
  crumbs: readonly { readonly name: string; readonly path: string }[],
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: `${base}${crumb.path}`,
    })),
  };
}

/**
 * Resolve the JSON-LD structured-data blocks for a pathname. Mirrors
 * `getSeoForUrl`: the server feeds the request origin so every URL is absolute.
 * Returns an empty array for pages with no useful structured data.
 */
export function getJsonLdForUrl(pathname: string, origin = ''): readonly JsonLd[] {
  const base = origin.replace(/\/+$/, '');
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/') {
    return [organizationLd(base), websiteLd(base)];
  }

  const productMatch = /^\/products\/([^/]+)$/.exec(normalized);
  if (productMatch) {
    const found = getPickupAndParent(productMatch[1] ?? '');
    if (found) {
      const { pickup, parent } = found;
      const crumbs = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
      ];
      // Variant pages sit under their base product in the trail.
      if (parent.slug !== pickup.slug) {
        crumbs.push({ name: parent.name, path: `/products/${parent.slug}` });
      }
      crumbs.push({ name: pickup.name, path: `/products/${pickup.slug}` });
      return [productLd(base, pickup), breadcrumbLd(base, crumbs)];
    }
  }

  const articleMatch = /^\/articles\/([^/]+)$/.exec(normalized);
  if (articleMatch) {
    const article = getArticleBySlug(articleMatch[1] ?? '');
    if (article) {
      return [
        {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.headline,
          description: article.excerpt,
          datePublished: article.metadata.publishedAt,
          ...(article.metadata.updatedAt !== undefined
            ? { dateModified: article.metadata.updatedAt }
            : {}),
          author: { '@type': 'Organization', name: article.metadata.author ?? SITE_NAME },
          publisher: { '@type': 'Organization', name: SITE_NAME },
          url: `${base}/articles/${article.slug}`,
          mainEntityOfPage: `${base}/articles/${article.slug}`,
        },
        breadcrumbLd(base, [
          { name: 'Home', path: '/' },
          { name: 'Articles', path: '/articles' },
          { name: article.headline, path: `/articles/${article.slug}` },
        ]),
      ];
    }
  }

  return [];
}
