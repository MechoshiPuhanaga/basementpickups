import type { ElementType, ReactNode } from 'react';

import styles from './VisuallyHidden.module.css';

export interface VisuallyHiddenProps {
  as?: ElementType | undefined;
  role?: string | undefined;
  'aria-live'?: 'polite' | 'assertive' | 'off' | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

/**
 * Renders content that is removed from the visual layout but remains available
 * to assistive technology — for screen-reader-only headings, labels, and
 * live-region announcements. Polymorphic via `as`.
 */
export function VisuallyHidden({
  as: Tag = 'span',
  className,
  children,
  ...rest
}: VisuallyHiddenProps) {
  const classes = [styles['hidden'], className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
