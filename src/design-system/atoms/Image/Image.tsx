import { imageManifest } from '../../../assets/imageManifest';
import type { ImageVariant } from '../../../assets/imageManifest.types';
import styles from './Image.module.css';

export interface ImageProps {
  /** Served URL of the original image; optimized derivatives are looked up by this path. */
  src: string;
  alt: string;
  /** Responsive `sizes` hint describing the rendered width across breakpoints. */
  sizes?: string | undefined;
  /** Above-the-fold / LCP image: load eagerly with high fetch priority. */
  priority?: boolean | undefined;
  className?: string | undefined;
}

function toSrcSet(variants: readonly ImageVariant[]): string {
  return variants.map((variant) => `${variant.src} ${String(variant.width)}w`).join(', ');
}

/**
 * Renders an image as a `<picture>` with AVIF and WebP responsive sources,
 * falling back to the original `<img>`. Format/width data comes from the
 * generated manifest (see scripts/optimize-images.mjs). Sources not present in
 * the manifest (SVGs, anything un-optimized) render as a plain `<img>`, so the
 * atom is safe for every image in the app.
 */
export function Image({ src, alt, sizes, priority = false, className }: ImageProps) {
  const entry = imageManifest[src];
  const loadingProps = priority
    ? ({ loading: 'eager', fetchPriority: 'high' } as const)
    : ({ loading: 'lazy' } as const);

  if (entry === undefined) {
    return <img src={src} alt={alt} className={className} decoding="async" {...loadingProps} />;
  }

  return (
    <picture className={styles['picture']}>
      <source type="image/avif" srcSet={toSrcSet(entry.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={toSrcSet(entry.webp)} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={entry.width}
        height={entry.height}
        className={className}
        decoding="async"
        {...loadingProps}
      />
    </picture>
  );
}
