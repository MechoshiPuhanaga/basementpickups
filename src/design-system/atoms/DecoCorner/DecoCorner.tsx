import styles from './DecoCorner.module.css';

export type DecoCornerVariant = 'simple' | 'stepped' | 'double' | 'bracket';

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

  if (variant === 'bracket') {
    return (
      <svg
        className={classes}
        width={size}
        height={size}
        viewBox="0 0 1200 1200"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path
          transform="rotate(-90 600 600)"
          d="m41.402 75.801c-4.418 0-8-3.582-8-8s3.582-8 8-8h892.82c4.418 0 8 3.582 8 8v76.746h52.75v-102.25c0-4.418 3.582-8 8-8h155.62c4.418 0 8 3.582 8 8v155.62c0 4.418-3.582 8-8 8h-102.97v50.961h75.668c4.418 0 8 3.582 8 8v892.82c0 4.418-3.582 8-8 8s-8-3.582-8-8v-884.82h-67.668v774.75c0 2.7617-2.2383 5-5 5-2.7617 0-5-2.2383-5-5v-774.75h-111.12c-2.3242 0-4.418-0.99219-5.8789-2.5742-1.4805-1.4531-2.3984-3.4727-2.3984-5.7109v-110.05h-773.48c-2.7617 0-5-2.2383-5-5s2.2383-5 5-5h773.48v-68.746zm900.82 78.746v102.34h103.4v-50.961h-42.652c-4.418 0-8-3.582-8-8v-43.375zm68.75-10h39.773c2.7617 0 5 2.2383 5 5 0 0.375-0.042969 0.74219-0.12109 1.0938v39.277h94.969v-139.62h-139.62v94.25zm34.652 10h-34.652v35.375h34.652z"
        />
      </svg>
    );
  }

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
