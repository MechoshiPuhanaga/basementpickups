import styles from './DecoCorner.module.css';

export type DecoCornerVariant = 'simple' | 'stepped' | 'double';

export type DecoCornerPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface DecoCornerProps {
  variant?: DecoCornerVariant | undefined;
  position?: DecoCornerPosition | undefined;
  size?: number | undefined;
  className?: string | undefined;
}

export function DecoCorner({
  variant = 'simple',
  position = 'top-left',
  size = 40,
  className,
}: DecoCornerProps) {
  const classes = [
    styles['corner'],
    styles[`variant-${variant}`],
    styles[`position-${position}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {variant === 'simple' && (
        <path d="M0 28 L0 0 L28 0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      )}

      {variant === 'stepped' && (
        <>
          <path
            d="M0 36 L0 10 L10 10 L10 0 L36 0"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M5 22 L5 5 L22 5"
            strokeWidth="1"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}

      {variant === 'double' && (
        <>
          <path d="M0 36 L0 0 L36 0" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path
            d="M7 24 L7 7 L24 7"
            strokeWidth="1"
            opacity="0.55"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M0 0 L7 7" strokeWidth="1" opacity="0.35" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}
