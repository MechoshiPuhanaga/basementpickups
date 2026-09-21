import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';

describe('Input', () => {
  it('renders a text input of medium size by default', async () => {
    const onChange = vi.fn();
    render(<Input data-testid="in" name="email" onChange={onChange} />);
    const input = screen.getByTestId('in');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('data-size', 'md');
    expect(input).not.toHaveAttribute('data-invalid');
    expect(input).not.toHaveAttribute('aria-invalid');
    await userEvent.type(input, 'ab');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(input).toHaveValue('ab');
  });

  it('marks invalid state for assistive tech and styling', () => {
    render(
      <Input
        data-testid="in"
        type="email"
        inputSize="lg"
        invalid
        aria-describedby="email-error"
        className="c"
      />,
    );
    const input = screen.getByTestId('in');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('data-size', 'lg');
    expect(input).toHaveAttribute('data-invalid', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(input).toHaveClass('c');
  });
});
