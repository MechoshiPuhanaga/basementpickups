import { act, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { CartProvider, useCart } from './CartContext';
import { CartLink } from './CartLink';

function Harness({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <CartProvider>
        <CartLink />
        {children}
      </CartProvider>
    </MemoryRouter>
  );
}

describe('CartLink', () => {
  it('links to the cart and shows the count once items exist', () => {
    const { result } = renderHook(() => useCart(), { wrapper: Harness });
    const link = screen.getByTestId('cart-link');
    expect(link).toHaveAttribute('href', '/cart');
    expect(link).toHaveAttribute('data-variant', 'ghost');
    expect(link).toHaveAttribute('data-size', 'sm');
    expect(link).toHaveTextContent('Enquiry');
    expect(link).not.toHaveTextContent('(');

    act(() => {
      result.current.add({ slug: 'macho-heaven', name: 'Macho Heaven', price: 250 });
      result.current.add({ slug: 'macho-heaven', name: 'Macho Heaven', price: 250 });
    });
    expect(link).toHaveTextContent('Enquiry (2)');
  });
});
