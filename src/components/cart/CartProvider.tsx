"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, ProductVariant, ProductSize } from "@/types";

interface CartItemInput {
  id: string;
  productId: string;
  variant: ProductVariant;
  size: ProductSize;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItemInput) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "rostra-cart";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function createCartItem(input: CartItemInput): CartItem {
  const unitPrice = input.variant.price + input.size.priceModifier;
  return {
    id: input.id || generateId(),
    productId: input.productId,
    variant: input.variant,
    size: input.size,
    quantity: input.quantity,
    totalPrice: unitPrice * input.quantity,
  };
}

export function CartProvider({ children }: { children?: ReactNode }) {
  // Optimistic state for immediate UI updates
  const [optimisticItems, setOptimisticItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setOptimisticItems(parsed);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Persist cart to localStorage whenever optimistic items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(optimisticItems));
      } catch (error) {
        console.error("Failed to save cart to localStorage:", error);
      }
    }
  }, [optimisticItems, isInitialized]);

  const addToCart = useCallback((input: CartItemInput) => {
    setOptimisticItems((currentItems: CartItem[]) => {
      // Check if item with same productId, variant, and size exists
      const existingIndex = currentItems.findIndex(
        (item: CartItem) =>
          item.productId === input.productId &&
          item.variant.id === input.variant.id &&
          item.size.id === input.size.id,
      );

      if (existingIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        const existingItem = updatedItems[existingIndex];
        const newQuantity = existingItem.quantity + input.quantity;
        const unitPrice =
          existingItem.variant.price + existingItem.size.priceModifier;

        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity,
        };

        return updatedItems;
      }

      // Add new item
      return [...currentItems, createCartItem(input)];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setOptimisticItems((currentItems: CartItem[]) =>
      currentItems.filter((item: CartItem) => item.id !== id),
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      setOptimisticItems((currentItems: CartItem[]) =>
        currentItems.filter((item: CartItem) => item.id !== id),
      );
      return;
    }

    setOptimisticItems((currentItems: CartItem[]) =>
      currentItems.map((item: CartItem) => {
        if (item.id === id) {
          const unitPrice = item.variant.price + item.size.priceModifier;
          return {
            ...item,
            quantity,
            totalPrice: unitPrice * quantity,
          };
        }
        return item;
      }),
    );
  }, []);

  const clearCart = useCallback(() => {
    setOptimisticItems([]);
  }, []);

  const cartTotal = calculateTotal(optimisticItems);
  const cartItemCount = calculateItemCount(optimisticItems);

  return (
    <CartContext.Provider
      value={{
        items: optimisticItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  // Return default values if not within a provider (for SSG/build time)
  if (context === undefined) {
    return {
      items: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      cartTotal: 0,
      cartItemCount: 0,
      isOpen: false,
      setIsOpen: () => {},
    };
  }
  return context;
}
