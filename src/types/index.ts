/**
 * Database Types for Supabase - Backend Structure
 */

export type ProductStatus = "available" | "unavailable";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

// Database entity types (directly from Supabase)
export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  is_available: boolean;
  image_url: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  type: string;
  description: string | null;
  price: number;
  sort_order: number;
  created_at: string;
}

export interface ProductSize {
  id: string;
  product_id: string;
  variant_id: string;
  name: string;
  volume: string;
  volume_gr: number;
  price_modifier: number;
  price: number;
  stock_quantity: number;
  type: string;
  sku: string | null;
  created_at: string;
}

// Admin form types (for creating/editing)
export interface ProductFormData {
  name: string;
  description?: string;
  category?: string;
  is_available?: boolean;
  image_url?: string;
  metadata?: Record<string, any>;
  variants?: ProductVariantFormData[];
}

export interface ProductVariantFormData {
  id?: string;
  name: string;
  description?: string;
  sort_order?: number;
  prices?: VariantPriceFormData[];
}

export interface VariantPriceFormData {
  size_gr: number; // 100, 200, 500
  price_modifier: number;
  stock_quantity: number;
  sku?: string;
}

// UI Types (for frontend display and cart)
// These are adapted from database types for the shop page
export interface UIProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  is_available: boolean;
  image_url: string | null;
  variants: UIVariant[];
  basePrice?: number; // For display, calculated from variants
}

export interface UIVariant {
  id: string;
  product_id: string;
  name: string;
  description: string | null;
  sort_order: number;
  sizes: UISize[];
}

export interface UISize {
    id: string;
    variant_id: string;
    name: string;
    volume_gr: number;
    price_modifier: number;
    stock_quantity: number;
    sku: string | null;
}

// Display-only types for mock data (without database fields)
export interface DisplayVariant {
    id: string;
    type: string;
    name: string;
    description: string;
    price: number;
}

export interface DisplaySize {
    id: string;
    type: string;
    name: string;
    volume: string;
    priceModifier: number;
}

// Cart item (matches existing cart structure but with ID references)
export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  sizeId: string;
  quantity: number;
  totalPrice: number;
  // Populated fields (for display)
  variant?: DisplayVariant;
  size?: DisplaySize;
  productName?: string;
  variantName?: string;
  sizeName?: string;
  unitPrice?: number;
}

// Order types
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  total_amount: number;
  status: OrderStatus;
  items: CartItem[]; // Full cart items array
  created_at: string;
  updated_at: string;
}

// Admin auth state
export interface AdminUser {
  id: string;
  email: string;
  user_metadata: {
    role?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Adapter Functions
 * Convert between database format (admin) and UI format (frontend)
 */

export function adaptProductToUI(
  dbProduct: Product,
  dbVariants: ProductVariant[],
  dbSizes: ProductSize[],
): UIProduct {
  // Group sizes by variant
  const variantMap = new Map<string, ProductVariant>();
  dbVariants.forEach((variant) => variantMap.set(variant.id, variant));

  const sizeMap = new Map<string, UISize[]>();
  dbSizes.forEach((size) => {
    const existing = sizeMap.get(size.variant_id) || [];
    sizeMap.set(size.variant_id, [
      ...existing,
      {
        id: size.id,
        variant_id: size.variant_id,
        name: size.name,
        volume_gr: size.volume_gr,
        price_modifier: size.price_modifier,
        stock_quantity: size.stock_quantity,
        sku: size.sku,
      },
    ]);
  });

  const uiVariants: UIVariant[] = dbVariants
    .map((variant) => ({
      id: variant.id,
      product_id: variant.product_id,
      name: variant.name,
      description: variant.description,
      sort_order: variant.sort_order,
      sizes: sizeMap.get(variant.id) || [],
    }))
    .sort((a, b) => a.sort_order - b.sort_order);

  // Calculate base price (lowest price across all variants and sizes)
  let minPrice = Infinity;
  uiVariants.forEach((variant) => {
    variant.sizes.forEach((size) => {
      // Assuming base variant price is 0 for the first variant, other sizes add modifiers
      // In the shop, we might need a base_price field on Product
      const effectivePrice = size.price_modifier;
      if (effectivePrice < minPrice) minPrice = effectivePrice;
    });
  });

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    category: dbProduct.category,
    is_available: dbProduct.is_available,
    image_url: dbProduct.image_url,
    variants: uiVariants,
    basePrice: minPrice === Infinity ? 0 : minPrice,
  };
}

export function adaptCartItemFromUI(
  cartItem: CartItem,
  uiProduct: UIProduct,
  variant: UIVariant,
  size: UISize,
): CartItem {
  const unitPrice =
    variant.sizes.find((s) => s.id === size.id)?.price_modifier || 0;
  return {
    ...cartItem,
    productName: uiProduct.name,
    variantName: variant.name,
    sizeName: size.name,
    unitPrice,
    totalPrice: unitPrice * cartItem.quantity,
  };
}

// Helper to get grind size variants (standard 4)
export const STANDARD_GRIND_SIZES = [
  { name: "Coarse", description: "For French press" },
  { name: "Medium", description: "For drip coffee" },
  { name: "Medium Fine", description: "For pour over" },
  { name: "Fine", description: "For espresso" },
] as const;

// Helper to get standard weights
export const STANDARD_WEIGHTS = [
  { name: "100g", volume_gr: 100 },
  { name: "200g", volume_gr: 200 },
  { name: "500g", volume_gr: 500 },
] as const;

/**
 * Legacy compatibility functions for the existing hardcoded shop page
 * These will be removed once the shop is fully migrated to database
 */
export const LEGACY_PRODUCTS = [
  {
    id: "origin",
    name: "The Origin",
    description:
      "Our signature single-origin beans with notes of chocolate and caramel.",
    variants: [
      {
        id: "origin-espresso",
        type: "espresso",
        name: "Espresso",
        description: "Dark roast for espresso",
        price: 35000,
      },
      {
        id: "origin-latte",
        type: "latte",
        name: "Latte",
        description: "Smooth and creamy",
        price: 38000,
      },
      {
        id: "origin-cappuccino",
        type: "cappuccino",
        name: "Cappuccino",
        description: "Classic Italian",
        price: 40000,
      },
      {
        id: "origin-coldbrew",
        type: "coldbrew",
        name: "Cold Brew",
        description: "Smooth and refreshing",
        price: 42000,
      },
    ],
    sizes: [
      {
        id: "origin-cup",
        type: "cup",
        name: "Cup (250ml)",
        volume: "250ml",
        priceModifier: 0,
      },
      {
        id: "origin-bottle",
        type: "bottle",
        name: "Bottle (1L)",
        volume: "1L",
        priceModifier: 10000,
      },
    ],
    category: "signature",
    isAvailable: true,
  },
  {
    id: "yuzu",
    name: "Yuzu Zest",
    description: "Bright citrus notes with a smooth finish.",
    variants: [
      {
        id: "yuzu-espresso",
        type: "espresso",
        name: "Espresso",
        description: "Citrus-forward espresso",
        price: 38000,
      },
      {
        id: "yuzu-latte",
        type: "latte",
        name: "Latte",
        description: "Citrus and milk",
        price: 41000,
      },
      {
        id: "yuzu-cappuccino",
        type: "cappuccino",
        name: "Cappuccino",
        description: "Light and frothy",
        price: 43000,
      },
      {
        id: "yuzu-coldbrew",
        type: "coldbrew",
        name: "Cold Brew",
        description: "Zesty cold brew",
        price: 45000,
      },
    ],
    sizes: [
      {
        id: "yuzu-cup",
        type: "cup",
        name: "Cup (250ml)",
        volume: "250ml",
        priceModifier: 0,
      },
      {
        id: "yuzu-bottle",
        type: "bottle",
        name: "Bottle (1L)",
        volume: "1L",
        priceModifier: 10000,
      },
    ],
    category: "seasonal",
    isAvailable: true,
  },
  {
    id: "golden",
    name: "Golden Pine",
    description: "Tropical paradise in every sip.",
    variants: [
      {
        id: "golden-espresso",
        type: "espresso",
        name: "Espresso",
        description: "Tropical espresso",
        price: 38000,
      },
      {
        id: "golden-latte",
        type: "latte",
        name: "Latte",
        description: "Pineapple latte",
        price: 41000,
      },
      {
        id: "golden-cappuccino",
        type: "cappuccino",
        name: "Cappuccino",
        description: "Foamy tropical",
        price: 43000,
      },
      {
        id: "golden-coldbrew",
        type: "coldbrew",
        name: "Cold Brew",
        description: "Pine-infused cold brew",
        price: 45000,
      },
    ],
    sizes: [
      {
        id: "golden-cup",
        type: "cup",
        name: "Cup (250ml)",
        volume: "250ml",
        priceModifier: 0,
      },
      {
        id: "golden-bottle",
        type: "bottle",
        name: "Bottle (1L)",
        volume: "1L",
        priceModifier: 10000,
      },
    ],
    category: "seasonal",
    isAvailable: true,
  },
  {
    id: "coco",
    name: "Coco-Luxe",
    description: "Rich chocolate and coconut fusion.",
    variants: [
      {
        id: "coco-espresso",
        type: "espresso",
        name: "Espresso",
        description: "Chocolate espresso",
        price: 40000,
      },
      {
        id: "coco-latte",
        type: "latte",
        name: "Latte",
        description: "Chocolate coconut latte",
        price: 43000,
      },
      {
        id: "coco-cappuccino",
        type: "cappuccino",
        name: "Cappuccino",
        description: "Decadent cappuccino",
        price: 45000,
      },
      {
        id: "coco-coldbrew",
        type: "coldbrew",
        name: "Cold Brew",
        description: "Choco-coconut cold brew",
        price: 47000,
      },
    ],
    sizes: [
      {
        id: "coco-cup",
        type: "cup",
        name: "Cup (250ml)",
        volume: "250ml",
        priceModifier: 0,
      },
      {
        id: "coco-bottle",
        type: "bottle",
        name: "Bottle (1L)",
        volume: "1L",
        priceModifier: 10000,
      },
    ],
    category: "limited",
    isAvailable: true,
  },
];

/**
 * Convert legacy product to UIProduct format
 * This adapter allows the shop page to work with either legacy data or database data
 */
export function adaptLegacyProductToUI(
  legacy: (typeof LEGACY_PRODUCTS)[0],
): UIProduct {
  const variants: UIVariant[] = legacy.variants.map((variant, index) => ({
    id: variant.id,
    product_id: legacy.id,
    name: variant.name,
    description: variant.description,
    sort_order: index,
    sizes: legacy.sizes.map((size) => ({
      id: `${variant.id}-${size.id}`,
      variant_id: variant.id,
      name: size.name,
      volume_gr: parseInt(size.volume.replace(/\D/g, "")) || 250,
      price_modifier: size.priceModifier,
      stock_quantity: 100, // Default stock for legacy
      sku: null,
    })),
  }));

  return {
    id: legacy.id,
    name: legacy.name,
    description: legacy.description,
    category: legacy.category,
    is_available: legacy.isAvailable,
    image_url: null,
    variants,
    basePrice: legacy.variants[0]?.price || 0,
  };
}

/**
 * Format price to IDR currency
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price to USD currency (for reference)
 */
export function formatPriceUSD(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}
