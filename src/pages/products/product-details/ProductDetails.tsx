import { FC, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { SSRRouteConfig } from '@type';
import { Heading, P, Page, Section } from '@ui';

const ProductDetails: FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Product details</title>
        <meta name="description" content="Product details" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <Page>
        <Section>
          <Heading kind="h1">Product details</Heading>
          <P>Coming soon - product details</P>
        </Section>
      </Page>
    </Fragment>
  );
};

ProductDetails.displayName = 'ProductDetails';

export const ProductDetailsConfig: SSRRouteConfig = {};

export default ProductDetails;
