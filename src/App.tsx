import { Suspense, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router';

import { Header } from '@components';
import { LazyAbout } from '@pages/about';
import { LazyArticles } from '@pages/articles';
import { LazyHome } from '@pages/home';
import { LazyProducts } from '@pages/products';
import { LazyProductDetails } from '@pages/products/product-details';
import { LazyProductsList } from '@pages/products/products-list';
import { AppStateProvider } from '@providers';
import { BaseCSS } from '@styles';
import { AppState } from '@type';
import { Loader, Main } from '@ui';

import products from './data/products.json';

const App = () => {
  const appStateValue: AppState = useMemo(() => {
    return {
      products
    };
  }, []);

  return (
    <AppStateProvider value={appStateValue}>
      <Helmet>
        <title>Basement pickups</title>
        <meta name="description" content="basement pickups web site" />
        <meta name="theme-color" content="#081229" />
      </Helmet>
      <BaseCSS />
      <Header />
      <Main>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<LazyHome />} path="/" />
            <Route element={<LazyProducts />} path="/products">
              <Route element={<LazyProductsList />} path="/products" />
              <Route element={<LazyProductDetails />} path="/products/:id" />
            </Route>
            <Route element={<LazyArticles />} path="/articles" />
            <Route element={<LazyAbout />} path="/about" />
          </Routes>
        </Suspense>
      </Main>
    </AppStateProvider>
  );
};

export default {
  element: App
};
