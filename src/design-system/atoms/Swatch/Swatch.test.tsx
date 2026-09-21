import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Swatch } from './Swatch';

describe('Swatch', () => {
  it('renders an accessible colour chip', () => {
    render(<Swatch data-testid="sw" color="light-blue" label="Light blue" />);
    const swatch = screen.getByTestId('sw');
    expect(swatch).toHaveAttribute('role', 'img');
    expect(swatch).toHaveAttribute('aria-label', 'Light blue');
    expect(swatch).toHaveAttribute('title', 'Light blue');
    expect(swatch).toHaveAttribute('data-color', 'light-blue');
    expect(swatch).toHaveAttribute('data-size', 'md');
  });

  it('supports the small size and className', () => {
    render(<Swatch data-testid="sw" color="cream" label="Cream" size="sm" className="c" />);
    expect(screen.getByTestId('sw')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByTestId('sw')).toHaveClass('c');
  });
});
