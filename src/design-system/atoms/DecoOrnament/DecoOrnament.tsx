import styles from './DecoOrnament.module.css';

export type DecoOrnamentVariant = 'diamond' | 'centerpiece';

export interface DecoOrnamentProps {
  variant?: DecoOrnamentVariant | undefined;
  size?: number | undefined;
  /** Render the diamond as a solid fill instead of an outline. */
  filled?: boolean | undefined;
  className?: string | undefined;
}

export function DecoOrnament({ variant = 'diamond', size, filled, className }: DecoOrnamentProps) {
  const classes = [styles['ornament'], styles[`variant-${variant}`], className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'centerpiece') {
    return (
      <svg
        className={classes}
        width={size ?? 80}
        height={size ? Math.round(size * 0.2) : 16}
        viewBox="0 0 80 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="square"
        aria-hidden="true"
        focusable="false"
      >
        <line x1="0" y1="8" x2="30" y2="8" vectorEffect="non-scaling-stroke" />
        <line x1="50" y1="8" x2="80" y2="8" vectorEffect="non-scaling-stroke" />
        <path d="M40 3 L45 8 L40 13 L35 8 Z" vectorEffect="non-scaling-stroke" />
      </svg>
    );
  }

  return (
    <svg
      className={classes}
      width={size ?? 14}
      height={size ?? 14}
      viewBox="0 0 14 14"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth="1"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M7 1 L13 7 L7 13 L1 7 Z" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
