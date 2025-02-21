import { lazy } from 'react';

export const LazyProducts = lazy(
  () => import(/* webpackPrefetch: true;  webpackChunkName: products */ './Products')
);
