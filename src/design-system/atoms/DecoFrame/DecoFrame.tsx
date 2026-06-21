import { DecoCorner, type DecoCornerVariant } from '../DecoCorner';
import styles from './DecoFrame.module.css';

export type DecoFrameVariant = 'panel' | 'product-card' | 'hero' | 'image';

export interface DecoFrameProps {
  variant?: DecoFrameVariant | undefined;
  className?: string | undefined;
}

interface VariantConfig {
  corner: DecoCornerVariant;
  cornerSize: number;
}

const VARIANT_CONFIG: Record<DecoFrameVariant, VariantConfig> = {
  panel: { corner: 'simple', cornerSize: 32 },
  'product-card': { corner: 'stepped', cornerSize: 36 },
  hero: { corner: 'double', cornerSize: 56 },
  image: { corner: 'simple', cornerSize: 24 },
};

export function DecoFrame({ variant = 'panel', className }: DecoFrameProps) {
  const config = VARIANT_CONFIG[variant];
  const classes = [styles['frame'], styles[`variant-${variant}`], className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} aria-hidden="true">
      <span className={styles['border']} />
      <DecoCorner
        variant={config.corner}
        position="top-left"
        size={config.cornerSize}
        className={styles['cornerTL']}
      />
      <DecoCorner
        variant={config.corner}
        position="top-right"
        size={config.cornerSize}
        className={styles['cornerTR']}
      />
      <DecoCorner
        variant={config.corner}
        position="bottom-right"
        size={config.cornerSize}
        className={styles['cornerBR']}
      />
      <DecoCorner
        variant={config.corner}
        position="bottom-left"
        size={config.cornerSize}
        className={styles['cornerBL']}
      />
    </div>
  );
}
