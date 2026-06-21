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
  /** Optional robots directive (e.g. "noindex, nofollow"). Omitted = indexable. */
  readonly robots?: string;
}
