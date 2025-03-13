import { lazy } from 'react';

export const LazyProductDetails = lazy(
  () => import(/* webpackPrefetch: true;  webpackChunkName: product-details */ './ProductDetails')
);
