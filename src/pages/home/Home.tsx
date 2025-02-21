import { FC } from 'react';

import { SSRRouteConfig } from '@type';

import styles from './Home.scss';

const Home: FC = () => {
  return <section className={styles.Container}>Coming soon</section>;
};

Home.displayName = 'Home';

export const HomeConfig: SSRRouteConfig = {};

export default Home;
