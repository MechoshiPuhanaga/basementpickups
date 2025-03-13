import { lazy } from 'react';

export const LazyProductsList = lazy(
  () => import(/* webpackPrefetch: true;  webpackChunkName: products-list */ './ProductsList')
);
