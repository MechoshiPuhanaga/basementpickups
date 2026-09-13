import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';

import { PageShell } from '../design-system/layouts/PageShell';
import { CartAnnouncer } from '../cart/CartAnnouncer';
import { CartProvider } from '../cart/CartContext';
import { CartLink } from '../cart/CartLink';
import { MobileNav } from '../cart/MobileNav';

export default function App() {
  const location = useLocation();
  const { pathname, hash } = location;
  // In-context navigation (e.g. switching a product's variant) opts out of the
  // reset via `preserveScroll`, so focus stays on the control the user just
  // used instead of jumping to the top of the new page.
  const preserveScroll =
    (location.state as { preserveScroll?: boolean } | null)?.preserveScroll === true;
  const isInitial = useRef(true);

  useEffect(() => {
    // Skip the initial load; only manage focus on subsequent navigations.
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    if (preserveScroll) return;
    // On client-side navigation, move focus to the main content and reset
    // scroll so keyboard and screen-reader users land at the new page. A hash
    // (e.g. /faq#option-availability) scrolls to that anchor instead.
    document.getElementById('main')?.focus();
    const anchor = hash === '' ? null : document.getElementById(hash.slice(1));
    if (anchor !== null) {
      anchor.scrollIntoView({ block: 'start' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, preserveScroll]);

  return (
    <CartProvider>
      <CartAnnouncer />
      <PageShell headerActions={<CartLink />} headerMobileNav={<MobileNav />}>
        <Outlet />
      </PageShell>
    </CartProvider>
  );
}
