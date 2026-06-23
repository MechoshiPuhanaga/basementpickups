import { Link } from 'react-router';

import { Frame } from '../../atoms/Frame';
import { Heading } from '../../atoms/Heading';
import { Image } from '../../atoms/Image';
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
    <Link to={`/products/${pickup.slug}`} className={classes}>
      <Frame variant="product-card" padding="sm" className={styles['frame']}>
        <div className={styles['body']}>
          <div className={styles['imageWrap']}>
            <Image
              src={pickup.images.main}
              alt=""
              sizes="(max-width: 768px) 90vw, 33vw"
              className={styles['image']}
            />
          </div>
          <Stack direction="column" gap="xs" align="center">
            <Text variant="label" tone="muted">
              {TYPE_LABEL[pickup.type]}
            </Text>
            <Heading level={3} variant="section" align="center">
              {pickup.name}
            </Heading>
          </Stack>
          <div className={styles['price']}>
            <Price amount={pickup.price} size="md" tone="primary" />
          </div>
        </div>
      </Frame>
    </Link>
  );
}
