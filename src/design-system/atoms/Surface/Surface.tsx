import type { ElementType, ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Surface.module.css';

export type SurfaceVariant = 'base' | 'raised' | 'sunken';
export type SurfaceBorder = 'none' | 'line' | 'gold';

export interface SurfaceProps extends TestIdProps {
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
  'data-testid': testId,
}: SurfaceProps) {
  const classes = [styles['surface'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-variant={variant} data-border={border} data-testid={testId}>
      {children}
    </Tag>
  );
}
