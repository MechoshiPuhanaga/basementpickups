import type { ElementType, ReactNode } from 'react';

import styles from './Stack.module.css';

export type StackDirection = 'column' | 'row';
export type StackGap = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';
export type StackJustify = 'start' | 'center' | 'end' | 'between';

export interface StackProps {
  as?: ElementType | undefined;
  direction?: StackDirection | undefined;
  gap?: StackGap | undefined;
  align?: StackAlign | undefined;
  justify?: StackJustify | undefined;
  wrap?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap,
  className,
  children,
}: StackProps) {
  const classes = [styles['stack'], className].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? 'true' : undefined}
    >
      {children}
    </Tag>
  );
}
