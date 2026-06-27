import { useId, useState, type ReactNode } from 'react';

import { Heading, type HeadingLevel } from '../../atoms/Heading';
import styles from './Disclosure.module.css';

export interface DisclosureProps {
  /**
   * The toggle label on mobile. In `desktop="heading"` mode this is also the
   * section heading shown (always open) on larger screens.
   */
  title: ReactNode;
  children: ReactNode;
  /**
   * Larger-screen (>768px) behaviour:
   * - `dissolve` (default): the wrapper dissolves (`display: contents`) so its
   *   panel flows inline, always open; the toggle never shows. Used by filter
   *   bars.
   * - `heading`: `title` renders as a section heading with the panel always
   *   open beneath it. Used by content sections such as product specs.
   *
   * Both modes collapse behind the same tappable toggle at ≤768px.
   */
  desktop?: 'dissolve' | 'heading' | undefined;
  /** Decorative leading icon inside the toggle (e.g. the filter lotus). */
  icon?: ReactNode | undefined;
  /** Read-only summary chips shown on the collapsed toggle (e.g. active filters). */
  summary?: readonly string[] | undefined;
  /** Heading level used when `desktop="heading"`. Defaults to 2. */
  headingLevel?: HeadingLevel | undefined;
  /** Whether the panel starts open at mobile width. Defaults to false. */
  defaultOpen?: boolean | undefined;
  className?: string | undefined;
}

/**
 * Generic Art Deco accordion. On large screens it either dissolves so its
 * content flows inline (filters) or renders a static section heading above an
 * open panel (specs); at ≤768px both modes collapse behind a gold chevron
 * toggle. SSR-safe — the open state is irrelevant to the desktop layout, which
 * is driven purely by CSS.
 */
export function Disclosure({
  title,
  children,
  desktop = 'dissolve',
  icon,
  summary,
  headingLevel = 2,
  defaultOpen = false,
  className,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  const isHeading = desktop === 'heading';
  const classes = [styles['disclosure'], className].filter(Boolean).join(' ');

  const toggle = (
    <button
      type="button"
      className={styles['toggle']}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={() => {
        setOpen((prev) => !prev);
      }}
    >
      {icon !== undefined && (
        <span className={styles['icon']} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles['label']}>{title}</span>
      {summary !== undefined && summary.length > 0 && (
        <span className={styles['chips']}>
          {summary.map((entry) => (
            <span key={entry} className={styles['chip']}>
              {entry}
            </span>
          ))}
        </span>
      )}
      <span className={styles['chevron']} aria-hidden="true">
        <svg viewBox="0 0 12 8" fill="none" stroke="currentColor" focusable="false">
          <path d="M1 1.5 L6 6.5 L11 1.5" strokeWidth="1.25" strokeLinecap="square" />
        </svg>
      </span>
    </button>
  );

  return (
    <div className={classes} data-desktop={desktop} data-open={open ? 'true' : 'false'}>
      {isHeading && (
        <Heading level={headingLevel} variant="section" className={styles['staticHeading']}>
          {title}
        </Heading>
      )}
      {isHeading ? (
        <Heading level={headingLevel} variant="section" className={styles['toggleHeading']}>
          {toggle}
        </Heading>
      ) : (
        toggle
      )}
      <div id={panelId} className={styles['panel']}>
        <div className={styles['panelInner']}>{children}</div>
      </div>
    </div>
  );
}
