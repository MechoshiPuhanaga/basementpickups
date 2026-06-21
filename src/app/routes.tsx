import type { RouteObject } from 'react-router';
import App from './App';
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductPage from '../pages/ProductPage';
import ArticlesIndexPage from '../pages/ArticlesIndexPage';
import ArticlePage from '../pages/ArticlePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import CartPage from '../pages/CartPage';
import NotFoundPage from '../pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: HomePage },
      { path: 'shop', Component: ShopPage },
      { path: 'products/:slug', Component: ProductPage },
      { path: 'articles', Component: ArticlesIndexPage },
      { path: 'articles/:slug', Component: ArticlePage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: 'cart', Component: CartPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];
