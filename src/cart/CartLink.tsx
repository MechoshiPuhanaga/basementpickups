import { Button } from '../design-system/atoms/Button';
import { useCart } from './CartContext';

/** Header action linking to the enquiry cart, with a live item count. */
export function CartLink() {
  const { count } = useCart();

  return (
    <Button linkTo="/cart" variant="ghost" size="sm">
      {count > 0 ? `Enquiry (${String(count)})` : 'Enquiry'}
    </Button>
  );
}
