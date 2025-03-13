import { FC, ReactNode } from 'react';

import { classer } from '@services/ui';

import styles from './P.scss';

interface PProps {
  children: ReactNode;
  className?: string;
}
export const P: FC<PProps> = ({ children, className }) => {
  return <p className={classer(styles.Container, className)}>{children}</p>;
};

P.displayName = 'P';
