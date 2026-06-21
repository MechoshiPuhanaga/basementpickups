import type { TextareaHTMLAttributes } from 'react';

import styles from './Textarea.module.css';

export type TextareaSize = 'sm' | 'md' | 'lg';

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'className'
> {
  textareaSize?: TextareaSize | undefined;
  invalid?: boolean | undefined;
  className?: string | undefined;
}

export function Textarea({
  textareaSize = 'md',
  invalid,
  rows = 5,
  className,
  ...rest
}: TextareaProps) {
  const classes = [styles['textarea'], className].filter(Boolean).join(' ');

  return (
    <textarea
      {...rest}
      rows={rows}
      className={classes}
      data-size={textareaSize}
      data-invalid={invalid ? 'true' : undefined}
      aria-invalid={invalid ? true : undefined}
    />
  );
}
