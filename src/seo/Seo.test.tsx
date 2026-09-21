import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it } from 'vitest';

import { articles } from '../data/articles';
import { getSeoForUrl } from './getSeoForUrl';
import { Seo } from './Seo';

function meta(attr: 'name' | 'property', key: string): string | null {
  return (
    document.head
      .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
      ?.getAttribute('content') ?? null
  );
}

function canonical(): string | null {
  return document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? null;
}

function mount(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Seo />
    </MemoryRouter>,
  );
}

describe('Seo (client head sync)', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.title = '';
  });

  it('renders nothing and writes title, description, canonical and OG/Twitter tags', () => {
    const { container } = mount('/shop');
    const seo = getSeoForUrl('/shop', window.location.origin);
    expect(container).toBeEmptyDOMElement();
    expect(document.title).toBe(seo.title);
    expect(meta('name', 'description')).toBe(seo.description);
    expect(canonical()).toBe(seo.canonicalUrl);
    expect(meta('property', 'og:type')).toBe('website');
    expect(meta('property', 'og:title')).toBe(seo.ogTitle);
    expect(meta('property', 'og:description')).toBe(seo.ogDescription);
    expect(meta('property', 'og:url')).toBe(seo.ogUrl);
    expect(meta('property', 'og:image')).toBe(seo.ogImage);
    expect(meta('property', 'og:image:alt')).toBe(seo.ogImageAlt);
    expect(meta('name', 'twitter:title')).toBe(seo.ogTitle);
    expect(meta('name', 'twitter:description')).toBe(seo.ogDescription);
    expect(meta('name', 'twitter:image')).toBe(seo.ogImage);
    expect(meta('name', 'twitter:image:alt')).toBe(seo.ogImageAlt);
    expect(meta('name', 'robots')).toBeNull();
  });

  it('updates existing tags in place on navigation instead of duplicating them', () => {
    mount('/shop').unmount();
    mount('/about');
    const seo = getSeoForUrl('/about', window.location.origin);
    expect(document.title).toBe(seo.title);
    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(meta('name', 'description')).toBe(seo.description);
    expect(canonical()).toBe(seo.canonicalUrl);
  });

  it('adds, updates and removes the robots tag as routes change', () => {
    mount('/cart').unmount();
    expect(meta('name', 'robots')).toBe('noindex, nofollow');
    mount('/does-not-exist').unmount();
    expect(meta('name', 'robots')).toBe(getSeoForUrl('/does-not-exist').robots ?? null);
    expect(document.head.querySelectorAll('meta[name="robots"]')).toHaveLength(1);
    mount('/');
    expect(meta('name', 'robots')).toBeNull();
  });

  it('removes the canonical link on pages that must not declare one', () => {
    mount('/').unmount();
    expect(canonical()).not.toBeNull();
    mount('/does-not-exist');
    expect(canonical()).toBeNull();
  });

  it('writes article:* tags for articles and clears them elsewhere', () => {
    const article = articles[0];
    if (article === undefined) throw new Error('no articles');
    const path = `/articles/${article.slug}`;
    mount(path).unmount();
    const seo = getSeoForUrl(path, window.location.origin);
    expect(meta('property', 'og:type')).toBe('article');
    expect(meta('property', 'article:published_time')).toBe(seo.article?.publishedTime ?? null);
    expect(meta('property', 'article:author')).toBe(seo.article?.author ?? null);
    expect(meta('property', 'article:modified_time')).toBe(seo.article?.modifiedTime ?? null);
    const tags = Array.from(document.head.querySelectorAll('meta[property="article:tag"]')).map(
      (el) => el.getAttribute('content'),
    );
    expect(tags).toEqual(seo.article?.tags ?? []);

    // A second article rebuilds the tag list rather than appending to it.
    const other = articles[1] ?? article;
    mount(`/articles/${other.slug}`).unmount();
    const otherSeo = getSeoForUrl(`/articles/${other.slug}`);
    expect(document.head.querySelectorAll('meta[property="article:tag"]')).toHaveLength(
      otherSeo.article?.tags?.length ?? 0,
    );

    mount('/shop');
    expect(document.head.querySelectorAll('meta[property^="article:"]')).toHaveLength(0);
    expect(meta('property', 'og:type')).toBe('website');
  });
});
