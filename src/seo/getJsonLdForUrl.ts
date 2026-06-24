import { getPickupAndParent } from '../data/pickups';
import type { Pickup } from '../data/pickups';
import { bobbinColorLabel } from '../data/bobbinColors';
import { getArticleBySlug } from '../data/articles';

const SITE_NAME = 'Basement Pickups';
const SITE_DESCRIPTION =
  'Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship.';
const PRICE_CURRENCY = 'EUR';
// Pickups are wound to order rather than held as stock — schema.org/MadeToOrder
// is the honest availability for the enquiry-based (no checkout) model.
const AVAILABILITY = 'https://schema.org/MadeToOrder';

const MAGNET_LABEL: Record<string, string> = {
  'alnico-2': 'Alnico 2',
  'alnico-3': 'Alnico 3',
  'alnico-4': 'Alnico 4',
  'alnico-5': 'Alnico 5',
  'alnico-8': 'Alnico 8',
  ceramic: 'Ceramic',
  neodymium: 'Neodymium',
};

const POLEPIECE_LABEL: Record<string, string> = {
  chrome: 'Chrome',
  black: 'Black',
  nickel: 'Nickel',
  gold: 'Gold',
};

/** Expose the build/hardware spec as schema.org PropertyValue entries. */
function productProperties(pickup: Pickup): JsonLd[] {
  const h = pickup.hardware;
  const props: JsonLd[] = [
    {
      '@type': 'PropertyValue',
      name: 'Magnet',
      value: MAGNET_LABEL[pickup.magnet] ?? pickup.magnet,
    },
    {
      '@type': 'PropertyValue',
      name: 'Pole pieces',
      value: POLEPIECE_LABEL[h.polepieces] ?? h.polepieces,
    },
  ];
  if (h.spacingMm !== undefined) {
    const spacing = h.spacingMm;
    props.push(
      typeof spacing === 'number'
        ? {
            '@type': 'PropertyValue',
            name: 'String spacing',
            value: spacing,
            unitCode: 'MMT',
            unitText: 'mm',
          }
        : {
            '@type': 'PropertyValue',
            name: 'String spacing',
            value: `${spacing.join(' or ')} mm`,
          },
    );
  }
  props.push({
    '@type': 'PropertyValue',
    name: 'Cover',
    value: h.cover ? `${h.cover.material}${h.cover.optional ? ' (optional)' : ''}` : 'None',
  });
  if (h.sevenString) {
    props.push({
      '@type': 'PropertyValue',
      name: '7-string',
      value: `Available (${h.sevenString.colors.map(bobbinColorLabel).join(', ').toLowerCase()} only)`,
    });
  }
  props.push({
    '@type': 'PropertyValue',
    name: 'Bobbin colours',
    value: h.bobbinColors.map(bobbinColorLabel).join(', '),
  });
  if (pickup.specs.dcr !== undefined) {
    props.push({ '@type': 'PropertyValue', name: 'DCR', value: pickup.specs.dcr });
  }
  if (pickup.specs.inductance !== undefined) {
    props.push({ '@type': 'PropertyValue', name: 'Inductance', value: pickup.specs.inductance });
  }
  return props;
}

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
    material: MAGNET_LABEL[pickup.magnet] ?? pickup.magnet,
    additionalProperty: productProperties(pickup),
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
