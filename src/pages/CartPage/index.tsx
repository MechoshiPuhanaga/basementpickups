import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

import { Button } from '../../design-system/atoms/Button';
import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { IconButton } from '../../design-system/atoms/IconButton';
import { Price } from '../../design-system/atoms/Price';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { PickupConfigurator } from '../../design-system/molecules/PickupConfigurator';
import { useCart, type CartItem } from '../../cart/CartContext';
import type { PickupConfig } from '../../data/pickupConfig';
import { getPickupBySlug } from '../../data/pickups';
import styles from './CartPage.module.css';

/** Per-line build (colours, wire, pole pieces, cover), editable in the enquiry; changes merge matching lines. */
function CartLineConfig({
  item,
  onChange,
}: {
  item: CartItem;
  onChange: (config: PickupConfig) => void;
}) {
  const pickup = getPickupBySlug(item.slug);
  if (pickup === undefined) return null;
  return (
    <PickupConfigurator
      className={styles['config']}
      pickup={pickup}
      value={item.config ?? {}}
      onChange={onChange}
      legend={`${item.name} build`}
      helpTo="/faq#option-availability"
    />
  );
}

export default function CartPage() {
  const { items, subtotal, setQty, remove, updateConfig, clear } = useCart();
  const navigate = useNavigate();

  // Removing a line unmounts the button that was pressed, which would drop
  // keyboard focus to <body>. Remember where focus should land instead — the
  // neighbouring line's Remove button, or the page's main landmark when the
  // list becomes empty — and move it once the list has re-rendered.
  const removeButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocus = useRef<string | null>(null);
  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;
    pendingFocus.current = null;
    const button = removeButtons.current.get(target);
    if (button !== undefined) button.focus();
    else document.getElementById('main')?.focus();
  }, [items]);

  function removeLine(index: number): void {
    const line = items[index];
    if (line === undefined) return;
    const neighbour = items[index + 1] ?? items[index - 1];
    pendingFocus.current = neighbour?.id ?? '';
    remove(line.id);
  }

  if (items.length === 0) {
    return (
      <Section spacing="sm" maxWidth="narrow">
        <Stack direction="column" gap="md" align="center">
          <Text variant="label" tone="gold" align="center">
            Enquiry
          </Text>
          <Heading level={1} variant="display" align="center">
            Your enquiry
          </Heading>
          <DecoSeparator variant="medallion" />
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
    <Section spacing="sm" maxWidth="default">
      <div className={styles['layout']}>
        <Stack direction="column" gap="xl" align="stretch">
          <Stack direction="column" gap="md" align="center">
            <Text variant="label" tone="gold" align="center">
              Enquiry
            </Text>
            <Heading level={1} variant="display" align="center">
              Your enquiry
            </Heading>
            <DecoSeparator variant="medallion" />
            <Text variant="lead" tone="muted" align="center">
              Review your pickups, then send them to the workshop as one message. Nothing is charged
              — we reply to every enquiry personally.
            </Text>
          </Stack>

          <ul className={styles['list']} role="list">
            {items.map((item, index) => (
              <li key={item.id} className={styles['row']}>
                <div className={styles['rowMain']}>
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
                      disabled={item.qty <= 1}
                      onClick={() => {
                        setQty(item.id, item.qty - 1);
                      }}
                    >
                      −
                    </IconButton>
                    <span className={styles['qtyValue']}>{item.qty}</span>
                    <IconButton
                      label={`Increase ${item.name} quantity`}
                      variant="outlined"
                      onClick={() => {
                        setQty(item.id, item.qty + 1);
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
                      ref={(node) => {
                        if (node === null) removeButtons.current.delete(item.id);
                        else removeButtons.current.set(item.id, node);
                      }}
                      variant="ghost"
                      size="sm"
                      aria-label={`Remove ${item.name} from enquiry`}
                      onClick={() => {
                        removeLine(index);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <CartLineConfig
                  item={item}
                  onChange={(config) => {
                    updateConfig(item.id, config);
                  }}
                />
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
                // Pass only the flag — the contact page reads the live cart, so
                // later colour edits (and Back navigation) stay in sync. A stale
                // items snapshot in history state was the cause of an old-colour bug.
                void navigate('/contact', {
                  state: { fromCart: true, subject: 'Order inquiry' },
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
