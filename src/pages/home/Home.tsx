import { FC } from 'react';

import { SSRRouteConfig } from '@type';
import { Heading, P, Page, Section } from '@ui';

const Home: FC = () => {
  return (
    <Page>
      <Section>
        <Heading kind="h1">Welcome</Heading>
        <P>Coming soon - news and offers</P>
      </Section>
    </Page>
  );
};

Home.displayName = 'Home';

export const HomeConfig: SSRRouteConfig = {};

export default Home;
