import styles from './Swatch.module.css';

export type SwatchSize = 'sm' | 'md';

export interface SwatchProps {
  /**
   * A bobbin-color name token (e.g. `cream`, `light-blue`); see
   * `src/data/bobbinColors.ts`. The fill is resolved in CSS via `data-color`
   * (inline styles are forbidden by the strict production CSP), so every
   * supported token must have a matching rule in `Swatch.module.css`.
   */
  color: string;
  /** Accessible + on-hover label, e.g. "Cream" or "Light blue". */
  label: string;
  size?: SwatchSize | undefined;
  className?: string | undefined;
}

/** A single round color chip used to show available finishes (e.g. bobbins). */
export function Swatch({ color, label, size = 'md', className }: SwatchProps) {
  const classes = [styles['swatch'], className].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      data-color={color}
      data-size={size}
      role="img"
      aria-label={label}
      title={label}
    />
  );
}
