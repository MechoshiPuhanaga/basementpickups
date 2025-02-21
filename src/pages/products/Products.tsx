import { FC, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import { InitialState, SSRRouteConfig } from '@type';

interface ProductsInitialState {
  products: Array<string>;
}

const getProductsInitialState = (): Promise<InitialState<ProductsInitialState>> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({ products: ['Macho Heaven'] });
    }, 300);
  });

const Products: FC = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Products</title>
        <meta name="description" content="Basement pickups products" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <section>Products - coming soon</section>
    </Fragment>
  );
};

Products.displayName = 'Products';

export const ProductsConfig: SSRRouteConfig = {
  loadData: getProductsInitialState
};

export default Products;
