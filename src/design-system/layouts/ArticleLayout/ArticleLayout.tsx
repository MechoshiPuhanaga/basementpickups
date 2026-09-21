import type { ReactNode } from 'react';

import type { TestIdProps } from '../../testing';
import styles from './ArticleLayout.module.css';

export interface ArticleLayoutProps extends TestIdProps {
  hero?: ReactNode;
  header: ReactNode;
  body: ReactNode;
  aside?: ReactNode;
  className?: string | undefined;
}

export function ArticleLayout({
  hero,
  header,
  body,
  aside,
  className,
  'data-testid': testId,
}: ArticleLayoutProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const part = (name: string) => (testId === undefined ? undefined : `${testId}-${name}`);

  return (
    <article className={classes} data-testid={testId}>
      {hero !== undefined && (
        <div className={styles['hero']} data-testid={part('hero')}>
          {hero}
        </div>
      )}
      <header className={styles['header']} data-testid={part('header')}>
        {header}
      </header>
      <div className={styles['body']} data-testid={part('body')}>
        {body}
      </div>
      {aside !== undefined && (
        <aside className={styles['aside']} data-testid={part('aside')}>
          {aside}
        </aside>
      )}
    </article>
  );
}
