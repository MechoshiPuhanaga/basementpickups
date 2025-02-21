import { Suspense } from 'react';
import { Route } from 'react-router';

import { SSRRoute } from '@type';
import { Loader } from '@ui';

interface RenderRoutesArgs {
  routes: SSRRoute[];
}

export class GlobalModel {
  static flattenRoutes = (routes: SSRRoute[], res: SSRRoute[] = [], parentPath = '') => {
    routes.forEach((route) => {
      res.push({ ...route, path: `${parentPath}${route.path}` });

      if (route.pages) {
        const [normalizedParentPath] = route.path.split('/*');

        GlobalModel.flattenRoutes(route.pages, res, normalizedParentPath);
      }
    });

    return res;
  };

  static renderRoutes = ({ routes }: RenderRoutesArgs) => {
    return routes.map((route) => {
      const Component = route.element;

      return (
        <Route
          {...route}
          element={
            <Suspense fallback={<Loader />}>
              <Component />
            </Suspense>
          }
          key={route.path}
        />
      );
    });
  };
}
