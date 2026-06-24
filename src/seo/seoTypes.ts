export interface SeoMeta {
  readonly title: string;
  readonly description: string;
  /** Absolute canonical URL (origin + path). */
  readonly canonicalUrl: string;
  readonly ogTitle: string;
  readonly ogDescription: string;
  readonly ogType: 'website' | 'article' | 'product';
  /** Absolute page URL for Open Graph. */
  readonly ogUrl: string;
  /** Absolute Open Graph / Twitter image URL (a generated 1200x630 JPEG). */
  readonly ogImage: string;
  /** Open Graph image width in px (constant; all OG images are 1200x630). */
  readonly ogImageWidth: number;
  /** Open Graph image height in px. */
  readonly ogImageHeight: number;
  /** Open Graph image MIME type. */
  readonly ogImageType: string;
  /** Alt text describing the Open Graph / Twitter image. */
  readonly ogImageAlt: string;
  /** Optional robots directive (e.g. "noindex, nofollow"). Omitted = indexable. */
  readonly robots?: string;
  /** Article-specific Open Graph metadata, present only on article pages. */
  readonly article?: ArticleSeoMeta;
}

export interface ArticleSeoMeta {
  /** ISO date the article was published (article:published_time). */
  readonly publishedTime: string;
  /** ISO date the article was last changed (article:modified_time). */
  readonly modifiedTime?: string;
  /** Author byline (article:author). */
  readonly author?: string;
  /** Topical tags (article:tag, one meta per entry). */
  readonly tags?: readonly string[];
}
