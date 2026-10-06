import { Link } from 'react-router';

import type { TestIdProps } from '../../testing';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  readonly label: string;
  readonly to: string;
}

export interface BreadcrumbsProps extends TestIdProps {
  /** The trail from the site root; the last item is the current page (not linked). */
  items: readonly BreadcrumbItem[];
}

/**
 * The page's place in the site (Home › Shop › White Pearl): small gold-accented
 * capitals, ancestors as links, the current page marked with `aria-current`.
 * Separators are decorative and hidden from assistive tech.
 */
export function Breadcrumbs({ items, 'data-testid': testId = 'breadcrumbs' }: BreadcrumbsProps) {
  const lastIndex = items.length - 1;

  return (
    <nav aria-label="Breadcrumb" className={styles['nav']} data-testid={testId}>
      <ol className={styles['list']}>
        {items.map((item, index) => (
          <li key={item.to} className={styles['item']}>
            {index > 0 && (
              <span aria-hidden="true" className={styles['separator']}>
                ›
              </span>
            )}
            {index === lastIndex ? (
              <span
                aria-current="page"
                className={styles['current']}
                data-testid={`${testId}-current`}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className={styles['link']}
                data-testid={`${testId}-link-${String(index)}`}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
