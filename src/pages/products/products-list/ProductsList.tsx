import { FC, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { useAppState } from '@providers';
import { SSRRouteConfig } from '@type';
import { Heading, Link, Page, Section } from '@ui';

import { PickupCard } from './components';

const ProductsList: FC = () => {
  const { products } = useAppState();

  return (
    <Fragment>
      <Helmet>
        <title>Products</title>
        <meta name="description" content="Products" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <Page>
        <Section>
          <Heading kind="h2">Humbuckers</Heading>
          {products.humbuckers.map((pickup) => {
            return <PickupCard key={pickup.id} pickup={pickup} />;
          })}
          <Link to="/products/macho-heaven">Macho heaven</Link>
        </Section>
      </Page>
    </Fragment>
  );
};

ProductsList.displayName = 'ProductsList';

export const ProductsListConfig: SSRRouteConfig = {};

export default ProductsList;
