import { describe, expect, it } from 'vitest';

import { renderJsonLd, renderSeoTags } from './seo';
import type { SeoMeta } from '../src/seo/seoTypes';

const BASE: SeoMeta = {
  title: 'Tom & Jerry\'s "Shop" <b>',
  description: 'desc',
  canonicalUrl: 'https://x.test/shop',
  ogTitle: 'og title',
  ogDescription: 'og desc',
  ogType: 'website',
  ogUrl: 'https://x.test/shop',
  ogImage: 'https://x.test/img-og.jpg',
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/jpeg',
  ogImageAlt: 'alt',
};

describe('renderSeoTags', () => {
  it('escapes HTML in every value', () => {
    const html = renderSeoTags(BASE);
    expect(html).toContain('<title>Tom &amp; Jerry&#39;s &quot;Shop&quot; &lt;b&gt;</title>');
    expect(html).not.toContain('<b>');
  });

  it('renders the full set of description, canonical, OG and Twitter tags', () => {
    const html = renderSeoTags(BASE);
    expect(html).toContain('<meta name="description" content="desc" />');
    expect(html).toContain('<link rel="canonical" href="https://x.test/shop" />');
    expect(html).toContain('<meta property="og:site_name" content="Basement Pickups" />');
    expect(html).toContain('<meta property="og:locale" content="en_GB" />');
    expect(html).toContain('<meta property="og:type" content="website" />');
    expect(html).toContain('<meta property="og:title" content="og title" />');
    expect(html).toContain('<meta property="og:description" content="og desc" />');
    expect(html).toContain('<meta property="og:url" content="https://x.test/shop" />');
    expect(html).toContain('<meta property="og:image" content="https://x.test/img-og.jpg" />');
    expect(html).toContain(
      '<meta property="og:image:secure_url" content="https://x.test/img-og.jpg" />',
    );
    expect(html).toContain('<meta property="og:image:type" content="image/jpeg" />');
    expect(html).toContain('<meta property="og:image:width" content="1200" />');
    expect(html).toContain('<meta property="og:image:height" content="630" />');
    expect(html).toContain('<meta property="og:image:alt" content="alt" />');
    expect(html).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(html).toContain('<meta name="twitter:title" content="og title" />');
    expect(html).toContain('<meta name="twitter:description" content="og desc" />');
    expect(html).toContain('<meta name="twitter:image" content="https://x.test/img-og.jpg" />');
    expect(html).toContain('<meta name="twitter:image:alt" content="alt" />');
    expect(html).not.toContain('name="robots"');
    expect(html).not.toContain('article:');
  });

  it('omits the canonical link when absent and adds robots when present', () => {
    const withoutCanonical: SeoMeta = { ...BASE, robots: 'noindex, follow' };
    delete (withoutCanonical as { canonicalUrl?: string }).canonicalUrl;
    const html = renderSeoTags(withoutCanonical);
    expect(html).not.toContain('rel="canonical"');
    expect(html).toContain('<meta name="robots" content="noindex, follow" />');
  });

  it('renders article metadata with optional fields only when set', () => {
    const minimal = renderSeoTags({
      ...BASE,
      ogType: 'article',
      article: { publishedTime: '2026-06-20' },
    });
    expect(minimal).toContain('<meta property="article:published_time" content="2026-06-20" />');
    expect(minimal).not.toContain('article:modified_time');
    expect(minimal).not.toContain('article:author');
    expect(minimal).not.toContain('article:tag');

    const full = renderSeoTags({
      ...BASE,
      ogType: 'article',
      article: {
        publishedTime: '2026-06-20',
        modifiedTime: '2026-07-01',
        author: 'A & B',
        tags: ['paf', '<x>'],
      },
    });
    expect(full).toContain('<meta property="article:modified_time" content="2026-07-01" />');
    expect(full).toContain('<meta property="article:author" content="A &amp; B" />');
    expect(full).toContain('<meta property="article:tag" content="paf" />');
    expect(full).toContain('<meta property="article:tag" content="&lt;x&gt;" />');
  });
});

describe('renderJsonLd', () => {
  it('serialises each block into its own ld+json script', () => {
    const html = renderJsonLd([{ '@type': 'A' }, { '@type': 'B' }]);
    expect(html).toBe(
      '<script type="application/ld+json">{"@type":"A"}</script>\n    ' +
        '<script type="application/ld+json">{"@type":"B"}</script>',
    );
  });

  it('escapes "<" so a value can never close the script element', () => {
    const html = renderJsonLd([{ text: '</script><script>alert(1)</script>' }]);
    expect(html).not.toContain('</script><script>');
    expect(html).toContain('\\u003c/script>\\u003cscript>');
  });

  it('renders nothing for no blocks', () => {
    expect(renderJsonLd([])).toBe('');
  });
});
