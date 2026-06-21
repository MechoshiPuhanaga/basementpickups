import type { ReactNode } from 'react';

import styles from './ArticleLayout.module.css';

export interface ArticleLayoutProps {
  hero?: ReactNode;
  header: ReactNode;
  body: ReactNode;
  aside?: ReactNode;
  className?: string | undefined;
}

export function ArticleLayout({ hero, header, body, aside, className }: ArticleLayoutProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      {hero !== undefined && <div className={styles['hero']}>{hero}</div>}
      <header className={styles['header']}>{header}</header>
      <div className={styles['body']}>{body}</div>
      {aside !== undefined && <aside className={styles['aside']}>{aside}</aside>}
    </article>
  );
}
