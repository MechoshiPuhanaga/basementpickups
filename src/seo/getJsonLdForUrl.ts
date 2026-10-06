import { getPickupAndParent } from '../data/pickups';
import type { Pickup } from '../data/pickups';
import { bobbinColorLabel } from '../data/bobbinColors';
import {
  choiceLabel,
  conductorLabel,
  formatCoverOffer,
  formatSpacing,
  polepieceLabel,
} from '../data/pickupLabels';
import { getArticleBySlug } from '../data/articles';
import { FAQ_ITEMS } from '../data/faq';
import { CONTACT_EMAIL } from '../data/site';
import { imageManifest } from '../assets/imageManifest';
import { toOgImage } from './getSeoForUrl';
import { articleCrumbs, FAQ_CRUMBS, productCrumbs, type Crumb } from './breadcrumbs';

const SITE_NAME = 'Basement Pickups';
const SITE_DESCRIPTION =
  'Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship.';
const PRICE_CURRENCY = 'EUR';
// Pickups are wound to order rather than held as stock — schema.org/MadeToOrder
// is the honest availability for the enquiry-based (no checkout) model.
const AVAILABILITY = 'https://schema.org/MadeToOrder';
const ITEM_CONDITION = 'https://schema.org/NewCondition';
/** Square raster logo (the PWA icon); schema.org wants a real logo image here, not a photo. */
const LOGO_PATH = '/icons/icon-512.png';

const MAGNET_LABEL: Record<string, string> = {
  'alnico-2': 'Alnico 2',
  'alnico-3': 'Alnico 3',
  'alnico-4': 'Alnico 4',
  'alnico-5': 'Alnico 5',
  'alnico-8': 'Alnico 8',
  ceramic: 'Ceramic',
  neodymium: 'Neodymium',
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
      value: choiceLabel(h.polepieces, polepieceLabel),
    },
    {
      '@type': 'PropertyValue',
      name: 'Lead wire',
      value: choiceLabel(pickup.conductors, conductorLabel),
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
            value: formatSpacing(spacing),
          },
    );
  }
  props.push({
    '@type': 'PropertyValue',
    name: 'Cover',
    value: formatCoverOffer(h.cover),
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

/**
 * One Organization node, identified by `@id`. Every block that names the
 * business (WebSite publisher, BlogPosting publisher, Product manufacturer)
 * embeds this same node, so consumers merge them into a single entity — the
 * embedded copy keeps each page self-contained (an `@id` alone isn't resolved
 * across pages).
 */
function organizationRef(base: string): JsonLd {
  return {
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: SITE_NAME,
    url: `${base}/`,
    logo: { '@type': 'ImageObject', url: `${base}${LOGO_PATH}`, width: 512, height: 512 },
  };
}

function organizationLd(base: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    ...organizationRef(base),
    description: SITE_DESCRIPTION,
    email: CONTACT_EMAIL,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: CONTACT_EMAIL,
      availableLanguage: ['en'],
    },
  };
}

/**
 * Product images for search: the largest optimized square WebP (falling back to
 * the source photo) plus the 1200x630 link-preview JPEG, rather than only the
 * multi-megabyte source PNG.
 */
function productImages(base: string, src: string): string[] {
  const largestWebp = imageManifest[src]?.webp.at(-1)?.src;
  return [largestWebp ?? src, toOgImage(src)].map((path) => `${base}${path}`);
}

function websiteLd(base: string): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${base}/`,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    publisher: organizationRef(base),
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
          itemCondition: ITEM_CONDITION,
          url: `${base}/products/${pickup.slug}`,
        }
      : {
          '@type': 'Offer',
          priceCurrency: PRICE_CURRENCY,
          price: pickup.price,
          availability: AVAILABILITY,
          itemCondition: ITEM_CONDITION,
          url: `${base}/products/${pickup.slug}`,
        };

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pickup.name,
    description: pickup.description,
    sku: pickup.id,
    category: pickup.type,
    image: productImages(base, pickup.images.main),
    url: `${base}/products/${pickup.slug}`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    manufacturer: organizationRef(base),
    material: MAGNET_LABEL[pickup.magnet] ?? pickup.magnet,
    additionalProperty: productProperties(pickup),
    offers,
  };
}

/**
 * Article dates are stored as calendar days (`2026-06-20`); Google wants a full
 * ISO 8601 datetime with a timezone, so a bare date becomes midnight UTC.
 */
export function toIsoDateTime(date: string): string {
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00+00:00` : date;
}

function breadcrumbLd(base: string, crumbs: readonly Crumb[]): JsonLd {
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

  if (normalized === '/faq') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      breadcrumbLd(base, FAQ_CRUMBS),
    ];
  }

  const productMatch = /^\/products\/([^/]+)$/.exec(normalized);
  if (productMatch) {
    const found = getPickupAndParent(productMatch[1] ?? '');
    if (found) {
      const { pickup, parent } = found;
      const breadcrumbs = breadcrumbLd(base, productCrumbs(pickup, parent));
      // Variant pages canonicalise to their set, whose Product (with an
      // AggregateOffer over the positions) is the one product entity; a second
      // Product here would contradict that canonical.
      if (parent.slug !== pickup.slug) return [breadcrumbs];
      return [productLd(base, pickup), breadcrumbs];
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
          datePublished: toIsoDateTime(article.metadata.publishedAt),
          ...(article.metadata.updatedAt !== undefined
            ? { dateModified: toIsoDateTime(article.metadata.updatedAt) }
            : {}),
          // Workshop-written posts credit the linked Organization (with its url);
          // any other named author keeps a plain Organization by name.
          author:
            article.metadata.author === undefined || article.metadata.author === SITE_NAME
              ? organizationRef(base)
              : { '@type': 'Organization', name: article.metadata.author },
          publisher: organizationRef(base),
          // Articles still use placeholder SVGs, which fall back to the site's
          // default 1200x630 image; swap in real photos when they exist.
          image: `${base}${toOgImage(article.mainImage.src)}`,
          url: `${base}/articles/${article.slug}`,
          mainEntityOfPage: `${base}/articles/${article.slug}`,
        },
        breadcrumbLd(base, articleCrumbs(article)),
      ];
    }
  }

  return [];
}
