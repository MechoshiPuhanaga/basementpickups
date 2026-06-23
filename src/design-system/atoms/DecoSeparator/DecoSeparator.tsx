import styles from './DecoSeparator.module.css';

export type DecoSeparatorVariant = 'diamond' | 'double-line' | 'small' | 'medallion' | 'crest';

export interface DecoSeparatorProps {
  variant?: DecoSeparatorVariant | undefined;
  className?: string | undefined;
}

export function DecoSeparator({ variant = 'diamond', className }: DecoSeparatorProps) {
  const classes = [styles['separator'], styles[`variant-${variant}`], className]
    .filter(Boolean)
    .join(' ');

  if (variant === 'medallion') {
    return (
      <div className={classes} role="presentation" aria-hidden="true">
        <svg
          className={styles['medallion']}
          viewBox="-8 426 1216 350"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m66.23 567.88-44.48 31.031 44.398 31.27 44.48-31.031zm671.13 86.508c-0.14453 1.1641-0.69531 2.2812-1.6406 3.1211l-132.22 116.79c-0.71484 0.63281-1.5586 1.0195-2.4336 1.1758l-0.011718 0.003906h-0.011719c-0.22656 0.039063-0.45703 0.066407-0.6875 0.074219-1.0312 0.074219-2.0898-0.16797-3.0312-0.76562-0.58203-0.37109-1.0625-0.84375-1.4336-1.3789l-134.75-119.02h-271.78c-2.7617 0-5-2.2383-5-5s2.2383-5 5-5h273.16c0.28906-0.027344 0.58203-0.027344 0.875 0h9.2969c0.33203-0.035157 0.66797-0.035157 1.0039 0h48.852c0.39062-0.046875 0.78516-0.046875 1.1719 0h31.094l-23.07-36.387h-405.96l-54.664 38.133c-2.7031 2.1875-6.6289 2.418-9.6133 0.31641l-58.254-41.031 0.007813-0.011719c-0.73828-0.51953-1.3984-1.1719-1.9453-1.957-2.5195-3.6055-1.6367-8.5742 1.9688-11.094l57.961-40.434c2.7031-2.1875 6.6289-2.418 9.6133-0.31641l57.348 40.391h403.54l23.07-36.391h-365.45c-2.7617 0-5-2.2383-5-5s2.2383-5 5-5h272.35c0.27734-0.57031 0.67188-1.0938 1.1758-1.5391l133-117.48c1.0391-1.5 2.7695-2.2656 4.4844-2.1367 0.24219 0.011719 0.48438 0.039062 0.72266 0.082031h0.011719l0.03125 0.007812c0.86328 0.16406 1.6875 0.55859 2.375 1.1758l135.73 119.89h271.39c2.7617 0 5 2.2383 5 5s-2.2383 5-5 5h-365.45l23.07 36.391h403.54l57.348-40.391c2.9844-2.0977 6.9102-1.8672 9.6133 0.31641l57.961 40.434c3.6055 2.5195 4.4883 7.4883 1.9688 11.094-0.54688 0.78125-1.207 1.4375-1.9453 1.957l0.007812 0.011719-58.254 41.031c-2.9844 2.0977-6.9102 1.8672-9.6133-0.31641l-54.664-38.133h-405.96l-23.07 36.387h365.45c2.7617 0 5 2.2383 5 5s-2.2383 5-5 5zm-251.66 0 87.984 84.004-53.262-84.004h-34.727zm140.12 84.793 88.812-84.793h-35.621c-0.085937 0.71484-0.32812 1.418-0.74219 2.0664l-52.453 82.727zm88.812-193.57-88.812-84.793 53.762 84.793zm-140.95-84-87.984 84h34.762c0.082031-0.16406 0.17187-0.32813 0.26953-0.48438zm-41.43 192.78 67.746 106.85 67.746-106.85h-28.906l-32.09 50.613c-2.3633 3.7266-7.3047 4.832-11.031 2.4688-1.0703-0.67969-1.9258-1.5703-2.543-2.5859l-32.016-50.496zm135.49-108.77-67.746-106.85-67.746 106.85h28.906l32.09-50.613c2.3633-3.7266 7.3047-4.832 11.031-2.4688 1.0703 0.67969 1.9258 1.5703 2.543 2.5859l32.016 50.496zm510.51 53.297-44.48-31.031-44.395 31.27 44.48 31.031zm-578.25-84.703-54.395 85.793 54.395 85.793 54.395-85.793z" />
        </svg>
      </div>
    );
  }

  if (variant === 'crest') {
    return (
      <div className={classes} role="presentation" aria-hidden="true">
        <span className={styles['crestDiamond']} />
        <span className={styles['line']} />
        <span className={styles['crestEmblem']} />
        <span className={styles['line']} />
        <span className={styles['crestDiamond']} />
      </div>
    );
  }

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
