import { imageManifest } from '../../../assets/imageManifest';
import type { ImageVariant } from '../../../assets/imageManifest.types';
import type { TestIdProps } from '../../testing';
import styles from './Image.module.css';

export interface ImageProps extends TestIdProps {
  /** Served URL of the original image; optimized derivatives are looked up by this path. */
  src: string;
  alt: string;
  /** Responsive `sizes` hint describing the rendered width across breakpoints. */
  sizes?: string | undefined;
  /** Above-the-fold / LCP image: load eagerly with high fetch priority. */
  priority?: boolean | undefined;
  /**
   * Intrinsic size for sources that aren't in the manifest (SVGs), so the
   * browser can reserve space before load. Manifest entries carry their own.
   */
  width?: number | undefined;
  height?: number | undefined;
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
export function Image({
  src,
  alt,
  sizes,
  priority = false,
  width,
  height,
  className,
  'data-testid': testId,
}: ImageProps) {
  const entry = imageManifest[src];
  const imgTestId = testId === undefined ? undefined : `${testId}-img`;
  const loadingProps = priority
    ? ({ loading: 'eager', fetchPriority: 'high' } as const)
    : ({ loading: 'lazy' } as const);

  if (entry === undefined) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        decoding="async"
        data-testid={testId}
        {...loadingProps}
      />
    );
  }

  return (
    <picture className={styles['picture']} data-testid={testId}>
      <source type="image/avif" srcSet={toSrcSet(entry.avif)} sizes={sizes} />
      <source type="image/webp" srcSet={toSrcSet(entry.webp)} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={entry.width}
        height={entry.height}
        className={className}
        decoding="async"
        data-testid={imgTestId}
        {...loadingProps}
      />
    </picture>
  );
}
