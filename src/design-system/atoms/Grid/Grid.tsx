import type { ElementType, ReactNode } from 'react';

import styles from './Grid.module.css';

export type GridColumns = 1 | 2 | 3 | 4;
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

export interface GridProps {
  as?: ElementType | undefined;
  columns?: GridColumns | undefined;
  gap?: GridGap | undefined;
  align?: GridAlign | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Grid({
  as: Tag = 'div',
  columns = 3,
  gap = 'lg',
  align,
  className,
  children,
}: GridProps) {
  const classes = [styles['grid'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-columns={columns} data-gap={gap} data-align={align}>
      {children}
    </Tag>
  );
}
