import { createContext } from 'react';

import { AppState } from '@type';

const initialAppState: AppState = {
  products: {
    humbuckers: []
  }
};

export const AppStateContext = createContext<AppState>(initialAppState);
