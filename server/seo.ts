import type { SeoMeta } from '../src/seo/seoTypes';
import type { JsonLd } from '../src/seo/getJsonLdForUrl';

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
    `<meta property="og:image:secure_url" content="${e(seo.ogImage)}" />`,
    `<meta property="og:image:type" content="${e(seo.ogImageType)}" />`,
    `<meta property="og:image:width" content="${String(seo.ogImageWidth)}" />`,
    `<meta property="og:image:height" content="${String(seo.ogImageHeight)}" />`,
    `<meta property="og:image:alt" content="${e(seo.ogImageAlt)}" />`,
    ...(seo.article
      ? [
          `<meta property="article:published_time" content="${e(seo.article.publishedTime)}" />`,
          ...(seo.article.modifiedTime !== undefined
            ? [`<meta property="article:modified_time" content="${e(seo.article.modifiedTime)}" />`]
            : []),
          ...(seo.article.author !== undefined
            ? [`<meta property="article:author" content="${e(seo.article.author)}" />`]
            : []),
          ...(seo.article.tags ?? []).map(
            (tag) => `<meta property="article:tag" content="${e(tag)}" />`,
          ),
        ]
      : []),
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(seo.ogTitle)}" />`,
    `<meta name="twitter:description" content="${e(seo.ogDescription)}" />`,
    `<meta name="twitter:image" content="${e(seo.ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${e(seo.ogImageAlt)}" />`,
  ];

  return tags.join('\n    ');
}

/**
 * Serialize JSON-LD blocks into <script type="application/ld+json"> tags.
 * `<` is escaped to its unicode form so a string value can never break out of
 * the script element (the classic "</script>" injection). Non-executable
 * data scripts aren't subject to the script-src CSP, so no nonce is needed.
 */
export function renderJsonLd(blocks: readonly JsonLd[]): string {
  return blocks
    .map((block) => {
      const json = JSON.stringify(block).replace(/</g, '\\u003c');
      return `<script type="application/ld+json">${json}</script>`;
    })
    .join('\n    ');
}
