import { Frame } from '../../atoms/Frame';
import { Image } from '../../atoms/Image';
import type { TestIdProps } from '../../testing';
import styles from './FramedImage.module.css';

export type FramedImageRatio = 'landscape' | 'square';

export interface FramedImageProps extends TestIdProps {
  src: string;
  alt: string;
  ratio?: FramedImageRatio | undefined;
  /** Responsive `sizes` hint for the rendered width across breakpoints. */
  sizes?: string | undefined;
  className?: string | undefined;
}

/**
 * A photographic image inside the design-system image frame. Used for editorial
 * mood imagery (the "spirit" photos) and any standalone framed photo on a page.
 * `ratio` chooses the aspect box: `landscape` (3:2) or `square` (1:1).
 */
export function FramedImage({
  src,
  alt,
  ratio = 'landscape',
  sizes = '(max-width: 768px) 90vw, 600px',
  className,
  'data-testid': testId,
}: FramedImageProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <Frame variant="image" padding="sm" className={classes} data-testid={testId}>
      <div className={styles['imageWrap']} data-ratio={ratio}>
        <Image
          src={src}
          alt={alt}
          sizes={sizes}
          className={styles['image']}
          data-testid={testId === undefined ? undefined : `${testId}-image`}
        />
      </div>
    </Frame>
  );
}
