import type { ReactNode } from 'react';

import styles from './ProductLayout.module.css';

export interface ProductLayoutProps {
  gallery: ReactNode;
  details: ReactNode;
  className?: string | undefined;
}

export function ProductLayout({ gallery, details, className }: ProductLayoutProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className={styles['gallery']}>{gallery}</div>
      <div className={styles['details']}>{details}</div>
    </div>
  );
}
