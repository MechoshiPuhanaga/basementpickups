import { act, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { CartProvider, useCart } from './CartContext';
import { MobileNav } from './MobileNav';

function Harness({ children }: { children: ReactNode }) {
  return (
    <MemoryRouter>
      <CartProvider>
        <div data-testid="mobile-nav-host">
          <MobileNav />
        </div>
        {children}
      </CartProvider>
    </MemoryRouter>
  );
}

describe('MobileNav', () => {
  it('mounts the mobile menu trigger wired to the live cart count', () => {
    const { result } = renderHook(() => useCart(), { wrapper: Harness });
    const host = screen.getByTestId('mobile-nav-host');
    expect(host.querySelector('button[aria-haspopup="dialog"]')).not.toBeNull();

    act(() => {
      result.current.add({ slug: 'macho-heaven', name: 'Macho Heaven', price: 250 });
    });
    expect(result.current.count).toBe(1);
    expect(host.querySelector('button[aria-expanded]')).toHaveAttribute('aria-expanded', 'false');
  });
});
