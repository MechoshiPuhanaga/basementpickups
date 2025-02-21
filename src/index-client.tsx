import { disableReactDevTools } from '@fvilers/disable-react-devtools';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Workbox } from 'workbox-window';

import { InitialStateProvider } from '@providers';
import { ClientModel } from '@services/models/ClientModel';

import AppConfig from './App';

if (process.env.MODE === 'production') {
  disableReactDevTools();
}

const App = AppConfig.element;

const app = (
  <InitialStateProvider value={ClientModel.getInitialState()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </InitialStateProvider>
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
