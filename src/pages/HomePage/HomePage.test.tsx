import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';

import { routes } from '../../app/routes';

const scrollTo = vi.fn();

beforeAll(() => {
  window.scrollTo = scrollTo;
});

describe('HomePage', () => {
  it('renders the hero, three featured pickups and three latest articles inside the shell', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />);
    expect(screen.getByTestId('page-shell')).toBeInTheDocument();
    expect(screen.getByTestId('site-header')).toBeInTheDocument();
    expect(screen.getByTestId('site-footer')).toBeInTheDocument();
    expect(screen.getByTestId('hero-cta-primary')).toHaveAttribute('href', '/shop');
    const featured = screen.getByTestId('home-featured');
    expect(featured.querySelectorAll('a[data-testid^="product-card-"]')).toHaveLength(3);
    const journal = screen.getByTestId('home-journal');
    expect(journal.querySelectorAll('a[data-testid^="article-card-"]')).toHaveLength(3);
    expect(screen.getByTestId('cart-link')).toHaveTextContent('Enquiry');
    expect(screen.getByTestId('nav-link-home')).toHaveAttribute('aria-current', 'page');
  });

  it('moves focus to main and resets scroll on client-side navigation', async () => {
    const user = userEvent.setup();
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />);
    expect(scrollTo).not.toHaveBeenCalled();
    await user.click(screen.getByTestId('nav-link-shop'));
    expect(await screen.findByTestId('shop-page')).toBeInTheDocument();
    expect(screen.getByTestId('main')).toHaveFocus();
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
    expect(screen.getByTestId('nav-link-shop')).toHaveAttribute('aria-current', 'page');
  });
});
