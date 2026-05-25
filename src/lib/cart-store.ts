import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
};

type CartState = { items: CartItem[]; isOpen: boolean };

let state: CartState = { items: [], isOpen: false };
const SERVER_STATE: CartState = { items: [], isOpen: false };
const listeners = new Set<() => void>();

const STORAGE_KEY = "ch-style-cart";

if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, items: JSON.parse(raw) };
  } catch {}
}

const persist = () => {
  if (typeof window !== "undefined") {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)); } catch {}
  }
};

const setState = (next: Partial<CartState>) => {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
};

export const cartStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  getSnapshot() { return state; },
  getServerSnapshot() { return SERVER_STATE; },
  add(item: Omit<CartItem, "quantity">, qty = 1) {
    const key = (i: CartItem) => `${i.id}-${i.size}-${i.color}`;
    const existing = state.items.find((i) => key(i) === key({ ...item, quantity: 0 }));
    if (existing) {
      setState({
        items: state.items.map((i) => key(i) === key(existing) ? { ...i, quantity: i.quantity + qty } : i),
        isOpen: true,
      });
    } else {
      setState({ items: [...state.items, { ...item, quantity: qty }], isOpen: true });
    }
  },
  remove(id: string, size: string, color: string) {
    setState({ items: state.items.filter((i) => !(i.id === id && i.size === size && i.color === color)) });
  },
  updateQty(id: string, size: string, color: string, quantity: number) {
    if (quantity <= 0) return cartStore.remove(id, size, color);
    setState({ items: state.items.map((i) => i.id === id && i.size === size && i.color === color ? { ...i, quantity } : i) });
  },
  open() { setState({ isOpen: true }); },
  close() { setState({ isOpen: false }); },
  toggle() { setState({ isOpen: !state.isOpen }); },
};

export function useCart(): CartState {
  return useSyncExternalStore(cartStore.subscribe, cartStore.getSnapshot, cartStore.getServerSnapshot);
}
