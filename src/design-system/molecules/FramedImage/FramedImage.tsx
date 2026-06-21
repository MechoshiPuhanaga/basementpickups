import { Frame } from '../../atoms/Frame';
import styles from './FramedImage.module.css';

export type FramedImageRatio = 'landscape' | 'square';

export interface FramedImageProps {
  src: string;
  alt: string;
  ratio?: FramedImageRatio | undefined;
  className?: string | undefined;
}

/**
 * A photographic image inside the design-system image frame. Used for editorial
 * mood imagery (the "spirit" photos) and any standalone framed photo on a page.
 * `ratio` chooses the aspect box: `landscape` (3:2) or `square` (1:1).
 */
export function FramedImage({ src, alt, ratio = 'landscape', className }: FramedImageProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <Frame variant="image" padding="sm" className={classes}>
      <div className={styles['imageWrap']} data-ratio={ratio}>
        <img src={src} alt={alt} className={styles['image']} loading="lazy" />
      </div>
    </Frame>
  );
}
