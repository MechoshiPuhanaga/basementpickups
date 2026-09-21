import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/routes';

describe('NotFoundPage', () => {
  it('renders for unknown routes with links home and to the shop', () => {
    render(
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/no/such/page'] })} />,
    );
    const page = screen.getByTestId('not-found');
    expect(page).toHaveTextContent('404');
    expect(page.querySelector('h1')).toHaveTextContent('Off the bench');
    expect(screen.getByTestId('not-found-home')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('not-found-shop')).toHaveAttribute('href', '/shop');
  });
});
