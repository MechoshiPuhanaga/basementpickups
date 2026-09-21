import type { ReactNode, SelectHTMLAttributes } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './Select.module.css';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className' | 'size'>, TestIdProps {
  selectSize?: SelectSize | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode;
}

export function Select({
  selectSize = 'md',
  invalid,
  className,
  children,
  'data-testid': testId,
  ...rest
}: SelectProps) {
  const wrapperClasses = [styles['wrapper'], className].filter(Boolean).join(' ');
  const selectTestId = testId === undefined ? undefined : `${testId}-select`;

  return (
    <span
      className={wrapperClasses}
      data-size={selectSize}
      data-invalid={invalid ? 'true' : undefined}
      data-testid={testId}
    >
      <select
        {...rest}
        className={styles['select']}
        aria-invalid={invalid ? true : undefined}
        data-testid={selectTestId}
      >
        {children}
      </select>
      <span className={styles['chevron']} aria-hidden="true">
        <svg viewBox="0 0 12 8" fill="none" stroke="currentColor">
          <path d="M1 1.5 L6 6.5 L11 1.5" strokeWidth="1.25" strokeLinecap="square" />
        </svg>
      </span>
    </span>
  );
}
