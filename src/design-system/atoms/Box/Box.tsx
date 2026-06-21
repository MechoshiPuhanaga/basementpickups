import type { ElementType, ReactNode } from 'react';

import styles from './Box.module.css';

export type BoxPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface BoxProps {
  as?: ElementType | undefined;
  padding?: BoxPadding | undefined;
  paddingInline?: BoxPadding | undefined;
  paddingBlock?: BoxPadding | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Box({
  as: Tag = 'div',
  padding,
  paddingInline,
  paddingBlock,
  className,
  children,
}: BoxProps) {
  const classes = [styles['box'], className].filter(Boolean).join(' ');

  return (
    <Tag
      className={classes}
      data-padding={padding}
      data-padding-inline={paddingInline}
      data-padding-block={paddingBlock}
    >
      {children}
    </Tag>
  );
}
