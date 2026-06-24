import styles from './NavIcon.module.css';

export type NavIconName = 'home' | 'about' | 'shop' | 'articles' | 'faq' | 'contact' | 'cart';

export interface NavIconProps {
  name: NavIconName;
  size?: number | undefined;
  className?: string | undefined;
}

/**
 * Decorative Art Deco line icons used in navigation. Geometric, single-weight
 * linework that inherits the current color (gold in nav contexts).
 */
export function NavIcon({ name, size = 22, className }: NavIconProps) {
  const classes = [styles['icon'], className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {name === 'home' && (
        <>
          <path
            d="M2 12 L6 12 L6 8 L9 8 L9 5 L12 2 L15 5 L15 8 L18 8 L18 12 L22 12"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M4 12 L4 22 L20 22 L20 12" vectorEffect="non-scaling-stroke" />
          <path d="M10 22 L10 15 L14 15 L14 22" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {name === 'about' && (
        <>
          <path d="M4 19 L20 19" vectorEffect="non-scaling-stroke" />
          <path d="M12 19 L12 3" vectorEffect="non-scaling-stroke" />
          <path d="M12 19 L6 5" vectorEffect="non-scaling-stroke" />
          <path d="M12 19 L18 5" vectorEffect="non-scaling-stroke" />
          <path d="M12 19 L3 10" vectorEffect="non-scaling-stroke" />
          <path d="M12 19 L21 10" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {name === 'shop' && (
        <>
          <path d="M6 3 L18 3 L18 21 L6 21 Z" vectorEffect="non-scaling-stroke" />
          <circle cx="9.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="9.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="12" r="1.1" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}

      {name === 'articles' && (
        <>
          <path d="M6 3 L18 3 L18 21 L6 21 Z" vectorEffect="non-scaling-stroke" />
          <path d="M9 8 L15 8" vectorEffect="non-scaling-stroke" />
          <path d="M9 12 L15 12" vectorEffect="non-scaling-stroke" />
          <path d="M9 16 L13 16" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {name === 'faq' && (
        <>
          <path d="M8 9 A 4 4 0 1 1 12 13 L 12 15" vectorEffect="non-scaling-stroke" />
          <circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}

      {name === 'contact' && (
        <>
          <path d="M3 6 L21 6 L21 18 L3 18 Z" vectorEffect="non-scaling-stroke" />
          <path d="M3 6 L12 13 L21 6" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {name === 'cart' && (
        <>
          <path d="M3 4 L5 4 L7.2 15 L18.5 15 L20.5 7 L6.2 7" vectorEffect="non-scaling-stroke" />
          <circle cx="8.5" cy="19" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="17" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </>
      )}
    </svg>
  );
}
