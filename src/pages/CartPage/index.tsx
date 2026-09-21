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

/** Cart line key → test-id-safe token (`#`, `:` and `,` become `-`). */
export function cartLineTestId(id: string): string {
  return id.replace(/[#:,]/g, '-');
}

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
      data-testid={`cart-config-${cartLineTestId(item.id)}`}
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
      <Section spacing="sm" maxWidth="narrow" data-testid="cart-empty">
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
          <Button linkTo="/shop" variant="primary" size="md" data-testid="cart-empty-shop">
            Browse the shop
          </Button>
        </Stack>
      </Section>
    );
  }

  return (
    <Section spacing="sm" maxWidth="default" data-testid="cart-page">
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

          <ul className={styles['list']} role="list" data-testid="cart-list">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={styles['row']}
                data-testid={`cart-line-${cartLineTestId(item.id)}`}
              >
                <div className={styles['rowMain']}>
                  <div className={styles['name']}>
                    <Heading
                      level={2}
                      variant="section"
                      data-testid={`cart-line-name-${cartLineTestId(item.id)}`}
                    >
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
                      data-testid={`cart-qty-dec-${cartLineTestId(item.id)}`}
                      onClick={() => {
                        setQty(item.id, item.qty - 1);
                      }}
                    >
                      −
                    </IconButton>
                    <span
                      className={styles['qtyValue']}
                      data-testid={`cart-qty-${cartLineTestId(item.id)}`}
                    >
                      {item.qty}
                    </span>
                    <IconButton
                      label={`Increase ${item.name} quantity`}
                      variant="outlined"
                      data-testid={`cart-qty-inc-${cartLineTestId(item.id)}`}
                      onClick={() => {
                        setQty(item.id, item.qty + 1);
                      }}
                    >
                      +
                    </IconButton>
                  </div>
                  <div className={styles['lineTotal']}>
                    <Price
                      amount={item.price * item.qty}
                      size="md"
                      data-testid={`cart-line-total-${cartLineTestId(item.id)}`}
                    />
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
                      data-testid={`cart-remove-${cartLineTestId(item.id)}`}
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
            <Price amount={subtotal} size="lg" tone="primary" data-testid="cart-subtotal" />
          </div>

          <div className={styles['actions']}>
            <Button
              variant="ghost"
              size="md"
              data-testid="cart-clear"
              onClick={() => {
                clear();
              }}
            >
              Clear list
            </Button>
            <Button
              variant="primary"
              size="lg"
              data-testid="cart-send-enquiry"
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
