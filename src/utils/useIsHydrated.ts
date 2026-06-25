import { useEffect, useState } from 'react';

/**
 * Returns `false` during server render and the first client render, then `true`
 * after the component has mounted (hydrated).
 *
 * Use this to gate anything that differs between the server and the hydrating
 * client — e.g. values derived from `history.state`, which the browser restores
 * on reload (so React Router exposes it to the client) but which the server
 * never has. Reading such values only once hydrated keeps the first client
 * render identical to the server's and avoids hydration mismatches.
 */
export function useIsHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    // Flipping state once on mount is exactly how we detect hydration; the
    // single re-render is intentional and runs only once.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);
  return hydrated;
}
