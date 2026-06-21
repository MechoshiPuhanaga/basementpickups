import type { ElementType, ReactNode } from 'react';

import styles from './Surface.module.css';

export type SurfaceVariant = 'base' | 'raised' | 'sunken';
export type SurfaceBorder = 'none' | 'line' | 'gold';

export interface SurfaceProps {
  as?: ElementType | undefined;
  variant?: SurfaceVariant | undefined;
  border?: SurfaceBorder | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Surface({
  as: Tag = 'div',
  variant = 'base',
  border = 'none',
  className,
  children,
}: SurfaceProps) {
  const classes = [styles['surface'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-variant={variant} data-border={border}>
      {children}
    </Tag>
  );
}
