import { MobileMenu } from '../design-system/organisms/MobileMenu';
import { primaryNav } from '../data/navigation';
import { useCart } from './CartContext';

/** Phone/tablet navigation overlay wired to the live enquiry-cart count. */
export function MobileNav() {
  const { count } = useCart();
  return <MobileMenu links={primaryNav} enquiryCount={count} />;
}
