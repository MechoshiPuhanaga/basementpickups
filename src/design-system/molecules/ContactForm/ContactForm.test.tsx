import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { ContactForm, ContactFormError, type ContactFormData } from './ContactForm';

beforeAll(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false });
  Element.prototype.scrollIntoView = vi.fn();
});

async function fill(user: ReturnType<typeof userEvent.setup>, subject = 'General inquiry') {
  await user.type(screen.getByTestId('contact-form-name'), 'Ada');
  await user.type(screen.getByTestId('contact-form-email'), 'ada@example.com');
  await user.selectOptions(screen.getByTestId('contact-form-subject-select'), subject);
  await user.type(screen.getByTestId('contact-form-message'), 'Hello there');
}

describe('ContactForm', () => {
  it('submits the collected fields and shows the success message', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn<(data: ContactFormData) => void>();
    render(<ContactForm onSubmit={onSubmit} successMessage="Sent!" />);
    await fill(user);
    await user.click(screen.getByTestId('contact-form-submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'General inquiry',
      message: 'Hello there',
      company: '',
    });
    expect(await screen.findByTestId('contact-form-success')).toHaveTextContent('Sent!');
    expect(screen.getByTestId('contact-form-status')).toHaveAttribute('role', 'status');
    // The form resets after success.
    expect(screen.getByTestId('contact-form-name')).toHaveValue('');
  });

  it('does not submit while required fields are empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} />);
    await user.click(screen.getByTestId('contact-form-submit'));
    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('contact-form-status')).toHaveAttribute('data-status', 'idle');
  });

  it('shows a field-level error, marks and focuses the control, and clears it on input', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new ContactFormError('Bad email', 'email'));
    render(<ContactForm onSubmit={onSubmit} />);
    await fill(user);
    await user.click(screen.getByTestId('contact-form-submit'));

    const error = await screen.findByTestId('contact-form-field-error-email');
    expect(error).toHaveTextContent('Bad email');
    const email = screen.getByTestId('contact-form-email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAttribute('aria-describedby', 'contact-email-error');
    expect(email).toHaveFocus();
    expect(screen.queryByTestId('contact-form-error')).toBeNull();

    await user.type(email, 'x');
    expect(screen.queryByTestId('contact-form-field-error-email')).toBeNull();
  });

  it('shows a server message when the error carries one', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error('Please slow down'));
    render(<ContactForm onSubmit={onSubmit} contactEmail="shop@example.com" />);
    await fill(user);
    await user.click(screen.getByTestId('contact-form-submit'));
    const error = await screen.findByTestId('contact-form-error');
    expect(error).toHaveTextContent('Please slow down');
    expect(screen.queryByTestId('contact-form-mailto')).toBeNull();
    expect(screen.getByTestId('contact-form-status')).toHaveAttribute('role', 'alert');
  });

  it('offers a prefilled mailto fallback on a system failure', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue('boom');
    render(
      <ContactForm
        onSubmit={onSubmit}
        contactEmail="shop@example.com"
        errorMessage="Nope."
        mailtoItemsText="- 1 × Thing"
      />,
    );
    await fill(user, 'Repairs & service');
    await user.click(screen.getByTestId('contact-form-submit'));
    expect(await screen.findByTestId('contact-form-error')).toHaveTextContent('Nope.');
    const mailto = screen.getByTestId('contact-form-mailto');
    const href = mailto.getAttribute('href') ?? '';
    expect(href.startsWith('mailto:shop@example.com?subject=')).toBe(true);
    expect(decodeURIComponent(href)).toContain('Repairs & service');
    expect(decodeURIComponent(href)).toContain('Name: Ada');
    expect(decodeURIComponent(href)).toContain('Hello there');
    expect(decodeURIComponent(href)).toContain('- 1 × Thing');
  });

  it('falls back to a default subject in the mailto when none was chosen', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error(''));
    render(
      <ContactForm onSubmit={onSubmit} contactEmail="shop@example.com" messageRequired={false} />,
    );
    await user.type(screen.getByTestId('contact-form-name'), 'Ada');
    await user.type(screen.getByTestId('contact-form-email'), 'ada@example.com');
    await user.click(screen.getByTestId('contact-form-submit'));
    const href = decodeURIComponent(
      (await screen.findByTestId('contact-form-mailto')).getAttribute('href') ?? '',
    );
    expect(href).toContain('subject=Website enquiry');
    expect(href).not.toContain('\n\n\n');
  });

  it('disables the controls while submitting and ignores a second submit', async () => {
    const user = userEvent.setup();
    let resolve: () => void = () => undefined;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((r) => {
          resolve = r;
        }),
    );
    render(<ContactForm onSubmit={onSubmit} submitLabel="Go" />);
    await fill(user);
    await user.click(screen.getByTestId('contact-form-submit'));
    expect(screen.getByTestId('contact-form-submit')).toBeDisabled();
    expect(screen.getByTestId('contact-form-submit')).toHaveTextContent('Sending…');
    expect(screen.getByTestId('contact-form-name')).toBeDisabled();
    resolve();
    await waitFor(() => {
      expect(screen.getByTestId('contact-form-submit')).toHaveTextContent('Go');
    });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does nothing without an onSubmit handler', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await fill(user);
    await user.click(screen.getByTestId('contact-form-submit'));
    expect(screen.getByTestId('contact-form-status')).toHaveAttribute('data-status', 'idle');
  });

  it('prepends an unknown default subject and preselects it', () => {
    render(<ContactForm defaultSubject="Order inquiry" defaultMessage="Hi" />);
    const select = screen.getByTestId<HTMLSelectElement>('contact-form-subject-select');
    expect(select).toHaveValue('Order inquiry');
    expect(select.options[1]).toHaveTextContent('Order inquiry');
    expect(screen.getByTestId('contact-form-message')).toHaveValue('Hi');
    expect(screen.getByTestId('contact-form-message')).toBeRequired();
  });

  it('marks the message optional when messageRequired is false', () => {
    render(<ContactForm messageRequired={false} messagePlaceholder="Notes…" />);
    const message = screen.getByTestId('contact-form-message');
    expect(message).not.toBeRequired();
    expect(message).toHaveAttribute('placeholder', 'Notes…');
    expect(screen.getByTestId('contact-form')).toHaveTextContent('Message (optional)');
  });

  it('carries the honeypot value through to the handler', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<ContactForm onSubmit={onSubmit} data-testid="cf" />);
    await user.type(screen.getByTestId('cf-name'), 'Bot');
    await user.type(screen.getByTestId('cf-email'), 'bot@example.com');
    await user.selectOptions(screen.getByTestId('cf-subject-select'), 'General inquiry');
    await user.type(screen.getByTestId('cf-message'), 'spam');
    await user.type(screen.getByTestId('cf-company'), 'Acme');
    await user.click(screen.getByTestId('cf-submit'));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ company: 'Acme' }));
  });
});
