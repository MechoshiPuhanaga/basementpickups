import { FC, ReactNode } from 'react';

import { classer } from '@services/ui';

import styles from './Article.scss';

interface ArticleProps {
  align?: 'Start' | 'Center';
  children: ReactNode;
  className?: string;
  gap?: 'S' | 'M' | 'L';
}

export const Article: FC<ArticleProps> = ({ align = 'Start', children, className, gap = 'M' }) => {
  return (
    <article
      className={classer(styles.Container, styles[`Gap${gap}`], styles[`Align${align}`], className)}
    >
      {children}
    </article>
  );
};

Article.displayName = 'Article';
