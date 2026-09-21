import type { ElementType, ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Section.module.css';

export type SectionSpacing = 'sm' | 'md' | 'lg' | 'xl';
export type SectionMaxWidth = 'narrow' | 'default' | 'wide' | 'full';

export interface SectionProps extends TestIdProps {
  as?: ElementType | undefined;
  spacing?: SectionSpacing | undefined;
  maxWidth?: SectionMaxWidth | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Section({
  as: Tag = 'section',
  spacing = 'lg',
  maxWidth = 'default',
  className,
  children,
  'data-testid': testId,
}: SectionProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} data-spacing={spacing} data-max-width={maxWidth} data-testid={testId}>
      <div className={styles['inner']}>{children}</div>
    </Tag>
  );
}
