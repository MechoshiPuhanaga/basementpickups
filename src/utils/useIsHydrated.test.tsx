import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { useIsHydrated } from './useIsHydrated';

function Probe() {
  return <span data-testid="probe">{useIsHydrated() ? 'hydrated' : 'server'}</span>;
}

describe('useIsHydrated', () => {
  it('is false on the server render', () => {
    expect(renderToString(<Probe />)).toContain('>server<');
  });

  it('flips to true once mounted on the client', () => {
    const { result } = renderHook(() => useIsHydrated());
    expect(result.current).toBe(true);
  });
});
