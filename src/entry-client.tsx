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
// The production CSP enforces Trusted Types (`require-trusted-types-for 'script'`),
// which makes register()'s script URL a TrustedScriptURL sink — a raw string is
// blocked. Wrap it in a policy-vetted TrustedScriptURL first.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const swUrl = '/sw.js';
    const { trustedTypes } = window;
    const scriptUrl = trustedTypes
      ? trustedTypes.createPolicy('bp-sw', { createScriptURL: (url) => url }).createScriptURL(swUrl)
      : swUrl;
    // register() is typed `string | URL`; the DOM lib has no TrustedScriptURL
    // overload, but the browser honors the trusted object at runtime.
    void navigator.serviceWorker.register(scriptUrl as unknown as string);
  });
}
