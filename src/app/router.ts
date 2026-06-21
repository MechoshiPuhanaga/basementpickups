import { createBrowserRouter } from 'react-router';
import { routes } from './routes';

type BrowserRouterOpts = NonNullable<Parameters<typeof createBrowserRouter>[1]>;
type HydrationData = NonNullable<BrowserRouterOpts['hydrationData']>;

export function createAppBrowserRouter() {
  if (typeof window !== 'undefined' && window.__staticRouterHydrationData !== undefined) {
    return createBrowserRouter(routes, {
      hydrationData: window.__staticRouterHydrationData as HydrationData,
    });
  }
  return createBrowserRouter(routes);
}
