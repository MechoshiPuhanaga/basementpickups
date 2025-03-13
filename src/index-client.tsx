import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Workbox } from 'workbox-window';

import { AppStateProvider } from '@providers';
import { AppState } from '@type';

import AppConfig from './App';
import products from './data/products.json';

if (process.env.MODE === 'production') {
  disableReactDevTools();
}

const appState: AppState = {
  products
};

const App = AppConfig.element;

const app = (
  <AppStateProvider value={appState}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppStateProvider>
);

const root = document.getElementById('root');

if (root) {
  hydrateRoot(root, app);

  if ('serviceWorker' in navigator) {
    const serviceWorker = new Workbox('/sw.js');

    serviceWorker.register();

    serviceWorker.addEventListener('controlling', () => {
      location.reload();
    });
  }
}
