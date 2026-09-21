import { act, render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { CartAnnouncer } from './CartAnnouncer';
import { CartProvider, useCart } from './CartContext';

function Harness({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <CartAnnouncer />
      {children}
    </CartProvider>
  );
}

describe('CartAnnouncer', () => {
  it('announces the live item count in a polite status region', () => {
    const { result } = renderHook(() => useCart(), { wrapper: Harness });
    const region = screen.getByTestId('cart-announcer');
    expect(region).toHaveAttribute('role', 'status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('Your enquiry list is empty');

    act(() => {
      result.current.add({ slug: 'macho-heaven', name: 'Macho Heaven', price: 250 });
    });
    expect(region).toHaveTextContent('1 item in your enquiry');

    const id = result.current.items[0]?.id ?? '';
    act(() => {
      result.current.setQty(id, 3);
    });
    expect(region).toHaveTextContent('3 items in your enquiry');
  });

  it('renders without a router', () => {
    render(<Harness>{null}</Harness>);
    expect(screen.getByTestId('cart-announcer')).toBeInTheDocument();
  });
});
