import { ReactNode } from 'react';

import { InitialState } from '@type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface InitialStateProviderProps<T extends InitialState<any>> {
  children: ReactNode;
  value: T;
}
