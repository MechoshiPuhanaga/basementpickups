import { createContext } from 'react';

import { InitialState } from '@type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const InitialStateContext = createContext<InitialState<any>>({});
