import { FC } from 'react';

import { Pickup } from '@type';
import { Article, Heading, Image, P } from '@ui';

import styles from './PickupCard.scss';

interface PickupCardProps {
  pickup: Pickup;
}

export const PickupCard: FC<PickupCardProps> = ({ pickup }) => {
  return (
    <Article align="Center" className={styles.Container}>
      <Heading kind="h3">{pickup.name}</Heading>
      <div>
        <div className={styles.Images}>
          {pickup.images.map((imageUrl) => {
            return <Image alt={`${pickup.name} image`} key={imageUrl} width={300} src={imageUrl} />;
          })}
        </div>
        <Heading kind="h4">Description:</Heading>
        <P>{pickup.description}</P>
        <Heading kind="h4">Variants:</Heading>
        <ul className={styles.Variants}>
          {pickup.variants.map((pickupVariant) => {
            return (
              // TODO: fix key
              <li className={styles.Variant} key={pickupVariant.dcr}>
                <P className={styles.VariantProperty}>
                  <span>Position:</span>
                  {pickupVariant.position}
                </P>
                <P className={styles.VariantProperty}>
                  <span>Spacing:</span>
                  {`${pickupVariant.spacing} mm`}
                </P>
                <P className={styles.VariantProperty}>
                  <span>DCR:</span>
                  {pickupVariant.dcr} k&#937;
                </P>
                <P className={styles.VariantProperty}>
                  <span>Inductance:</span>
                  {`${pickupVariant.inductance} H`}
                </P>
                <P className={styles.VariantProperty}>
                  <span>Magnet:</span>
                  {pickupVariant.magnet}
                </P>
              </li>
            );
          })}
        </ul>
      </div>
    </Article>
  );
};
