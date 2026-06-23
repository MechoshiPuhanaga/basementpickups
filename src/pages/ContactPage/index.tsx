import { useLocation } from 'react-router';

import { DecoSeparator } from '../../design-system/atoms/DecoSeparator';
import { Heading } from '../../design-system/atoms/Heading';
import { Stack } from '../../design-system/atoms/Stack';
import { Text } from '../../design-system/atoms/Text';
import { Section } from '../../design-system/layouts/Section';
import { ContactForm, type ContactFormData } from '../../design-system/molecules/ContactForm';
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

/** Open the visitor's mail client with a prefilled message to the workshop. */
function openMailClient(data: ContactFormData): void {
  const subject = data.subject !== '' ? data.subject : 'Website inquiry';
  const body = [`Name: ${data.name}`, `Email: ${data.email}`, '', data.message].join('\n');
  const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  window.open(href, '_blank', 'noopener,noreferrer');
}

export default function ContactPage() {
  const location = useLocation();
  const state: unknown = location.state;
  const defaultSubject = readState(state, 'subject');
  const defaultMessage = readState(state, 'message');

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
            <ContactForm
              onSubmit={openMailClient}
              defaultSubject={defaultSubject}
              defaultMessage={defaultMessage}
            />
          </div>
          <aside className={styles['info']}>
            <Stack direction="column" gap="md" align="start">
              <Stack direction="column" gap="xs" align="start">
                <Text variant="label" tone="muted">
                  Email
                </Text>
                <a className={styles['emailLink']} href={`mailto:${CONTACT_EMAIL}`}>
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
