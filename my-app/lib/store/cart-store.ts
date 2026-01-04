import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem as CartItemType } from "../types";

export type CartItem = CartItemType;

// Cart store interface
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  recentlyRemoved: CartItem | null;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  undoRemove: () => void;
  clearRecentlyRemoved: () => void;

  // Computed values
  totalItems: () => number;
  totalPrice: () => number;
  totalWeight: () => number;
  getRemainingForFreeShipping: () => number;
  qualifiesForFreeShipping: () => boolean;
}

// Create the cart store with persistence
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      recentlyRemoved: null,

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);

        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + (item.quantity || 1) }
                : i
            ),
          });
        } else {
          // Add new item
          set({
            items: [...get().items, { ...item, quantity: item.quantity || 1 }],
          });
        }
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find((item) => item.id === id);
        if (itemToRemove) {
          set({
            items: get().items.filter((item) => item.id !== id),
            recentlyRemoved: itemToRemove,
          });
        }
      },

      undoRemove: () => {
        const { recentlyRemoved } = get();
        if (recentlyRemoved) {
          set({
            items: [...get().items, recentlyRemoved],
            recentlyRemoved: null,
          });
        }
      },

      clearRecentlyRemoved: () => {
        set({ recentlyRemoved: null });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      totalWeight: () => {
        return get().items.reduce(
          (total, item) => total + (item.weight || 0.5) * item.quantity,
          0
        );
      },

      getRemainingForFreeShipping: () => {
        const FREE_SHIPPING_THRESHOLD = 75;
        const subtotal = get().totalPrice();
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        return remaining > 0 ? remaining : 0;
      },

      qualifiesForFreeShipping: () => {
        const FREE_SHIPPING_THRESHOLD = 75;
        return get().totalPrice() >= FREE_SHIPPING_THRESHOLD;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
