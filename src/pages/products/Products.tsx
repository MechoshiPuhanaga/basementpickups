import { FC, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { Outlet } from 'react-router';

import { SSRRouteConfig } from '@type';

const Products: FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Products</title>
        <meta name="description" content="Basement pickups products" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <Outlet />
    </Fragment>
  );
};

Products.displayName = 'Products';

export const ProductsConfig: SSRRouteConfig = {};

export default Products;
