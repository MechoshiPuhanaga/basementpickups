import type { ElementType, ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Grid.module.css';

export type GridColumns = 1 | 2 | 3 | 4;
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps extends TestIdProps {
  as?: ElementType | undefined;
  columns?: GridColumns | undefined;
  /** Column count on phones/tablets (≤768px). Defaults to 1 (single column). */
  mobileColumns?: 1 | 2 | undefined;
  gap?: GridGap | undefined;
  align?: GridAlign | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Grid({
  as: Tag = 'div',
  columns = 3,
  mobileColumns = 1,
  gap = 'lg',
  align,
  className,
  children,
  'data-testid': testId,
}: GridProps) {
  const classes = [styles['grid'], className].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      data-columns={columns}
      data-mobile-columns={mobileColumns}
      data-gap={gap}
      data-align={align}
      data-testid={testId}
    >
      {children}
    </Tag>
  );
}
