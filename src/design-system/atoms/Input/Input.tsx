import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className' | 'size'
> {
  inputSize?: InputSize | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
}

export function Input({
  inputSize = 'md',
  invalid,
  type = 'text',
  className,
  ...rest
}: InputProps) {
  const classes = [styles['input'], className].filter(Boolean).join(' ');

  return (
    <input
      {...rest}
      type={type}
      className={classes}
      data-size={inputSize}
      data-invalid={invalid ? 'true' : undefined}
      aria-invalid={invalid ? true : undefined}
    />
  );
}
