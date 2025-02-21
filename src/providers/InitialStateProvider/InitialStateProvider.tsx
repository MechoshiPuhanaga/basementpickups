import { memo } from 'react';

import { InitialState } from '@type';

import { InitialStateContext } from './context';
import { InitialStateProviderProps } from './types';

export const InitialStateProvider = memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <T extends InitialState<any>>({ children, value }: InitialStateProviderProps<T>) => {
    return <InitialStateContext.Provider value={value}>{children}</InitialStateContext.Provider>;
  }
);

InitialStateProvider.displayName = 'InitialStateProvider';
