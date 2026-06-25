import { useEffect, useRef, useState } from 'react';

import { Button } from '../../atoms/Button';
import { Callout } from '../../atoms/Callout';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Stack } from '../../atoms/Stack';
import { Textarea } from '../../atoms/Textarea';
import styles from './ContactForm.module.css';

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

/** Build a prefilled mailto: link as a fallback when automated sending fails. */
function buildMailto(email: string, data: ContactFormData, itemsText?: string): string {
  const subject = data.subject !== '' ? data.subject : 'Website enquiry';
  const lines = [`Name: ${data.name}`, `Email: ${data.email}`];
  if (data.message !== '') lines.push('', data.message);
  if (itemsText !== undefined && itemsText !== '') lines.push('', itemsText);
  const body = lines.join('\n');
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  /** Honeypot value — expected empty for genuine submissions. */
  readonly company: string;
}

export interface ContactFormProps {
  subjects?: readonly string[] | undefined;
  defaultSubject?: string | undefined;
  defaultMessage?: string | undefined;
  /**
   * Submission handler. Resolve to indicate success; throw (optionally with a
   * message) to surface an error. The form owns the submitting/success/error UI.
   */
  onSubmit?: ((data: ContactFormData) => void | Promise<void>) | undefined;
  submitLabel?: string | undefined;
  successMessage?: string | undefined;
  errorMessage?: string | undefined;
  /** Whether the message field is required. Defaults to true. */
  messageRequired?: boolean | undefined;
  messagePlaceholder?: string | undefined;
  /**
   * Workshop email address. When provided, a system-level send failure offers a
   * prefilled mailto: fallback so the visitor can send from their own mail app.
   */
  contactEmail?: string | undefined;
  /** Optional preformatted item list appended to the mailto fallback body. */
  mailtoItemsText?: string | undefined;
  className?: string | undefined;
}

const DEFAULT_SUBJECTS = [
  'General inquiry',
  'Pickup customization',
  'Repairs & service',
  'Press & collaboration',
] as const;

const DEFAULT_SUCCESS =
  "Thank you — your message is on its way. We'll reply personally, and a confirmation is on its way to your inbox.";
const DEFAULT_ERROR =
  "Sorry — your message didn't go through from here. Please try again in a moment.";

export function ContactForm({
  subjects = DEFAULT_SUBJECTS,
  defaultSubject,
  defaultMessage,
  onSubmit,
  submitLabel = 'Send message',
  successMessage = DEFAULT_SUCCESS,
  errorMessage = DEFAULT_ERROR,
  messageRequired = true,
  messagePlaceholder,
  contactEmail,
  mailtoItemsText,
  className,
}: ContactFormProps) {
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [serverError, setServerError] = useState<string>('');
  const [lastData, setLastData] = useState<ContactFormData | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Bring the result message into view on success/error — on a long form (or
  // phone) it sits below the submit button, off-screen. Screen readers already
  // get it via the live region; this is purely for sighted visibility. SSR-safe
  // (effects are client-only) and motion-aware.
  useEffect(() => {
    if (status !== 'success' && status !== 'error') return;
    const node = statusRef.current;
    if (node === null) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    node.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  }, [status]);

  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const subjectOptions =
    defaultSubject !== undefined && !subjects.includes(defaultSubject)
      ? [defaultSubject, ...subjects]
      : subjects;

  const isSubmitting = status === 'submitting';

  async function handleSubmit(form: HTMLFormElement): Promise<void> {
    if (onSubmit === undefined || isSubmitting) return;

    const formData = new FormData(form);
    const data: ContactFormData = {
      name: readField(formData, 'name'),
      email: readField(formData, 'email'),
      subject: readField(formData, 'subject'),
      message: readField(formData, 'message'),
      company: readField(formData, 'company'),
    };

    setStatus('submitting');
    setServerError('');
    try {
      await onSubmit(data);
      setStatus('success');
      form.reset();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : '');
      setLastData(data);
      setStatus('error');
    }
  }

  return (
    <form
      className={classes}
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(event.currentTarget);
      }}
      aria-label="Contact form"
    >
      <Stack direction="column" gap="lg" align="stretch">
        <div className={styles['field']}>
          <label htmlFor="contact-name" className={styles['label']}>
            Name
          </label>
          <Input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            disabled={isSubmitting}
          />
        </div>
        <div className={styles['field']}>
          <label htmlFor="contact-email" className={styles['label']}>
            Email
          </label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            disabled={isSubmitting}
          />
        </div>
        <div className={styles['field']}>
          <label htmlFor="contact-subject" className={styles['label']}>
            Subject
          </label>
          <Select
            id="contact-subject"
            name="subject"
            defaultValue={defaultSubject ?? ''}
            disabled={isSubmitting}
          >
            <option value="" disabled>
              Choose a subject
            </option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </div>
        <div className={styles['field']}>
          <label htmlFor="contact-message" className={styles['label']}>
            {messageRequired ? 'Message' : 'Message (optional)'}
          </label>
          <Textarea
            id="contact-message"
            name="message"
            required={messageRequired}
            rows={6}
            defaultValue={defaultMessage}
            placeholder={messagePlaceholder}
            disabled={isSubmitting}
          />
        </div>

        {/* Honeypot — hidden from users and assistive tech; bots fill it. */}
        <div className={styles['honeypot']} aria-hidden="true">
          <label htmlFor="contact-company">Company</label>
          <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className={styles['actions']}>
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? 'Sending…' : submitLabel}
          </Button>
        </div>

        <div
          ref={statusRef}
          className={styles['status']}
          role={status === 'error' ? 'alert' : 'status'}
          aria-live={status === 'error' ? 'assertive' : 'polite'}
        >
          {status === 'success' && <Callout tone="success">{successMessage}</Callout>}
          {status === 'error' &&
            (serverError !== '' ? (
              // A specific validation message from the server — the visitor can fix it.
              <Callout tone="error">{serverError}</Callout>
            ) : (
              // A system failure — offer a prefilled mailto fallback if we can.
              <Callout tone="error">
                {errorMessage}
                {contactEmail !== undefined && lastData !== null && (
                  <>
                    {' '}
                    <a
                      className={styles['fallbackLink']}
                      href={buildMailto(contactEmail, lastData, mailtoItemsText)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send it from your email app instead
                    </a>
                    .
                  </>
                )}
              </Callout>
            ))}
        </div>
      </Stack>
    </form>
  );
}
