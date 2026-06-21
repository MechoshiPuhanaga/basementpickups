import type { ReactNode } from 'react';

import styles from './Badge.module.css';

export type BadgeVariant = 'outline' | 'soft' | 'solid';
export type BadgeTone = 'gold' | 'muted';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant | undefined;
  tone?: BadgeTone | undefined;
  size?: BadgeSize | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Badge({
  variant = 'outline',
  tone = 'gold',
  size = 'sm',
  className,
  children,
}: BadgeProps) {
  const classes = [styles['badge'], className].filter(Boolean).join(' ');

  return (
    <span className={classes} data-variant={variant} data-tone={tone} data-size={size}>
      {children}
    </span>
  );
}
