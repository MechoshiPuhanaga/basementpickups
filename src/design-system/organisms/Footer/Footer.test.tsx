import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { primaryNav } from '../../../data/navigation';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders the brand link, primary navigation and the current year', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );
    const footer = screen.getByTestId('site-footer');
    expect(screen.getByTestId('site-footer-brand-link')).toHaveAttribute('href', '/');
    for (const link of primaryNav) {
      const id = `site-footer-link-${link.href === '/' ? 'home' : link.href.slice(1)}`;
      expect(screen.getByTestId(id)).toHaveAttribute('href', link.href);
      expect(screen.getByTestId(id)).toHaveTextContent(link.label);
    }
    expect(footer).toHaveTextContent(`© ${String(new Date().getFullYear())} Basement Pickups`);
  });

  it('accepts a custom test id and class', () => {
    render(
      <MemoryRouter>
        <Footer data-testid="f" className="x" />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('f')).toHaveClass('x');
  });
});
