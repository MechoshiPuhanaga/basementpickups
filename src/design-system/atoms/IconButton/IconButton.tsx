import type { ButtonHTMLAttributes, ReactNode } from 'react';

import styles from './IconButton.module.css';

export type IconButtonVariant = 'ghost' | 'outlined';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'className' | 'aria-label' | 'children'
> {
  label: string;
  variant?: IconButtonVariant | undefined;
  size?: IconButtonSize | undefined;
  className?: string | undefined;
  children: ReactNode;
}

export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  type = 'button',
  className,
  children,
  ...rest
}: IconButtonProps) {
  const classes = [styles['iconButton'], className].filter(Boolean).join(' ');

  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      className={classes}
      data-variant={variant}
      data-size={size}
    >
      <span className={styles['icon']} aria-hidden="true">
        {children}
      </span>
    </button>
  );
}
