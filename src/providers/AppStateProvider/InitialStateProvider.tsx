import { ReactNode } from 'react';

import { AppState } from '@type';

import { AppStateContext } from './context';

interface AppStateProviderProps {
  children: ReactNode;
  value: AppState;
}

export const AppStateProvider = ({ children, value }: AppStateProviderProps) => {
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

AppStateProvider.displayName = 'AppStateProvider';
