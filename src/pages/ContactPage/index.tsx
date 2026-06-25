import { useLocation } from 'react-router';

import { useCart, type CartItem } from '../../cart/CartContext';
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

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item['slug'] === 'string' &&
    typeof item['name'] === 'string' &&
    typeof item['price'] === 'number' &&
    typeof item['qty'] === 'number'
  );
}

/** Read the cart line items carried in navigation state, if any. */
function readItems(state: unknown): readonly CartItem[] | undefined {
  if (typeof state !== 'object' || state === null || !('items' in state)) return undefined;
  const value = (state as Record<string, unknown>)['items'];
  if (!Array.isArray(value)) return undefined;
  const items = value.filter(isCartItem);
  return items.length > 0 ? items : undefined;
}

/** Plain-text item list appended to the mailto fallback when sending fails. */
function formatItemsText(items: readonly CartItem[]): string {
  const lines = items.map(
    (item) => `- ${String(item.qty)} × ${item.name} — €${String(item.price * item.qty)}`,
  );
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
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, items }),
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
  const { clear } = useCart();
  const hydrated = useIsHydrated();

  // The browser restores history.state on reload, so React Router hands the
  // client navigation state the server never had. Read it only after hydration
  // (and remount the form via `key` below) so the first client render matches
  // the server and we avoid a hydration mismatch.
  const state: unknown = hydrated ? location.state : null;
  const defaultSubject = readState(state, 'subject');
  const fromCart = readFlag(state, 'fromCart');
  const items = readItems(state);

  // The form clears itself on success. Only empty the cart when this enquiry
  // actually came from the cart — a standalone enquiry must leave the cart
  // untouched, even if it happens to have items.
  async function handleSubmit(data: ContactFormData): Promise<void> {
    await postEnquiry(data, fromCart ? items : undefined);
    if (fromCart) clear();
  }

  return (
    <Section spacing="lg" maxWidth="default">
      <Stack direction="column" gap="xl" align="stretch">
        <Stack direction="column" gap="xs" align="center">
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
              {fromCart && items !== undefined && <EnquirySummary items={items} />}
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
