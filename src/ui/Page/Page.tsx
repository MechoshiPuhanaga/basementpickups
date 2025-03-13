import { FC, ReactNode } from 'react';

import styles from './Page.scss';

interface PageProps {
  children: ReactNode;
}

export const Page: FC<PageProps> = ({ children }) => {
  return <div className={styles.Container}>{children}</div>;
};

Page.displayName = 'Page';
