import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/routes';
import { pickups } from '../../data/pickups';

describe('ShopPage', () => {
  it('renders the catalog browser with every model', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/shop'] })} />);
    const page = screen.getByTestId('shop-page');
    expect(page.querySelector('h1')).toHaveTextContent('Shop Pickups');
    expect(screen.getByTestId('product-browser')).toBeInTheDocument();
    for (const pickup of pickups) {
      expect(screen.getByTestId(`product-card-${pickup.slug}`)).toHaveAttribute(
        'href',
        `/products/${pickup.slug}`,
      );
    }
  });
});
