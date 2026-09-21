import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { pickups } from '../../../data/pickups';
import { ProductCard } from './ProductCard';

const pickup = pickups[0];
if (pickup === undefined) throw new Error('fixture: no pickups');

describe('ProductCard', () => {
  it('links to the product and shows type, name and price', () => {
    render(
      <MemoryRouter>
        <ProductCard pickup={pickup} priority />
      </MemoryRouter>,
    );
    const card = screen.getByTestId(`product-card-${pickup.slug}`);
    expect(card).toHaveAttribute('href', `/products/${pickup.slug}`);
    expect(card).toHaveTextContent('Humbucker');
    expect(screen.getByTestId(`product-card-${pickup.slug}-name`)).toHaveTextContent(pickup.name);
    expect(screen.getByTestId(`product-card-${pickup.slug}-price`)).toHaveTextContent(
      String(pickup.price),
    );
  });

  it('labels other pickup types and honours a custom test id', () => {
    render(
      <MemoryRouter>
        <ProductCard pickup={{ ...pickup, type: 'p90' }} data-testid="pc" />
        <ProductCard pickup={{ ...pickup, type: 'single' }} data-testid="pc2" />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('pc')).toHaveTextContent('P-90');
    expect(screen.getByTestId('pc2')).toHaveTextContent('Single Coil');
  });
});
