import type { SeoMeta } from '../src/seo/seoTypes';

const SITE_NAME = 'Basement Pickups';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function renderSeoTags(seo: SeoMeta): string {
  const e = escapeHtml;
  const tags: string[] = [
    `<title>${e(seo.title)}</title>`,
    `<meta name="description" content="${e(seo.description)}" />`,
    `<link rel="canonical" href="${e(seo.canonicalUrl)}" />`,
    ...(seo.robots !== undefined ? [`<meta name="robots" content="${e(seo.robots)}" />`] : []),
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    `<meta property="og:type" content="${e(seo.ogType)}" />`,
    `<meta property="og:title" content="${e(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${e(seo.ogDescription)}" />`,
    `<meta property="og:url" content="${e(seo.ogUrl)}" />`,
    `<meta property="og:image" content="${e(seo.ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${e(seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${e(seo.ogImage)}" />`,
  ];

  return tags.join('\n    ');
}
