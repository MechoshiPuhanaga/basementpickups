import { FC } from 'react';
import { Helmet } from 'react-helmet';

import { SSRRouteConfig } from '@type';
import { Heading, P, Page, Section } from '@ui';

const Articles: FC = () => {
  return (
    <>
      <Helmet>
        <title>Articles</title>
        <meta name="description" content="Basement pickups articles page" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <Page>
        <Section>
          <Heading kind="h1">Articles</Heading>
          <P>Coming soon - articles on electric guitar pickups building</P>
        </Section>
      </Page>
    </>
  );
};

Articles.displayName = 'Articles';

export const ArticlesConfig: SSRRouteConfig = {};

export default Articles;
