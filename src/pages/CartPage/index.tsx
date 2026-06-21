import { useNavigate } from 'react-router';

import { Button } from '../../design-system/atoms/Button';
import { Heading } from '../../design-system/atoms/Heading';
import { IconButton } from '../../design-system/atoms/IconButton';
import { Price } from '../../design-system/atoms/Price';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { useCart, type CartItem } from '../../cart/CartContext';
import styles from './CartPage.module.css';

function buildEnquiryMessage(items: readonly CartItem[], subtotal: number): string {
  const lines = items
    .map((item) => `- ${String(item.qty)} × ${item.name} (€${String(item.price)})`)
    .join('\n');
  return `I'd like to inquire about the following pickups:\n\n${lines}\n\nIndicative subtotal: €${String(subtotal)}`;
}

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Section spacing="lg" maxWidth="narrow">
        <Stack direction="column" gap="md" align="center">
          <Text variant="label" tone="gold" align="center">
            Enquiry
          </Text>
          <Heading level={1} variant="display" align="center">
            Your enquiry
          </Heading>
          <Text variant="lead" tone="muted" align="center">
            Your enquiry list is empty. Add a few pickups and send them to the workshop in a single
            message.
          </Text>
          <Button linkTo="/shop" variant="primary" size="md">
            Browse the shop
          </Button>
        </Stack>
      </Section>
    );
  }

  return (
    <Section spacing="lg" maxWidth="default">
      <div className={styles['layout']}>
        <Stack direction="column" gap="xl" align="stretch">
          <Stack direction="column" gap="xs" align="center">
            <Text variant="label" tone="gold" align="center">
              Enquiry
            </Text>
            <Heading level={1} variant="display" align="center">
              Your enquiry
            </Heading>
            <Text variant="lead" tone="muted" align="center">
              Review your pickups, then send them to the workshop as one message. Nothing is charged
              — we reply to every enquiry personally.
            </Text>
          </Stack>

          <ul className={styles['list']} role="list">
            {items.map((item) => (
              <li key={item.slug} className={styles['row']}>
                <div className={styles['name']}>
                  <Heading level={2} variant="section">
                    {item.name}
                  </Heading>
                  <Text variant="meta" tone="muted">
                    €{String(item.price)} each
                  </Text>
                </div>
                <div className={styles['qty']}>
                  <IconButton
                    label={`Decrease ${item.name} quantity`}
                    variant="outlined"
                    onClick={() => {
                      setQty(item.slug, item.qty - 1);
                    }}
                  >
                    −
                  </IconButton>
                  <span className={styles['qtyValue']}>{item.qty}</span>
                  <IconButton
                    label={`Increase ${item.name} quantity`}
                    variant="outlined"
                    onClick={() => {
                      setQty(item.slug, item.qty + 1);
                    }}
                  >
                    +
                  </IconButton>
                </div>
                <div className={styles['lineTotal']}>
                  <Price amount={item.price * item.qty} size="md" />
                </div>
                <div className={styles['removeCell']}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      remove(item.slug);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles['summary']}>
            <Text variant="label" tone="muted">
              Indicative subtotal
            </Text>
            <Price amount={subtotal} size="lg" tone="primary" />
          </div>

          <div className={styles['actions']}>
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                clear();
              }}
            >
              Clear list
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                void navigate('/contact', {
                  state: {
                    subject: 'Order inquiry',
                    message: buildEnquiryMessage(items, subtotal),
                  },
                });
              }}
            >
              Send enquiry
            </Button>
          </div>

          <Text variant="meta" tone="muted" align="center">
            Prices are indicative. We confirm availability, options, and final pricing by email.
          </Text>
        </Stack>
      </div>
    </Section>
  );
}
