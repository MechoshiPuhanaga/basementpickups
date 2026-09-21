import type { ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Callout.module.css';

export type CalloutTone = 'success' | 'error' | 'info';

export interface CalloutProps extends TestIdProps {
  tone?: CalloutTone | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

/**
 * Art Deco message box for inline feedback (form results, notices). Purely
 * presentational — when used for live announcements, place it inside an
 * `aria-live` region owned by the parent so updates are announced.
 */
export function Callout({
  tone = 'info',
  className,
  children,
  'data-testid': testId,
}: CalloutProps) {
  const classes = [styles['callout'], className].filter(Boolean).join(' ');

  return (
    <div className={classes} data-tone={tone} data-testid={testId}>
      <span className={styles['mark']} aria-hidden="true" />
      <span className={styles['message']}>{children}</span>
    </div>
  );
}
