import { FC } from 'react';
import { Helmet } from 'react-helmet';

import { InitialState, SSRRouteConfig } from '@type';

interface AboutInitialState {
  quantity: number;
}

const getAboutInitialState = (): Promise<InitialState<AboutInitialState>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ quantity: 1 });
    }, 300);
  });

const About: FC = () => {
  return (
    <>
      <Helmet>
        <title>About</title>
        <meta name="description" content="Basement pickups about page" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <section>About - Coming soon</section>
    </>
  );
};

About.displayName = 'About';

export const AboutConfig: SSRRouteConfig = {
  loadData: getAboutInitialState
};

export default About;
