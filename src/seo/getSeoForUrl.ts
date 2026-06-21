import type { SeoMeta } from './seoTypes';
import { getPickupBySlug } from '../data/pickups';
import { getArticleBySlug } from '../data/articles';

const SITE_NAME = 'Basement Pickups';
const DEFAULT_DESCRIPTION =
  'Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship.';
const DEFAULT_OG_IMAGE = '/assets/images/spirit-photos/bp-spirit-1.png';

function withSiteName(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

interface SeoInput {
  readonly title: string;
  readonly description: string;
  readonly path: string;
  readonly ogType: SeoMeta['ogType'];
  readonly ogImage?: string;
  readonly robots?: string;
}

function build(origin: string, input: SeoInput): SeoMeta {
  const base = origin.replace(/\/+$/, '');
  const url = `${base}${input.path}`;
  return {
    title: input.title,
    description: input.description,
    canonicalUrl: url,
    ogTitle: input.title,
    ogDescription: input.description,
    ogType: input.ogType,
    ogUrl: url,
    ogImage: `${base}${input.ogImage ?? DEFAULT_OG_IMAGE}`,
    ...(input.robots !== undefined ? { robots: input.robots } : {}),
  };
}

/**
 * Resolve SEO metadata for a pathname. `origin` (e.g. https://basementpickups.com)
 * is supplied by the server from the request and by the client from
 * window.location.origin, so canonical/OG URLs are always absolute.
 */
export function getSeoForUrl(pathname: string, origin = ''): SeoMeta {
  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/') {
    return build(origin, {
      title: withSiteName('Handcrafted Guitar Pickups'),
      description: DEFAULT_DESCRIPTION,
      path: '/',
      ogType: 'website',
    });
  }

  if (normalized === '/shop') {
    return build(origin, {
      title: withSiteName('Shop Pickups'),
      description: 'Browse the full collection of handcrafted Basement Pickups.',
      path: '/shop',
      ogType: 'website',
    });
  }

  if (normalized === '/about') {
    return build(origin, {
      title: withSiteName('About'),
      description: 'The workshop, the craft, and the philosophy behind Basement Pickups.',
      path: '/about',
      ogType: 'website',
    });
  }

  if (normalized === '/articles') {
    return build(origin, {
      title: withSiteName('Articles'),
      description:
        'Editorial on winding, tone, magnets, and the workshop process from Basement Pickups.',
      path: '/articles',
      ogType: 'website',
    });
  }

  if (normalized === '/cart') {
    return build(origin, {
      title: withSiteName('Your enquiry'),
      description: 'Review the pickups in your enquiry before sending it to the workshop.',
      path: '/cart',
      ogType: 'website',
      robots: 'noindex, nofollow',
    });
  }

  if (normalized === '/contact') {
    return build(origin, {
      title: withSiteName('Contact'),
      description: 'Get in touch with the Basement Pickups workshop.',
      path: '/contact',
      ogType: 'website',
    });
  }

  const productMatch = /^\/products\/([^/]+)$/.exec(normalized);
  if (productMatch) {
    const slug = productMatch[1] ?? '';
    const pickup = getPickupBySlug(slug);
    if (pickup) {
      return build(origin, {
        title: withSiteName(pickup.name),
        description: pickup.description,
        path: `/products/${pickup.slug}`,
        ogType: 'product',
        ogImage: pickup.images.main,
      });
    }
  }

  const articleMatch = /^\/articles\/([^/]+)$/.exec(normalized);
  if (articleMatch) {
    const slug = articleMatch[1] ?? '';
    const article = getArticleBySlug(slug);
    if (article) {
      // Article placeholder images are SVG; social platforms want raster, so
      // fall back to the default OG image for now.
      const image = article.mainImage.src.endsWith('.svg') ? undefined : article.mainImage.src;
      return build(origin, {
        title: withSiteName(article.headline),
        description: article.excerpt,
        path: `/articles/${article.slug}`,
        ogType: 'article',
        ...(image !== undefined ? { ogImage: image } : {}),
      });
    }
  }

  return build(origin, {
    title: withSiteName('Not Found'),
    description: 'The page you are looking for does not exist.',
    path: normalized,
    ogType: 'website',
    robots: 'noindex, nofollow',
  });
}

const STATIC_PATHS = new Set(['/', '/shop', '/about', '/articles', '/contact', '/cart']);

/**
 * HTTP status for a pathname: 404 for the splat route and for unknown
 * product/article slugs (so they aren't soft-404s), 200 otherwise.
 */
export function getStatusForUrl(pathname: string): number {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (STATIC_PATHS.has(normalized)) return 200;

  const productMatch = /^\/products\/([^/]+)$/.exec(normalized);
  if (productMatch) {
    return getPickupBySlug(productMatch[1] ?? '') !== undefined ? 200 : 404;
  }

  const articleMatch = /^\/articles\/([^/]+)$/.exec(normalized);
  if (articleMatch) {
    return getArticleBySlug(articleMatch[1] ?? '') !== undefined ? 200 : 404;
  }

  return 404;
}
