import { FC, ReactNode } from 'react';

import styles from './Main.scss';

interface MainProps {
  children: ReactNode;
}

export const Main: FC<MainProps> = ({ children }) => {
  return <main className={styles.Container}>{children}</main>;
};

Main.displayName = 'Main';
