import type { ReactNode } from 'react';
import { Link } from 'react-router';

import styles from './TextLink.module.css';

export interface TextLinkProps {
  /** In-app destination (may include a hash, e.g. `/faq#option-availability`). */
  to: string;
  className?: string | undefined;
  children?: ReactNode;
}

/** An inline text link in running copy: gold, underlined, inherits the font. */
export function TextLink({ to, className, children }: TextLinkProps) {
  const classes = [styles['link'], className].filter(Boolean).join(' ');

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
}
