import { SSRRoute } from '@type';

import { LazyAbout } from './about';
import { AboutConfig } from './about/About';
import { LazyArticles } from './articles';
import { ArticlesConfig } from './articles/Articles';
import { LazyHome } from './home';
import { HomeConfig } from './home/Home';
import { LazyProducts } from './products';
import { LazyProductDetails } from './products/product-details';
import { ProductDetailsConfig } from './products/product-details/ProductDetails';
import { ProductsConfig } from './products/Products';
import { LazyProductsList } from './products/products-list';
import { ProductsListConfig } from './products/products-list/ProductsList';

export const routes: SSRRoute[] = [
  {
    ...HomeConfig,
    element: LazyHome,
    exact: true,
    path: '/'
  },
  {
    ...AboutConfig,
    element: LazyAbout,
    exact: true,
    path: '/about'
  },
  {
    ...ProductsConfig,
    element: LazyProducts,
    exact: false,
    path: '/products'
  },
  {
    ...ProductsListConfig,
    element: LazyProductsList,
    exact: true,
    path: '/products'
  },
  {
    ...ProductDetailsConfig,
    element: LazyProductDetails,
    exact: false,
    path: '/products/:id'
  },
  {
    ...ArticlesConfig,
    element: LazyArticles,
    exact: false,
    path: '/articles'
  }
];
