import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

import { PageShell } from '../design-system/layouts/PageShell';
import { CartAnnouncer } from '../cart/CartAnnouncer';
import { CartProvider } from '../cart/CartContext';
import { CartLink } from '../cart/CartLink';

export default function App() {
  const { pathname } = useLocation();
  const isInitial = useRef(true);

  useEffect(() => {
    // Skip the initial load; only manage focus on subsequent navigations.
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    // On client-side navigation, move focus to the main content and reset
    // scroll so keyboard and screen-reader users land at the new page.
    document.getElementById('main')?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <CartProvider>
      <CartAnnouncer />
      <PageShell headerActions={<CartLink />}>
        <Outlet />
      </PageShell>
    </CartProvider>
  );
}
