import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Breadcrumbs } from './Breadcrumbs';

const ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'White Pearl', to: '/products/white-pearl' },
];

function renderCrumbs(testId?: string) {
  render(
    <MemoryRouter>
      <Breadcrumbs items={ITEMS} data-testid={testId} />
    </MemoryRouter>,
  );
}

describe('Breadcrumbs', () => {
  it('is a labelled nav with ancestors as links and the current page unlinked', () => {
    renderCrumbs();
    const nav = screen.getByTestId('breadcrumbs');
    expect(nav.tagName).toBe('NAV');
    expect(nav).toHaveAttribute('aria-label', 'Breadcrumb');
    expect(screen.getByTestId('breadcrumbs-link-0')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('breadcrumbs-link-1')).toHaveAttribute('href', '/shop');
    expect(screen.getByTestId('breadcrumbs-link-1')).toHaveTextContent('Shop');
    const current = screen.getByTestId('breadcrumbs-current');
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('White Pearl');
    expect(screen.queryByTestId('breadcrumbs-link-2')).toBeNull();
  });

  it('hides the separators from assistive tech', () => {
    renderCrumbs();
    const hidden = screen.getByTestId('breadcrumbs').querySelectorAll('[aria-hidden="true"]');
    expect(hidden).toHaveLength(ITEMS.length - 1);
  });

  it('prefixes part test ids with a custom root id', () => {
    renderCrumbs('trail');
    expect(screen.getByTestId('trail')).toBeInTheDocument();
    expect(screen.getByTestId('trail-link-0')).toBeInTheDocument();
    expect(screen.getByTestId('trail-current')).toBeInTheDocument();
  });
});
