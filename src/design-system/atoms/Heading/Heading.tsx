import type { ReactNode } from 'react';

import styles from './Heading.module.css';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingVariant = 'hero' | 'display' | 'section' | 'editorial';
export type HeadingAlign = 'start' | 'center' | 'end';
export type HeadingTone = 'primary' | 'muted' | 'gold';

export interface HeadingProps {
  level?: HeadingLevel | undefined;
  variant?: HeadingVariant | undefined;
  align?: HeadingAlign | undefined;
  tone?: HeadingTone | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Heading({
  level = 2,
  variant = 'display',
  align,
  tone,
  className,
  children,
}: HeadingProps) {
  const Tag = `h${String(level)}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const classes = [styles['heading'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-variant={variant} data-align={align} data-tone={tone}>
      {children}
    </Tag>
  );
}
