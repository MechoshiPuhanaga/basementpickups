import styles from './DecoSeparator.module.css';

export type DecoSeparatorVariant = 'diamond' | 'double-line' | 'small';

export interface DecoSeparatorProps {
  variant?: DecoSeparatorVariant | undefined;
  className?: string | undefined;
}

export function DecoSeparator({ variant = 'diamond', className }: DecoSeparatorProps) {
  const classes = [styles['separator'], styles[`variant-${variant}`], className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'double-line') {
    return (
      <div className={classes} role="presentation" aria-hidden="true">
        <span className={styles['line']} />
        <span className={styles['line']} />
      </div>
    );
  }

  return (
    <div className={classes} role="presentation" aria-hidden="true">
      <span className={styles['line']} />
      <svg
        className={styles['diamond']}
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M6 1 L11 6 L6 11 L1 6 Z" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className={styles['line']} />
    </div>
  );
}
