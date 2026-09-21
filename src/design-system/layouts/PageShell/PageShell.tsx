import type { ReactNode } from 'react';

import { Footer } from '../../organisms/Footer';
import { Header } from '../../organisms/Header';
import { Seo } from '../../../seo/Seo';
import styles from './PageShell.module.css';

export interface PageShellProps {
  className?: string | undefined;
  headerActions?: ReactNode;
  headerMobileNav?: ReactNode;
  children?: ReactNode;
}

export function PageShell({ className, headerActions, headerMobileNav, children }: PageShellProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <div className={classes} data-testid="page-shell">
      <Seo />
      <a href="#main" className={styles['skipLink']} data-testid="skip-link">
        Skip to content
      </a>
      <Header actions={headerActions} mobileNav={headerMobileNav} />
      <main id="main" tabIndex={-1} className={styles['main']} data-testid="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
