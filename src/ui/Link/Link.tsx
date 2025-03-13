import { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import { classer } from '@services/ui';

import styles from './Link.scss';

interface LinkProps {
  children: ReactNode;
  inheritColor?: boolean;
  to: string;
}
export const Link: FC<LinkProps> = ({ children, inheritColor, to }) => {
  return (
    <NavLink
      className={({ isActive }) =>
        isActive
          ? classer(styles.Container, inheritColor && styles.InheritColor, styles.Active)
          : classer(styles.Container, inheritColor && styles.InheritColor)
      }
      to={to}
    >
      {children}
    </NavLink>
  );
};

Link.displayName = 'Link';
