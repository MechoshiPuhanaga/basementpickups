import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createAppBrowserRouter } from './app/router';

import './design-system/tokens/fonts.css';
import './design-system/tokens/reset.css';
import './design-system/tokens/tokens.css';
import './design-system/tokens/global.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root not found');
}

const router = createAppBrowserRouter();

hydrateRoot(
  rootElement,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

// Register the service worker in production only (it would fight Vite HMR in dev).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js');
  });
}
