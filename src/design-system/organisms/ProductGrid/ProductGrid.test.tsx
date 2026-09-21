import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { pickups } from '../../../data/pickups';
import { ProductGrid } from './ProductGrid';

describe('ProductGrid', () => {
  it('renders a card per pickup without a header by default', () => {
    render(
      <MemoryRouter>
        <ProductGrid pickups={pickups.slice(0, 3)} />
      </MemoryRouter>,
    );
    const grid = screen.getByTestId('product-grid');
    expect(grid.querySelectorAll('a[data-testid^="product-card-"]')).toHaveLength(3);
    expect(grid.querySelector('h2')).toBeNull();
    for (const img of grid.querySelectorAll('img')) expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('renders the header and prioritises the first card', () => {
    render(
      <MemoryRouter>
        <ProductGrid
          pickups={pickups.slice(0, 2)}
          eyebrow="Featured"
          title="Built by hand"
          lead="Small range"
          columns={2}
          priorityFirst
          data-testid="pg"
        />
      </MemoryRouter>,
    );
    const grid = screen.getByTestId('pg');
    expect(grid).toHaveTextContent('Featured');
    expect(grid.querySelector('h2')).toHaveTextContent('Built by hand');
    expect(grid).toHaveTextContent('Small range');
    const imgs = grid.querySelectorAll('img');
    expect(imgs[0]).toHaveAttribute('loading', 'eager');
    expect(imgs[1]).toHaveAttribute('loading', 'lazy');
  });
});
