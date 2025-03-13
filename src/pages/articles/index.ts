import { lazy } from 'react';

export const LazyArticles = lazy(
  () => import(/* webpackPrefetch: true; webpackChunkName: articles */ './Articles')
);
