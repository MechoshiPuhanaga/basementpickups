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
  /** Absolute Open Graph / Twitter image URL. */
  readonly ogImage: string;
  /** Optional robots directive (e.g. "noindex, nofollow"). Omitted = indexable. */
  readonly robots?: string;
}
