import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { PageShell } from './PageShell';

describe('PageShell', () => {
  it('renders skip link, header, focusable main and footer', () => {
    render(
      <MemoryRouter>
        <PageShell>
          <p>Page</p>
        </PageShell>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('page-shell')).toBeInTheDocument();
    expect(screen.getByTestId('skip-link')).toHaveAttribute('href', '#main');
    expect(screen.getByTestId('site-header')).toBeInTheDocument();
    const main = screen.getByTestId('main');
    expect(main).toHaveAttribute('id', 'main');
    expect(main).toHaveAttribute('tabindex', '-1');
    expect(main).toHaveTextContent('Page');
    expect(screen.getByTestId('primary-nav')).toBeInTheDocument();
  });

  it('renders header actions and mobile nav slots inside the header', () => {
    render(
      <MemoryRouter>
        <PageShell
          className="c"
          headerActions={<button data-testid="actions-slot">Enquiry</button>}
          headerMobileNav={<button data-testid="mobile-slot">Menu</button>}
        />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('page-shell')).toHaveClass('c');
    expect(screen.getByTestId('site-header')).toContainElement(screen.getByTestId('actions-slot'));
    expect(screen.getByTestId('site-header')).toContainElement(screen.getByTestId('mobile-slot'));
  });
});
