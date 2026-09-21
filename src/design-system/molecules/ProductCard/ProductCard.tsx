import { Link } from 'react-router';

import { Frame } from '../../atoms/Frame';
import { Heading } from '../../atoms/Heading';
import { Image } from '../../atoms/Image';
import { Price } from '../../atoms/Price';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import type { Pickup, PickupType } from '../../../data/pickups';
import type { TestIdProps } from '../../testing';
import styles from './ProductCard.module.css';

export interface ProductCardProps extends TestIdProps {
  pickup: Pickup;
  /** This card's photo is the page's LCP candidate: load it eagerly with high priority. */
  priority?: boolean | undefined;
  className?: string | undefined;
}

const TYPE_LABEL: Record<PickupType, string> = {
  humbucker: 'Humbucker',
  single: 'Single Coil',
  p90: 'P-90',
};

export function ProductCard({
  pickup,
  priority = false,
  className,
  'data-testid': testId,
}: ProductCardProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const rootId = testId ?? `product-card-${pickup.slug}`;

  return (
    <Link to={`/products/${pickup.slug}`} className={classes} data-testid={rootId}>
      <Frame variant="product-card" padding="sm" className={styles['frame']}>
        <div className={styles['body']}>
          <div className={styles['imageWrap']}>
            <Image
              src={pickup.images.main}
              alt=""
              sizes="(max-width: 768px) 90vw, 33vw"
              priority={priority}
              className={styles['image']}
            />
          </div>
          <Stack direction="column" gap="xs" align="center">
            <Text variant="label" tone="muted">
              {TYPE_LABEL[pickup.type]}
            </Text>
            <Heading level={3} variant="section" align="center" data-testid={`${rootId}-name`}>
              {pickup.name}
            </Heading>
          </Stack>
          <div className={styles['price']}>
            <Price amount={pickup.price} size="md" tone="primary" data-testid={`${rootId}-price`} />
          </div>
        </div>
      </Frame>
    </Link>
  );
}
