/**
 * Types for the generated image manifest (`imageManifest.ts`).
 *
 * The manifest is produced by `scripts/optimize-images.mjs` and maps each
 * original image's served URL to its intrinsic dimensions and the responsive
 * AVIF/WebP derivatives generated alongside it.
 */

export interface ImageVariant {
  /** Rendered pixel width of this derivative (the `w` descriptor in srcset). */
  readonly width: number;
  /** Served URL of the derivative file. */
  readonly src: string;
}

export interface ImageManifestEntry {
  /** Intrinsic width of the original image (for the `<img>` aspect ratio). */
  readonly width: number;
  /** Intrinsic height of the original image. */
  readonly height: number;
  /** AVIF derivatives, ascending by width. */
  readonly avif: readonly ImageVariant[];
  /** WebP derivatives, ascending by width. */
  readonly webp: readonly ImageVariant[];
}

/** Keyed by the original image's served URL (e.g. `/assets/images/...png`). */
export type ImageManifest = Record<string, ImageManifestEntry>;
