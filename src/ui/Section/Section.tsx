import { FC, ReactNode } from 'react';

import styles from './Section.scss';

interface SectionProps {
  children: ReactNode;
}

export const Section: FC<SectionProps> = ({ children }) => {
  return <section className={styles.Container}>{children}</section>;
};

Section.displayName = 'Section';
