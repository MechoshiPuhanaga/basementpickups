import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  it('renders a native button with variant and size data attributes', async () => {
    const onClick = vi.fn();
    render(
      <Button data-testid="btn" variant="ghost" size="lg" onClick={onClick}>
        Shop
      </Button>,
    );
    const button = screen.getByTestId('btn');
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveTextContent('Shop');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to the primary medium variant', () => {
    render(<Button data-testid="btn">Go</Button>);
    const button = screen.getByTestId('btn');
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
  });

  it('renders a router link when linkTo is set', () => {
    render(
      <MemoryRouter>
        <Button data-testid="btn" linkTo="/shop" linkState={{ from: 'home' }}>
          Shop
        </Button>
      </MemoryRouter>,
    );
    const link = screen.getByTestId('btn');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/shop');
  });
});
