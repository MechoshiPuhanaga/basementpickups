import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { useCart, type CartItem } from '../../cart/CartContext';
import { bobbinOptions } from '../../data/bobbins';
import { getPickupBySlug } from '../../data/pickups';
import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { ContactForm, type ContactFormData } from '../../design-system/molecules/ContactForm';
import { EnquirySummary } from '../../design-system/molecules/EnquirySummary';
import { useIsHydrated } from '../../utils/useIsHydrated';
import styles from './ContactPage.module.css';

const CONTACT_EMAIL = 'contact@basementpickups.com';

/** Safely read a string field from arbitrary router navigation state. */
function readState(state: unknown, key: string): string | undefined {
  if (typeof state === 'object' && state !== null && key in state) {
    const value = (state as Record<string, unknown>)[key];
    return typeof value === 'string' ? value : undefined;
  }
  return undefined;
}

/** True when the enquiry was initiated from the cart (set by CartPage). */
function readFlag(state: unknown, key: string): boolean {
  return (
    typeof state === 'object' &&
    state !== null &&
    key in state &&
    (state as Record<string, unknown>)[key] === true
  );
}

/** Resolved bobbin colours for a cart line, e.g. `[{ label: 'Slug coil', value: 'Black' }]`. */
function itemOptions(item: CartItem): { label: string; value: string }[] {
  const bobbins = getPickupBySlug(item.slug)?.hardware.bobbins;
  return bobbins === undefined ? [] : bobbinOptions(bobbins, item.config);
}

/** Plain-text item list appended to the mailto fallback when sending fails. */
function formatItemsText(items: readonly CartItem[]): string {
  const lines = items.map((item) => {
    const options = itemOptions(item);
    const colours =
      options.length > 0
        ? ` (${options.map((option) => `${option.label}: ${option.value}`).join(', ')})`
        : '';
    return `- ${String(item.qty)} × ${item.name}${colours} — €${String(item.price * item.qty)}`;
  });
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return [
    'Selected pickups:',
    ...lines,
    '',
    `Indicative subtotal: €${String(subtotal)} (excludes shipping and any custom work)`,
  ].join('\n');
}

/**
 * POST the enquiry to the server, which sends it on via Resend. Structured cart
 * items (when present) are sent alongside the message so the server can render
 * a proper itemised template rather than relying on pasted text.
 *
 * Throws on failure so the form can surface an error. For validation errors
 * (4xx) the server's specific message is surfaced; for system failures (5xx) we
 * throw without a message so the form shows its own fallback (with a mailto).
 */
async function postEnquiry(
  data: ContactFormData,
  items: readonly CartItem[] | undefined,
): Promise<void> {
  // Attach each line's chosen bobbin colours as per-item options so the server
  // renders them in the itemised email.
  const payloadItems = items?.map((item) => {
    const options = itemOptions(item);
    return options.length > 0 ? { ...item, options } : item;
  });
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, items: payloadItems }),
  });

  if (!response.ok) {
    let message = '';
    if (response.status >= 400 && response.status < 500) {
      try {
        const body = (await response.json()) as { error?: unknown };
        if (typeof body.error === 'string') message = body.error;
      } catch {
        // Non-JSON error response — fall back to the form's default message.
      }
    }
    throw new Error(message);
  }
}

export default function ContactPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { items: cartItems, clear } = useCart();
  const hydrated = useIsHydrated();
  const [sent, setSent] = useState(false);

  // The browser restores history.state on reload, so React Router hands the
  // client navigation state the server never had. Read it only after hydration
  // (and remount the form via `key` below) so the first client render matches
  // the server and we avoid a hydration mismatch.
  const state: unknown = hydrated ? location.state : null;
  const defaultSubject = readState(state, 'subject');
  const fromCart = readFlag(state, 'fromCart');
  // Read the LIVE cart (not a navigation-state snapshot) so editing a bobbin
  // colour in the cart is reflected here — including after a browser Back, which
  // would otherwise restore the stale items captured when "Send enquiry" was hit.
  const items = fromCart && cartItems.length > 0 ? cartItems : undefined;

  // The form clears itself on success. Only empty the cart when this enquiry
  // actually came from the cart — a standalone enquiry must leave the cart
  // untouched, even if it happens to have items.
  async function handleSubmit(data: ContactFormData): Promise<void> {
    await postEnquiry(data, items);
    if (fromCart) clear();
    // Clear the navigation state in history so a refresh can't restore the now
    // stale cart items (the browser persists history.state across reloads).
    // Without this, the read-only enquiry summary reappears on refresh.
    void navigate('.', { replace: true, state: null });
    // Hide the read-only enquiry summary once the enquiry has been sent — the
    // cart is now cleared, so the (nav-state-derived) list would be stale.
    setSent(true);
  }

  return (
    <Section spacing="sm" maxWidth="default">
      <Stack direction="column" gap="xl" align="stretch">
        <Stack direction="column" gap="md" align="center">
          <Text variant="label" tone="gold" align="center">
            Get in touch
          </Text>
          <Heading level={1} variant="display" align="center">
            Contact the workshop
          </Heading>
          <DecoSeparator variant="medallion" />
          <Text variant="lead" tone="muted" align="center">
            For custom builds, repairs, press, or anything else — drop us a line. We answer every
            message personally.
          </Text>
        </Stack>
        <div className={styles['layout']}>
          <div className={styles['formSide']}>
            <Stack direction="column" gap="lg" align="stretch">
              {fromCart && items !== undefined && !sent && (
                <EnquirySummary
                  items={items.map((item) => ({
                    name: item.name,
                    qty: item.qty,
                    price: item.price,
                    options: itemOptions(item),
                  }))}
                />
              )}
              <ContactForm
                key={hydrated ? 'hydrated' : 'ssr'}
                onSubmit={handleSubmit}
                defaultSubject={defaultSubject}
                contactEmail={CONTACT_EMAIL}
                messageRequired={!(fromCart && items !== undefined)}
                messagePlaceholder={
                  fromCart && items !== undefined
                    ? 'Add any custom requirements or notes (optional)…'
                    : undefined
                }
                mailtoItemsText={
                  fromCart && items !== undefined ? formatItemsText(items) : undefined
                }
              />
            </Stack>
          </div>
          <aside className={styles['info']}>
            <Stack direction="column" gap="md" align="start">
              <Stack direction="column" gap="xs" align="start">
                <Text variant="label" tone="muted">
                  Email
                </Text>
                <a
                  className={styles['emailLink']}
                  href={`mailto:${CONTACT_EMAIL}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {CONTACT_EMAIL}
                </a>
              </Stack>
              <Stack direction="column" gap="xs" align="start">
                <Text variant="label" tone="muted">
                  Workshop
                </Text>
                <Text variant="editorial">
                  Basement Pickups
                  <br />
                  Wound and voiced in the workshop.
                </Text>
              </Stack>
              <Stack direction="column" gap="xs" align="start">
                <Text variant="label" tone="muted">
                  Hours
                </Text>
                <Text variant="editorial">By appointment.</Text>
              </Stack>
              <Stack direction="column" gap="xs" align="start">
                <Text variant="label" tone="muted">
                  Lead time
                </Text>
                <Text variant="editorial">
                  Most builds ship within 2–3 weeks. Custom and aged-cover work is longer.
                </Text>
              </Stack>
            </Stack>
          </aside>
        </div>
      </Stack>
    </Section>
  );
}
