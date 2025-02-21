import { Fragment, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router';

import { LazyAbout } from '@pages/about';
import { LazyHome } from '@pages/home';
import { LazyProducts } from '@pages/products';
import { BaseCSS } from '@styles';
import { Loader } from '@ui';

const App = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Basement pickups</title>
        <meta name="description" content="basement pickups web site" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <BaseCSS />
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<LazyHome />} path="/" />
            <Route element={<LazyAbout />} path="about" />
            <Route element={<LazyProducts />} path="products" />
          </Routes>
        </Suspense>
      </main>
    </Fragment>
  );
};

export default {
  element: App
};
