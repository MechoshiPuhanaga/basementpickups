import { FC } from 'react';

import { classer } from '@services/ui';
import { Link } from '@ui';

import styles from './MainNavigation.scss';

interface MainNavigationProps {
  className?: string;
}

export const MainNavigation: FC<MainNavigationProps> = ({ className }) => {
  return (
    <nav className={classer(styles.Container, className)}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/articles">Articles</Link>
      <Link to="/about">About</Link>
    </nav>
  );
};

MainNavigation.displayName = 'MainNavigation';
