import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renders five rows at medium size by default', async () => {
    const onChange = vi.fn();
    render(<Textarea data-testid="ta" name="message" onChange={onChange} />);
    const textarea = screen.getByTestId('ta');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('data-size', 'md');
    expect(textarea).not.toHaveAttribute('aria-invalid');
    await userEvent.type(textarea, 'hi');
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(textarea).toHaveValue('hi');
  });

  it('marks invalid state and forwards rows/size/className', () => {
    render(<Textarea data-testid="ta" rows={3} textareaSize="sm" invalid className="c" />);
    const textarea = screen.getByTestId('ta');
    expect(textarea).toHaveAttribute('rows', '3');
    expect(textarea).toHaveAttribute('data-size', 'sm');
    expect(textarea).toHaveAttribute('data-invalid', 'true');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveClass('c');
  });
});
