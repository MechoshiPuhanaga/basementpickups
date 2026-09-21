import { pickups } from '../src/data/pickups';
import { articles } from '../src/data/articles';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildRobotsTxt(origin: string): string {
  // /cart is noindex and per-visitor; /api is not a page.
  return `User-agent: *\nAllow: /\nDisallow: /cart\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
}

export function buildLlmsTxt(origin: string): string {
  const products = pickups
    .flatMap((p) => [
      `- [${p.name}](${origin}/products/${p.slug}): ${p.description}`,
      ...(p.variants ?? []).map(
        (v) => `  - [${v.name}](${origin}/products/${v.slug}): ${v.seoDescription}`,
      ),
    ])
    .join('\n');
  const posts = articles
    .map((a) => `- [${a.headline}](${origin}/articles/${a.slug}): ${a.excerpt}`)
    .join('\n');

  return `# Basement Pickups

> Handcrafted boutique guitar pickups. Premium tone, restrained design, deliberate craftsmanship. Every pickup is wound to order in-house.

Basement Pickups is a boutique workshop building hand-wound electric guitar pickups (humbuckers, single-coils, P-90s). There is no online checkout: customers assemble an enquiry and send it to the workshop, and pickups are made to order.

## Pages

- [Home](${origin}/): The brand, featured pickups, and the latest articles.
- [Shop](${origin}/shop): The full collection of available pickups.
- [About](${origin}/about): The workshop, the craft, and the philosophy.
- [Articles](${origin}/articles): Editorial on winding, tone, magnets, and process.
- [Q&A](${origin}/faq): How pickups are made and measured, lead times, and what to expect.
- [Contact](${origin}/contact): Get in touch with the workshop.

## Products

${products}

## Articles

${posts}
`;
}

export function buildSitemapXml(origin: string): string {
  const entries: { path: string; lastmod?: string }[] = [
    '/',
    '/shop',
    '/about',
    '/articles',
    '/faq',
    '/contact',
  ].map((path) => ({ path }));

  // Neck/bridge variant pages canonicalise to their set page (see
  // getSeoForUrl), so only the set is listed.
  for (const pickup of pickups) {
    entries.push({ path: `/products/${pickup.slug}` });
  }

  for (const article of articles) {
    entries.push({
      path: `/articles/${article.slug}`,
      lastmod: article.metadata.publishedAt,
    });
  }

  const urls = entries
    .map(({ path: urlPath, lastmod }) => {
      const lastmodTag = lastmod !== undefined ? `<lastmod>${lastmod}</lastmod>` : '';
      return `  <url><loc>${escapeXml(`${origin}${urlPath}`)}</loc>${lastmodTag}</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
