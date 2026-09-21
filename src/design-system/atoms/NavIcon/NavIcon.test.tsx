import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NavIcon, type NavIconName } from './NavIcon';

const NAMES: readonly NavIconName[] = [
  'home',
  'about',
  'shop',
  'articles',
  'faq',
  'contact',
  'cart',
];

describe('NavIcon', () => {
  it('renders a decorative 22px icon by default', () => {
    render(<NavIcon data-testid="icon" name="home" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveAttribute('width', '22');
    expect(icon).toHaveAttribute('data-name', 'home');
  });

  it.each(NAMES)('draws linework for %s', (name) => {
    render(<NavIcon data-testid="icon" name={name} size={30} className="n" />);
    const icon = screen.getByTestId('icon');
    expect(icon).toHaveAttribute('height', '30');
    expect(icon).toHaveClass('n');
    expect(icon.querySelectorAll('path, circle').length).toBeGreaterThan(0);
  });
});
