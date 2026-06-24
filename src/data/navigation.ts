export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const primaryNav: readonly NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Shop', href: '/shop' },
  { label: 'Articles', href: '/articles' },
  { label: 'Q&A', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];
