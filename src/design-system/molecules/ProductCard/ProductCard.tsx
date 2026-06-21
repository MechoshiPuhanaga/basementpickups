import { Link } from 'react-router';

import { Frame } from '../../atoms/Frame';
import { Heading } from '../../atoms/Heading';
import { Price } from '../../atoms/Price';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import type { Pickup, PickupType } from '../../../data/pickups';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
  pickup: Pickup;
  className?: string | undefined;
}

const TYPE_LABEL: Record<PickupType, string> = {
  humbucker: 'Humbucker',
  single: 'Single Coil',
  p90: 'P-90',
};

export function ProductCard({ pickup, className }: ProductCardProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <Link
      to={`/products/${pickup.slug}`}
      className={classes}
      aria-label={`${pickup.name} — view pickup details`}
    >
      <Frame variant="product-card" padding="sm">
        <Stack direction="column" gap="md" align="stretch">
          <div className={styles['imageWrap']}>
            <img src={pickup.images.main} alt="" className={styles['image']} loading="lazy" />
          </div>
          <Stack direction="column" gap="xs" align="center">
            <Text variant="label" tone="muted">
              {TYPE_LABEL[pickup.type]}
            </Text>
            <Heading level={3} variant="section" align="center">
              {pickup.name}
            </Heading>
            <Price amount={pickup.price} size="md" tone="primary" />
          </Stack>
        </Stack>
      </Frame>
    </Link>
  );
}
