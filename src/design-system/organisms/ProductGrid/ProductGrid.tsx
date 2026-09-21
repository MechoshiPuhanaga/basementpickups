import { Grid, type GridColumns } from '../../atoms/Grid';
import { Heading } from '../../atoms/Heading';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import { ProductCard } from '../../molecules/ProductCard';
import type { Pickup } from '../../../data/pickups';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  pickups: readonly Pickup[];
  eyebrow?: string | undefined;
  title?: string | undefined;
  lead?: string | undefined;
  columns?: GridColumns | undefined;
  /**
   * The grid is the first thing in the viewport (e.g. the shop page), so its
   * first card is the LCP candidate and loads with high priority. Leave off
   * when something above it (a hero) already owns the LCP.
   */
  priorityFirst?: boolean | undefined;
  className?: string | undefined;
}

export function ProductGrid({
  pickups,
  eyebrow,
  title,
  lead,
  columns = 3,
  priorityFirst = false,
  className,
}: ProductGridProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const hasHeader = eyebrow !== undefined || title !== undefined || lead !== undefined;

  return (
    <section className={classes}>
      <Stack direction="column" gap="xl" align="stretch">
        {hasHeader && (
          <Stack direction="column" gap="xs" align="center" className={styles['header']}>
            {eyebrow !== undefined && (
              <Text variant="label" tone="gold" align="center">
                {eyebrow}
              </Text>
            )}
            {title !== undefined && (
              <Heading level={2} variant="display" align="center">
                {title}
              </Heading>
            )}
            {lead !== undefined && (
              <Text variant="lead" tone="muted" align="center">
                {lead}
              </Text>
            )}
          </Stack>
        )}
        <Grid columns={columns} mobileColumns={2} gap="lg" align="stretch">
          {pickups.map((pickup, index) => (
            <ProductCard key={pickup.id} pickup={pickup} priority={priorityFirst && index === 0} />
          ))}
        </Grid>
      </Stack>
    </section>
  );
}
