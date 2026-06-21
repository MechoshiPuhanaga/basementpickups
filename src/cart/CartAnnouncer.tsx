import { VisuallyHidden } from '../design-system/atoms/VisuallyHidden';
import { useCart } from './CartContext';

/**
 * Screen-reader-only live region that announces enquiry-cart changes (the
 * derived text changes when the count changes, which `aria-live` announces).
 */
export function CartAnnouncer() {
  const { count } = useCart();
  const message =
    count === 0 ? '' : `${String(count)} ${count === 1 ? 'item' : 'items'} in your enquiry`;

  return (
    <VisuallyHidden as="div" role="status" aria-live="polite">
      {message}
    </VisuallyHidden>
  );
}
