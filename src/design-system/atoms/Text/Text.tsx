import type { ElementType, ReactNode } from 'react';

import styles from './Text.module.css';

export type TextVariant = 'body' | 'lead' | 'editorial' | 'label' | 'meta';
export type TextTone = 'primary' | 'muted' | 'gold';
export type TextAlign = 'start' | 'center' | 'end';
export type TextWeight = 'regular' | 'medium' | 'semibold';

export interface TextProps {
  as?: ElementType | undefined;
  variant?: TextVariant | undefined;
  tone?: TextTone | undefined;
  align?: TextAlign | undefined;
  weight?: TextWeight | undefined;
  italic?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Text({
  as: Tag = 'p',
  variant = 'body',
  tone,
  align,
  weight,
  italic,
  className,
  children,
}: TextProps) {
  const classes = [styles['text'], className].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      data-variant={variant}
      data-tone={tone}
      data-align={align}
      data-weight={weight}
      data-italic={italic ? 'true' : undefined}
    >
      {children}
    </Tag>
  );
}
