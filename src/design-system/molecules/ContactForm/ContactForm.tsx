import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Select } from '../../atoms/Select';
import { Stack } from '../../atoms/Stack';
import { Textarea } from '../../atoms/Textarea';
import styles from './ContactForm.module.css';

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

export interface ContactFormProps {
  subjects?: readonly string[] | undefined;
  defaultSubject?: string | undefined;
  defaultMessage?: string | undefined;
  onSubmit?: ((data: ContactFormData) => void) | undefined;
  submitLabel?: string | undefined;
  className?: string | undefined;
}

const DEFAULT_SUBJECTS = [
  'General inquiry',
  'Pickup customization',
  'Repairs & service',
  'Press & collaboration',
] as const;

export function ContactForm({
  subjects = DEFAULT_SUBJECTS,
  defaultSubject,
  defaultMessage,
  onSubmit,
  submitLabel = 'Send message',
  className,
}: ContactFormProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const subjectOptions =
    defaultSubject !== undefined && !subjects.includes(defaultSubject)
      ? [defaultSubject, ...subjects]
      : subjects;

  return (
    <form
      className={classes}
      onSubmit={(event) => {
        event.preventDefault();
        if (onSubmit === undefined) return;
        const formData = new FormData(event.currentTarget);
        onSubmit({
          name: readField(formData, 'name'),
          email: readField(formData, 'email'),
          subject: readField(formData, 'subject'),
          message: readField(formData, 'message'),
        });
      }}
      aria-label="Contact form"
    >
      <Stack direction="column" gap="lg" align="stretch">
        <div className={styles['field']}>
          <label htmlFor="contact-name" className={styles['label']}>
            Name
          </label>
          <Input id="contact-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className={styles['field']}>
          <label htmlFor="contact-email" className={styles['label']}>
            Email
          </label>
          <Input id="contact-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className={styles['field']}>
          <label htmlFor="contact-subject" className={styles['label']}>
            Subject
          </label>
          <Select id="contact-subject" name="subject" defaultValue={defaultSubject ?? ''}>
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
            Message
          </label>
          <Textarea
            id="contact-message"
            name="message"
            required
            rows={6}
            defaultValue={defaultMessage}
          />
        </div>
        <div className={styles['actions']}>
          <Button type="submit" variant="primary" size="md">
            {submitLabel}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
