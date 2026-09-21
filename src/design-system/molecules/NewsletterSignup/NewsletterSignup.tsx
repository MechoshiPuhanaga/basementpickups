import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import type { TestIdProps } from '../../testing';
import styles from './NewsletterSignup.module.css';

export interface NewsletterSignupProps extends TestIdProps {
  label?: string | undefined;
  placeholder?: string | undefined;
  submitLabel?: string | undefined;
  onSubmit?: ((email: string) => void) | undefined;
  className?: string | undefined;
}

function readField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export function NewsletterSignup({
  label = 'Email address',
  placeholder = 'your@email.com',
  submitLabel = 'Subscribe',
  onSubmit,
  className,
  'data-testid': testId = 'newsletter-form',
}: NewsletterSignupProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  const inputId = 'newsletter-email';

  return (
    <form
      className={classes}
      onSubmit={(event) => {
        event.preventDefault();
        if (onSubmit === undefined) return;
        const formData = new FormData(event.currentTarget);
        onSubmit(readField(formData, 'email'));
      }}
      noValidate={false}
      aria-label="Newsletter signup"
      data-testid={testId}
    >
      <label htmlFor={inputId} className={styles['srOnly']}>
        {label}
      </label>
      <div className={styles['fields']}>
        <Input
          id={inputId}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={placeholder}
          className={styles['input']}
          data-testid={`${testId}-email`}
        />
        <Button type="submit" variant="primary" size="md" data-testid={`${testId}-submit`}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
