import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NewsletterSignup } from './NewsletterSignup';

describe('NewsletterSignup', () => {
  it('submits the email address', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NewsletterSignup onSubmit={onSubmit} submitLabel="Join" />);
    await user.type(screen.getByTestId('newsletter-form-email'), 'ada@example.com');
    await user.click(screen.getByTestId('newsletter-form-submit'));
    expect(onSubmit).toHaveBeenCalledWith('ada@example.com');
    expect(screen.getByTestId('newsletter-form-submit')).toHaveTextContent('Join');
  });

  it('is inert without a handler and honours custom copy', async () => {
    const user = userEvent.setup();
    render(<NewsletterSignup label="Your email" placeholder="you@x.com" data-testid="nl" />);
    const input = screen.getByTestId('nl-email');
    expect(input).toHaveAttribute('placeholder', 'you@x.com');
    expect(screen.getByTestId('nl')).toHaveTextContent('Your email');
    await user.type(input, 'a@b.co');
    await user.click(screen.getByTestId('nl-submit'));
    expect(input).toHaveValue('a@b.co');
  });
});
