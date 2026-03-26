/**
 * Product Types for Rostra Coffee Brand
 */

// Product variant types - 4 signature variants
export type ProductVariantType =
  | "espresso"
  | "latte"
  | "cappuccino"
  | "coldbrew";

export interface ProductVariant {
  id: string;
  type: ProductVariantType;
  name: string;
  description: string;
  price: number;
  image?: string;
}

// Product size types - cup and 1-liter bottle
export type ProductSizeType = "cup" | "bottle";

export interface ProductSize {
  id: string;
  type: ProductSizeType;
  name: string;
  volume: string;
  priceModifier: number;
}

// Cart item interface
export interface CartItem {
  id: string;
  productId: string;
  variant: ProductVariant;
  size: ProductSize;
  quantity: number;
  totalPrice: number;
}

// Cart state interface
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
}

// Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  variants: ProductVariant[];
  sizes: ProductSize[];
  category: string;
  image?: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order interface
export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  totalAmount: number;
  customerInfo: CustomerInfo;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
}
