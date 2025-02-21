import { lazy } from 'react';

export const LazyAbout = lazy(
  () => import(/* webpackPrefetch: true;  webpackChunkName: about */ './About')
);
