import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import styles from './NewsletterSignup.module.css';

export interface NewsletterSignupProps {
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
        />
        <Button type="submit" variant="primary" size="md">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
