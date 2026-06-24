import { useEffect } from 'react';
import { useLocation } from 'react-router';

import { getSeoForUrl } from './getSeoForUrl';
import type { SeoMeta } from './seoTypes';

/**
 * Client-side SEO updater. The canonical, crawler-facing meta tags are injected
 * into the document <head> by the server before streaming (see server/seo.ts);
 * this component intentionally renders nothing during SSR so those tags are not
 * duplicated. After hydration it keeps <title> and the meta/canonical tags in
 * sync on client-side (SPA) navigation by updating the existing head elements
 * in place.
 */

function upsertMeta(attr: 'name' | 'property', key: string, content: string): void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (el === null) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string): void {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (el === null) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = href;
}

function setRobots(robots: string | undefined): void {
  const el = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (robots === undefined) {
    el?.remove();
    return;
  }
  if (el === null) {
    upsertMeta('name', 'robots', robots);
  } else {
    el.setAttribute('content', robots);
  }
}

/**
 * Sync the article:* Open Graph tags. They exist only on article pages, so on
 * any other route we remove whatever the previous article left behind. `tags`
 * map to repeated article:tag meta, so those are cleared and rebuilt each time.
 */
function setArticleMeta(article: SeoMeta['article']): void {
  const head = document.head;
  head.querySelectorAll('meta[property^="article:"]').forEach((el) => {
    el.remove();
  });
  if (article === undefined) return;

  upsertMeta('property', 'article:published_time', article.publishedTime);
  if (article.modifiedTime !== undefined) {
    upsertMeta('property', 'article:modified_time', article.modifiedTime);
  }
  if (article.author !== undefined) {
    upsertMeta('property', 'article:author', article.author);
  }
  for (const tag of article.tags ?? []) {
    const el = document.createElement('meta');
    el.setAttribute('property', 'article:tag');
    el.setAttribute('content', tag);
    head.appendChild(el);
  }
}

export function Seo() {
  const location = useLocation();

  useEffect(() => {
    const seo = getSeoForUrl(location.pathname, window.location.origin);
    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    upsertCanonical(seo.canonicalUrl);
    setRobots(seo.robots);
    upsertMeta('property', 'og:type', seo.ogType);
    upsertMeta('property', 'og:title', seo.ogTitle);
    upsertMeta('property', 'og:description', seo.ogDescription);
    upsertMeta('property', 'og:url', seo.ogUrl);
    upsertMeta('property', 'og:image', seo.ogImage);
    upsertMeta('property', 'og:image:alt', seo.ogImageAlt);
    setArticleMeta(seo.article);
    upsertMeta('name', 'twitter:title', seo.ogTitle);
    upsertMeta('name', 'twitter:description', seo.ogDescription);
    upsertMeta('name', 'twitter:image', seo.ogImage);
    upsertMeta('name', 'twitter:image:alt', seo.ogImageAlt);
  }, [location.pathname]);

  return null;
}
