import styles from './FaqIcon.module.css';

export type FaqIconName =
  | 'made-to-order'
  | 'handwork'
  | 'batch-variation'
  | 'measurement-conditions'
  | 'specifications'
  | 'measured'
  | 'packaging'
  | 'wiring'
  | 'signature'
  | 'coil-wiring';

export interface FaqIconProps {
  name: FaqIconName;
  size?: number | undefined;
  className?: string | undefined;
}

/**
 * Decorative Art Deco line icons for the Q&A / FAQ section. Geometric,
 * single-weight linework that inherits the current color (gold). Follows the
 * NavIcon conventions: 24x24 viewBox, currentColor stroke, non-scaling stroke.
 */
export function FaqIcon({ name, size = 28, className }: FaqIconProps) {
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
      {/* Made to order — a wound bobbin / wire spool. */}
      {name === 'made-to-order' && (
        <>
          <path d="M5 4 L19 4" vectorEffect="non-scaling-stroke" />
          <path d="M5 20 L19 20" vectorEffect="non-scaling-stroke" />
          <path d="M8 4 L8 20" vectorEffect="non-scaling-stroke" />
          <path d="M16 4 L16 20" vectorEffect="non-scaling-stroke" />
          <path d="M8 8 L16 8" vectorEffect="non-scaling-stroke" />
          <path d="M8 12 L16 12" vectorEffect="non-scaling-stroke" />
          <path d="M8 16 L16 16" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* The marks of handwork — a fingerprint / maker's whorl. */}
      {name === 'handwork' && (
        <>
          <path d="M6 14 A 6 6 0 0 1 18 14" vectorEffect="non-scaling-stroke" />
          <path d="M8.5 14 A 3.5 3.5 0 0 1 15.5 14" vectorEffect="non-scaling-stroke" />
          <path d="M11 14 A 1 1 0 0 1 13 14" vectorEffect="non-scaling-stroke" />
          <path d="M12 14 L12 18.5" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* Batch variation — three lozenges of differing size. */}
      {name === 'batch-variation' && (
        <>
          <path d="M6.5 9.5 L9 12 L6.5 14.5 L4 12 Z" vectorEffect="non-scaling-stroke" />
          <path d="M12 7 L16 12 L12 17 L8 12 Z" vectorEffect="non-scaling-stroke" />
          <path d="M17.5 9.5 L20 12 L17.5 14.5 L15 12 Z" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* Measurement conditions — thermometer + humidity droplet. */}
      {name === 'measurement-conditions' && (
        <>
          <path d="M7 4 L7 14.5" vectorEffect="non-scaling-stroke" />
          <circle cx="7" cy="17" r="2.5" vectorEffect="non-scaling-stroke" />
          <circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none" />
          <path d="M9 6.5 L10.6 6.5" vectorEffect="non-scaling-stroke" />
          <path d="M9 9.5 L10.6 9.5" vectorEffect="non-scaling-stroke" />
          <path d="M9 12.5 L10.6 12.5" vectorEffect="non-scaling-stroke" />
          <path
            d="M16 8 C 13.5 12, 13.5 15.5, 16 17.5 C 18.5 15.5, 18.5 12, 16 8 Z"
            vectorEffect="non-scaling-stroke"
          />
        </>
      )}

      {/* Specifications are averages — a bell curve with its mean line. */}
      {name === 'specifications' && (
        <>
          <path d="M3 18 L21 18" vectorEffect="non-scaling-stroke" />
          <path
            d="M4 18 C 8 18, 9 7, 12 7 C 15 7, 16 18, 20 18"
            vectorEffect="non-scaling-stroke"
          />
          <path d="M12 7 L12 18" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* Measured throughout — a gauge dial with needle. */}
      {name === 'measured' && (
        <>
          <path d="M5 17 A 7 7 0 0 1 19 17" vectorEffect="non-scaling-stroke" />
          <path d="M5 17 L19 17" vectorEffect="non-scaling-stroke" />
          <path d="M12 8.5 L12 10.3" vectorEffect="non-scaling-stroke" />
          <path d="M7.1 12.1 L8.3 13.3" vectorEffect="non-scaling-stroke" />
          <path d="M16.9 12.1 L15.7 13.3" vectorEffect="non-scaling-stroke" />
          <path d="M12 17 L15.5 10.8" vectorEffect="non-scaling-stroke" />
          <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" />
        </>
      )}

      {/* Packaging — a wrapped parcel with a deco ribbon knot. */}
      {name === 'packaging' && (
        <>
          <path d="M4 8 L20 8 L20 20 L4 20 Z" vectorEffect="non-scaling-stroke" />
          <path d="M12 8 L12 20" vectorEffect="non-scaling-stroke" />
          <path d="M4 13 L20 13" vectorEffect="non-scaling-stroke" />
          <path d="M12 5 L13.6 6.5 L12 8 L10.4 6.5 Z" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* Wiring — a baseplate label with colour-coded lead wires. */}
      {name === 'wiring' && (
        <>
          <path d="M5 4 L19 4 L19 8 L5 8 Z" vectorEffect="non-scaling-stroke" />
          <path d="M7.5 8 L7.5 17" vectorEffect="non-scaling-stroke" />
          <path d="M10.5 8 L10.5 17" vectorEffect="non-scaling-stroke" />
          <path d="M13.5 8 L13.5 17" vectorEffect="non-scaling-stroke" />
          <path d="M16.5 8 L16.5 17" vectorEffect="non-scaling-stroke" />
          <circle cx="7.5" cy="18.8" r="1" fill="currentColor" stroke="none" />
          <circle cx="10.5" cy="18.8" r="1" fill="currentColor" stroke="none" />
          <circle cx="13.5" cy="18.8" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="18.8" r="1" fill="currentColor" stroke="none" />
        </>
      )}

      {/* Custom / signature — a pen nib over a written flourish. */}
      {name === 'signature' && (
        <>
          <path d="M12 3 L15 7 L12 14 L9 7 Z" vectorEffect="non-scaling-stroke" />
          <path d="M12 7 L12 13" vectorEffect="non-scaling-stroke" />
          <circle cx="12" cy="7" r="0.7" fill="currentColor" stroke="none" />
          <path d="M5 19 C 9 16, 13 21, 19 16" vectorEffect="non-scaling-stroke" />
        </>
      )}

      {/* Coil wiring — two humbucker coils joined by a series link. */}
      {name === 'coil-wiring' && (
        <>
          <path d="M4 6 L11 6 L11 18 L4 18 Z" vectorEffect="non-scaling-stroke" />
          <path d="M13 6 L20 6 L20 18 L13 18 Z" vectorEffect="non-scaling-stroke" />
          <circle cx="7.5" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="7.5" cy="14" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="10" r="1" fill="currentColor" stroke="none" />
          <circle cx="16.5" cy="14" r="1" fill="currentColor" stroke="none" />
          <path d="M7.5 18 L7.5 21 L16.5 21 L16.5 18" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}
