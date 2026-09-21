import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renders an accessible button with a hidden icon', async () => {
    const onClick = vi.fn();
    render(
      <IconButton data-testid="ib" label="Close" onClick={onClick}>
        <svg />
      </IconButton>,
    );
    const button = screen.getByTestId('ib');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Close');
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards variant, size, type, className and disabled', () => {
    render(
      <IconButton
        data-testid="ib"
        label="Submit"
        variant="outlined"
        size="lg"
        type="submit"
        className="c"
        disabled
      >
        <svg />
      </IconButton>,
    );
    const button = screen.getByTestId('ib');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('data-variant', 'outlined');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveClass('c');
    expect(button).toBeDisabled();
  });
});
