import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem as CartItemType } from "../types";
import { toast } from "sonner";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";

export type CartItem = CartItemType;

// Cart store interface
interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  recentlyRemoved: CartItem | null;
  removedItems: Array<{ item: CartItem; timestamp: number }>;

  // Actions
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  undoRemove: () => void;
  undoRemoveById: (timestamp: number) => void;
  clearRecentlyRemoved: () => void;
  dismissRemovedItem: (timestamp: number) => void;

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
      removedItems: [],

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        const quantityAvailable = item.quantityAvailable;

        if (existingItem) {
          // Check if we can add more of this item
          const newQuantity = existingItem.quantity + (item.quantity || 1);

          if (quantityAvailable && newQuantity > quantityAvailable) {
            toast.error(`Only ${quantityAvailable} available in stock`);
            return;
          }

          // Update quantity if item already exists
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: newQuantity, quantityAvailable: item.quantityAvailable }
                : i
            ),
          });
        } else {
          // Check if quantity requested is available
          const requestedQuantity = item.quantity || 1;
          if (quantityAvailable && requestedQuantity > quantityAvailable) {
            toast.error(`Only ${quantityAvailable} available in stock`);
            return;
          }

          // Add new item
          set({
            items: [...get().items, { ...item, quantity: requestedQuantity }],
          });
        }
      },

      removeItem: (id) => {
        const itemToRemove = get().items.find((item) => item.id === id);
        if (itemToRemove) {
          const timestamp = Date.now();
          set({
            items: get().items.filter((item) => item.id !== id),
            recentlyRemoved: itemToRemove,
            removedItems: [...get().removedItems, { item: itemToRemove, timestamp }],
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

      undoRemoveById: (timestamp) => {
        const removedEntry = get().removedItems.find((r) => r.timestamp === timestamp);
        if (removedEntry) {
          set({
            items: [...get().items, removedEntry.item],
            removedItems: get().removedItems.filter((r) => r.timestamp !== timestamp),
          });
        }
      },

      clearRecentlyRemoved: () => {
        set({ recentlyRemoved: null });
      },

      dismissRemovedItem: (timestamp) => {
        set({
          removedItems: get().removedItems.filter((r) => r.timestamp !== timestamp),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          // Check if quantity is available
          const item = get().items.find((i) => i.id === id);
          if (item?.quantityAvailable && quantity > item.quantityAvailable) {
            toast.error(`Only ${item.quantityAvailable} available in stock`);
            return;
          }

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
        const subtotal = get().totalPrice();
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        return remaining > 0 ? remaining : 0;
      },

      qualifiesForFreeShipping: () => {
        return get().totalPrice() >= FREE_SHIPPING_THRESHOLD;
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
