import { FC, memo } from 'react';

export const Loader: FC = memo(() => {
  return <div data-test="loader">Loading...</div>;
});

Loader.displayName = 'Loader';
