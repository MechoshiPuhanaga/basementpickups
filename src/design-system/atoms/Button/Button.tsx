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
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  linkTo,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [styles['button'], className].filter(Boolean).join(' ');

  if (linkTo !== undefined) {
    return (
      <Link to={linkTo} className={classes} data-variant={variant} data-size={size}>
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
