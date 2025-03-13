import { FC } from 'react';

import styles from './Image.scss';

interface ImageProps {
  alt: string;
  src: string;
  width: number;
}

export const Image: FC<ImageProps> = ({ alt, src, width }) => {
  return <img alt={alt} className={styles.Container} src={src} width={width} />;
};

Image.displayName = 'Image';
