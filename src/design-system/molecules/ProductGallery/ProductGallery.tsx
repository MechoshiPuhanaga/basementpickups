import { useState } from 'react';

import { Frame } from '../../atoms/Frame';
import styles from './ProductGallery.module.css';

export interface ProductGalleryImage {
  readonly src: string;
  readonly alt?: string;
}

export interface ProductGalleryProps {
  images: readonly ProductGalleryImage[];
  productName: string;
  className?: string | undefined;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  if (images.length === 0) return null;

  const safeIndex = Math.min(activeIndex, images.length - 1);
  const active = images[safeIndex];
  if (active === undefined) return null;
  const activeAlt = active.alt ?? productName;

  return (
    <div className={classes}>
      <Frame variant="image" padding="sm">
        <div className={styles['mainWrap']}>
          <img src={active.src} alt={activeAlt} className={styles['mainImage']} />
        </div>
      </Frame>
      {images.length > 1 && (
        <div
          className={styles['thumbs']}
          role="tablist"
          aria-label={`${productName} gallery thumbnails`}
        >
          {images.map((image, index) => {
            const selected = index === safeIndex;
            return (
              <button
                key={image.src}
                type="button"
                role="tab"
                aria-selected={selected}
                className={styles['thumb']}
                data-selected={selected ? 'true' : undefined}
                onClick={() => {
                  setActiveIndex(index);
                }}
              >
                <img src={image.src} alt="" className={styles['thumbImage']} loading="lazy" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
