import type { ElementType, ReactNode } from 'react';

import { DecoFrame, type DecoFrameVariant } from '../DecoFrame';
import styles from './Frame.module.css';

export type FrameVariant = DecoFrameVariant;
export type FramePadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface FrameProps {
  as?: ElementType | undefined;
  variant?: FrameVariant | undefined;
  padding?: FramePadding | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Frame({
  as: Tag = 'div',
  variant = 'panel',
  padding = 'md',
  className,
  children,
}: FrameProps) {
  const classes = [styles['frame'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-variant={variant} data-padding={padding}>
      <div className={styles['content']}>{children}</div>
      <DecoFrame variant={variant} />
    </Tag>
  );
}
