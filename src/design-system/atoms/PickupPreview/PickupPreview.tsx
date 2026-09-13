import type { BobbinStyle, PickupPolepiece, PickupType } from '../../../data/pickups';
import styles from './PickupPreview.module.css';

export interface PreviewCoil {
  /** Pole-piece style of this coil: round slugs, slotted screws, or a blade. */
  readonly style: BobbinStyle;
  /** Bobbin colour name token (see `src/data/bobbinColors.ts`); resolved in CSS. */
  readonly color: string;
}

export interface PickupPreviewProps {
  /** Pickup family — sets the coil outline/proportions. */
  type: PickupType;
  /** The coils, top to bottom, as they sit on the baseplate. */
  coils: readonly PreviewCoil[];
  /** Pole-piece finish shared by every coil; tints the poles. */
  polepieces: PickupPolepiece;
  /** Accessible label, e.g. "Slug coil black, screw coil cream, nickel pole pieces". */
  label: string;
  /** Number of pole pieces per coil (6-string by default). */
  poles?: number | undefined;
  className?: string | undefined;
}

interface Shape {
  readonly width: number;
  readonly height: number;
  /** Corner radius of the coil body. */
  readonly radius: number;
  /** Inset of the first/last pole centre from the coil's edge. */
  readonly inset: number;
  readonly poleRadius: number;
}

/**
 * Top-down coil proportions per pickup family (viewBox units ≈ 1 mm). A
 * humbucker coil is a slim rounded bar; a single coil is narrower with flatter
 * ends; a P-90 is a wider "soapbar". Only the outline differs — poles are shared.
 */
const SHAPES: Record<PickupType, Shape> = {
  humbucker: { width: 72, height: 18, radius: 9, inset: 11.5, poleRadius: 3.2 },
  single: { width: 72, height: 16, radius: 4, inset: 11.5, poleRadius: 2.6 },
  p90: { width: 80, height: 26, radius: 6, inset: 15.5, poleRadius: 3.2 },
};

/** Gap between coils and the baseplate margin around them (viewBox units). */
const COIL_GAP = 1.5;
const PLATE_MARGIN = 2.5;

/**
 * A pickup seen from above — its coils stacked close together on the
 * baseplate, as on the real thing — so a customer sees the chosen bobbin
 * colours and pole-piece finish as one object. Colours come from `data-color`
 * per coil and `data-polepieces` on the root, mapped to tokens in CSS (the
 * strict prod CSP forbids inline styles).
 */
export function PickupPreview({
  type,
  coils,
  polepieces,
  label,
  poles = 6,
  className,
}: PickupPreviewProps) {
  const shape = SHAPES[type];
  const classes = [styles['preview'], className].filter(Boolean).join(' ');
  const coilCount = Math.max(coils.length, 1);
  const width = shape.width + PLATE_MARGIN * 2;
  const height = coilCount * shape.height + (coilCount - 1) * COIL_GAP + PLATE_MARGIN * 2;
  const span = shape.width - shape.inset * 2;
  const step = poles > 1 ? span / (poles - 1) : 0;
  const centres = Array.from({ length: poles }, (_, i) => shape.inset + i * step);

  return (
    <svg
      className={classes}
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      role="img"
      aria-label={label}
      data-polepieces={polepieces}
    >
      <title>{label}</title>
      <rect
        className={styles['plate']}
        x="0.5"
        y="0.5"
        width={width - 1}
        height={height - 1}
        rx={shape.radius + PLATE_MARGIN - 0.5}
      />
      {coils.map((coil, index) => {
        const top = PLATE_MARGIN + index * (shape.height + COIL_GAP);
        const cy = top + shape.height / 2;
        return (
          <g key={index} className={styles['coil']} data-color={coil.color}>
            <rect
              className={styles['body']}
              x={PLATE_MARGIN}
              y={top}
              width={shape.width}
              height={shape.height}
              rx={shape.radius}
            />
            {coil.style === 'blade' ? (
              <rect
                className={styles['pole']}
                x={PLATE_MARGIN + shape.inset - shape.poleRadius}
                y={cy - 1.4}
                width={span + shape.poleRadius * 2}
                height="2.8"
                rx="1"
              />
            ) : (
              centres.map((cx) => (
                <g key={cx}>
                  <circle
                    className={styles['pole']}
                    cx={PLATE_MARGIN + cx}
                    cy={cy}
                    r={shape.poleRadius}
                  />
                  {coil.style === 'screw' && (
                    <line
                      className={styles['slot']}
                      x1={PLATE_MARGIN + cx - shape.poleRadius * 0.62}
                      y1={cy}
                      x2={PLATE_MARGIN + cx + shape.poleRadius * 0.62}
                      y2={cy}
                    />
                  )}
                </g>
              ))
            )}
          </g>
        );
      })}
    </svg>
  );
}
