import { useContext } from 'react';

import { InitialStateContext } from '../context';

export const useInitialState = <T>(): T => useContext(InitialStateContext);
