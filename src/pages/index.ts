import { SSRRoute } from '@type';

import { LazyAbout } from './about';
import { AboutConfig } from './about/About';
import { LazyHome } from './home';
import { HomeConfig } from './home/Home';
import { LazyProducts } from './products';
import { ProductsConfig } from './products/Products';

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
  }
];
