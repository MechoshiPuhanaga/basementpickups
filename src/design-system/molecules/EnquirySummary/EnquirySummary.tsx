import { Price } from '../../atoms/Price';
import { Surface } from '../../atoms/Surface';
import { Text } from '../../atoms/Text';
import styles from './EnquirySummary.module.css';

export interface EnquirySummaryItem {
  readonly name: string;
  readonly qty: number;
  readonly price: number;
}

export interface EnquirySummaryProps {
  items: readonly EnquirySummaryItem[];
  title?: string | undefined;
  note?: string | undefined;
  className?: string | undefined;
}

const DEFAULT_NOTE =
  'Indicative subtotal — excludes shipping and any custom work. We confirm availability, options, and final pricing by email.';

/**
 * Read-only summary of an enquiry's selected pickups. Shown above the contact
 * form when the visitor arrives from the cart, so the message field is free for
 * their own custom requirements.
 */
export function EnquirySummary({
  items,
  title = 'Your enquiry',
  note = DEFAULT_NOTE,
  className,
}: EnquirySummaryProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <Surface as="section" variant="raised" border="gold" className={classes}>
      <Text variant="label" tone="gold">
        {title}
      </Text>
      <ul className={styles['list']}>
        {items.map((item, index) => (
          <li key={`${item.name}-${String(index)}`} className={styles['item']}>
            <span className={styles['name']}>
              <span className={styles['qty']}>{item.qty}×</span> {item.name}
            </span>
            <Price amount={item.price * item.qty} tone="primary" size="sm" />
          </li>
        ))}
      </ul>
      <div className={styles['subtotal']}>
        <Text variant="label" tone="muted">
          Subtotal
        </Text>
        <Price amount={subtotal} tone="gold" size="md" />
      </div>
      <Text variant="meta" tone="muted">
        {note}
      </Text>
    </Surface>
  );
}
