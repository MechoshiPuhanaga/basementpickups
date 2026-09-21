import type { ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './ProductLayout.module.css';

export interface ProductLayoutProps extends TestIdProps {
  gallery: ReactNode;
  details: ReactNode;
  className?: string | undefined;
}

export function ProductLayout({
  gallery,
  details,
  className,
  'data-testid': testId,
}: ProductLayoutProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const part = (name: string) => (testId === undefined ? undefined : `${testId}-${name}`);

  return (
    <div className={classes} data-testid={testId}>
      <div className={styles['gallery']} data-testid={part('gallery')}>
        {gallery}
      </div>
      <div className={styles['details']} data-testid={part('details')}>
        {details}
      </div>
    </div>
  );
}
