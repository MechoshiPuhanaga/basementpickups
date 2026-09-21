import type { ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Badge.module.css';

export type BadgeVariant = 'outline' | 'soft' | 'solid';
export type BadgeTone = 'gold' | 'muted';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends TestIdProps {
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
  'data-testid': testId,
}: BadgeProps) {
  const classes = [styles['badge'], className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-testid={testId}
    >
      {children}
    </span>
  );
}
