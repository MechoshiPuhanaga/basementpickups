import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { DecoOrnament } from '../../atoms/DecoOrnament';
import { DecoSeparator } from '../../atoms/DecoSeparator';
import { NavIcon, type NavIconName } from '../../atoms/NavIcon';
import styles from './MobileMenu.module.css';

export interface MobileMenuLink {
  readonly label: string;
  readonly href: string;
}

export interface MobileMenuProps {
  links: readonly MobileMenuLink[];
  enquiryCount: number;
  enquiryHref?: string | undefined;
  enquiryLabel?: string | undefined;
  className?: string | undefined;
}

const ICON_BY_HREF: Record<string, NavIconName> = {
  '/': 'home',
  '/about': 'about',
  '/shop': 'shop',
  '/articles': 'articles',
  '/faq': 'faq',
  '/contact': 'contact',
};

function iconForHref(href: string): NavIconName {
  return ICON_BY_HREF[href] ?? 'articles';
}

/**
 * `closing` keeps the overlay mounted while its exit animation plays; it
 * unmounts on `closed`. The closed → open → closing → closed cycle is what
 * lets the menu animate out instead of being removed abruptly by React.
 */
type MenuState = 'closed' | 'open' | 'closing';

/** Safety net: unmount the overlay even if `animationend` never fires. */
const EXIT_FALLBACK_MS = 600;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Phone/tablet navigation: a burger toggle that opens a full-screen overlay. */
export function MobileMenu({
  links,
  enquiryCount,
  enquiryHref = '/cart',
  enquiryLabel = 'Enquiry',
  className,
}: MobileMenuProps) {
  const [state, setState] = useState<MenuState>('closed');
  const open = state === 'open';
  const rendered = state !== 'closed';
  const { pathname } = useLocation();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Begin the exit: animate out unless reduced-motion is on, in which case no
  // animationend would fire so we drop straight to closed.
  const close = useCallback(() => {
    setState((current) =>
      current === 'open' ? (prefersReducedMotion() ? 'closed' : 'closing') : current,
    );
  }, []);

  // Finish the exit: the overlay leaves the DOM only after the animation ends.
  const finishClose = useCallback(() => {
    setState((current) => (current === 'closing' ? 'closed' : current));
  }, []);

  // Close on route change so navigating from inside the overlay dismisses it.
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      close();
    }
  }, [pathname, close]);

  // Belt-and-braces: if animationend is missed (or animations are disabled),
  // still unmount after the exit window.
  useEffect(() => {
    if (state !== 'closing') return undefined;
    const timer = window.setTimeout(finishClose, EXIT_FALLBACK_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [state, finishClose]);

  // Lock body scroll, move focus into the dialog, and restore on close.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const trigger = triggerRef.current;
    body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusables === undefined || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (first === undefined || last === undefined) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [open, close]);

  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <button
        ref={triggerRef}
        type="button"
        className={styles['trigger']}
        aria-label="Open menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          setState('open');
        }}
      >
        <span className={styles['burger']} aria-hidden="true">
          <span className={styles['burgerLine']} />
          <span className={styles['burgerLine']} />
          <span className={styles['burgerLine']} />
        </span>
      </button>

      {rendered && (
        <>
          <button
            type="button"
            className={styles['scrim']}
            data-state={state}
            aria-label="Close menu"
            onClick={close}
            inert={state === 'closing'}
          />
          <div
            ref={dialogRef}
            className={styles['panel']}
            data-state={state}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            tabIndex={-1}
            inert={state === 'closing'}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) finishClose();
            }}
          >
            <div className={styles['overlayTop']}>
              <Link to="/" className={styles['brand']} aria-label="Basement Pickups — home">
                <img
                  src="/assets/logo/BP_Gold_horizont.svg"
                  alt=""
                  width={273}
                  height={100}
                  className={styles['logo']}
                />
              </Link>
              <button
                type="button"
                className={styles['close']}
                aria-label="Close menu"
                onClick={close}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="square"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M5 5 L19 19" vectorEffect="non-scaling-stroke" />
                  <path d="M19 5 L5 19" vectorEffect="non-scaling-stroke" />
                </svg>
              </button>
            </div>

            <DecoSeparator variant="crest" className={styles['topDivider']} />

            <nav aria-label="Primary" className={styles['nav']}>
              <ul className={styles['list']} role="list">
                {links.map((link) => (
                  <li key={link.href} className={styles['item']}>
                    <NavLink
                      to={link.href}
                      end={link.href === '/'}
                      className={({ isActive }) =>
                        [styles['link'], isActive ? styles['linkActive'] : undefined]
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      <NavIcon
                        name={iconForHref(link.href)}
                        size={22}
                        className={styles['linkIcon']}
                      />
                      <span className={styles['linkLabel']}>{link.label}</span>
                      <DecoOrnament
                        variant="diamond"
                        filled
                        size={8}
                        className={styles['linkDiamond']}
                      />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            <DecoSeparator variant="medallion" className={styles['divider']} />

            <Link to={enquiryHref} className={styles['enquiry']}>
              <span className={styles['enquiryGlyph']}>
                <NavIcon name="cart" size={52} />
                {enquiryCount > 0 && (
                  <span className={styles['badge']} aria-hidden="true">
                    {enquiryCount}
                  </span>
                )}
              </span>
              <span className={styles['enquiryText']}>
                <span className={styles['enquiryLabel']}>
                  {enquiryLabel}
                  {enquiryCount > 0 && (
                    <span className={styles['srOnly']}>{`, ${String(enquiryCount)} items`}</span>
                  )}
                </span>
                <span className={styles['enquiryHint']}>View your enquiry list</span>
              </span>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
