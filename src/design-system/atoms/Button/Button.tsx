import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'ghost' | 'solid';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'children'
> {
  variant?: ButtonVariant | undefined;
  size?: ButtonSize | undefined;
  className?: string | undefined;
  children?: ReactNode;
  linkTo?: string | undefined;
  /** Navigation state forwarded to the underlying router Link (only when linkTo is set). */
  linkState?: unknown;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  linkTo,
  linkState,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles['button'], className].filter(Boolean).join(' ');

  if (linkTo !== undefined) {
    return (
      <Link
        to={linkTo}
        state={linkState}
        className={classes}
        data-variant={variant}
        data-size={size}
      >
        <span className={styles['label']}>{children}</span>
      </Link>
    );
  }

  return (
    <button {...rest} type={type} className={classes} data-variant={variant} data-size={size}>
      <span className={styles['label']}>{children}</span>
    </button>
  );
}
