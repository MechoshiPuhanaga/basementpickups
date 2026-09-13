import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  cartLineKey,
  readStoredConfig,
  resolveConfig,
  type PickupConfig,
} from '../data/pickupConfig';
import { getPickupBySlug } from '../data/pickups';

export interface CartItem {
  /**
   * Stable line identity = slug + chosen build (see `cartLineKey`). Two adds
   * with the same id aggregate (qty grows); different builds of the same model
   * are separate lines. Always recomputed from slug+config, never trusted from
   * storage.
   */
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly price: number;
  readonly qty: number;
  /** Chosen build (colours, wire, pole pieces, cover, spacing); absent for non-configurable pickups. */
  readonly config?: PickupConfig;
}

export interface CartContextValue {
  readonly items: readonly CartItem[];
  readonly count: number;
  readonly subtotal: number;
  add: (item: Omit<CartItem, 'qty' | 'id'>) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  /** Replace a line's build; merges into a matching line if the new build collides. */
  updateConfig: (id: string, config: PickupConfig) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'bp-enquiry-cart-v1';

/** Validate the base shape (config is optional and validated separately). */
function isStoredItem(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item['slug'] === 'string' &&
    typeof item['name'] === 'string' &&
    typeof item['price'] === 'number' &&
    typeof item['qty'] === 'number' &&
    item['qty'] > 0
  );
}

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredItem).map((item) => {
      const slug = item['slug'] as string;
      // Resolve against the catalog so older lines (pre wire/cover options) and
      // any removed option settle on the current defaults — the same complete
      // build the product page would have added.
      const stored = readStoredConfig(item['config']);
      const pickup = getPickupBySlug(slug);
      const config = pickup === undefined ? stored : resolveConfig(pickup, stored);
      return {
        id: cartLineKey(slug, config),
        slug,
        name: item['name'] as string,
        price: item['price'] as number,
        qty: item['qty'] as number,
        ...(config ? { config } : {}),
      };
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  // Start empty so server render and first client (hydration) render match;
  // the real cart is loaded from localStorage after mount.
  const [items, setItems] = useState<readonly CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Load the persisted cart only after mount. Reading it during render (lazy
    // init) would diverge from the server's empty render and break hydration,
    // so a post-mount setState is the correct SSR-safe pattern here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable (private mode, quota) — ignore */
    }
  }, [items, hydrated]);

  const add = useCallback((item: Omit<CartItem, 'qty' | 'id'>) => {
    const id = cartLineKey(item.slug, item.config);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, id, qty: 1 }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );
  }, []);

  const updateConfig = useCallback((id: string, nextConfig: PickupConfig) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target === undefined) return prev;
      const nextId = cartLineKey(target.slug, nextConfig);
      if (nextId === id) {
        return prev.map((i) => (i.id === id ? { ...i, config: nextConfig } : i));
      }
      const collision = prev.find((i) => i.id === nextId);
      if (collision !== undefined) {
        // The edited line now matches another — merge quantities, drop the edited one.
        return prev
          .filter((i) => i.id !== id)
          .map((i) => (i.id === nextId ? { ...i, qty: i.qty + target.qty } : i));
      }
      return prev.map((i) => (i.id === id ? { ...i, id: nextId, config: nextConfig } : i));
    });
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    return { items, count, subtotal, add, remove, setQty, updateConfig, clear };
  }, [items, add, remove, setQty, updateConfig, clear]);

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (ctx === null) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
