import { lazy } from 'react';

export const LazyHome = lazy(
  () => import(/* webpackPrefetch: true; webpackChunkName: home */ './Home')
);
