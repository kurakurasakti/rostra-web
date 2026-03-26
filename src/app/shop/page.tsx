"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/useCart";
import type { ProductVariant, ProductSize } from "@/types";

// Product data - 4 signature cold brew variants
const PRODUCT_VARIANTS: ProductVariant[] = [
  {
    id: "origin",
    type: "coldbrew",
    name: "The Origin",
    description:
      "Our signature classic cold brew. Smooth, bold, and impossibly refreshing.",
    price: 35000,
  },
  {
    id: "yuzu-zest",
    type: "coldbrew",
    name: "Yuzu Zest",
    description:
      "Bright citrus notes meet smooth cold brew. A refreshing twist.",
    price: 38000,
  },
  {
    id: "golden-pine",
    type: "coldbrew",
    name: "Golden Pine",
    description:
      "Tropical pineapple infusion with a golden glow. Summer in a bottle.",
    price: 38000,
  },
  {
    id: "coco-luxe",
    type: "coldbrew",
    name: "Coco-Luxe",
    description:
      "Velvety coconut blended with cold brew. Pure tropical indulgence.",
    price: 40000,
  },
];

// Product sizes
const PRODUCT_SIZES: ProductSize[] = [
  {
    id: "cup",
    type: "cup",
    name: "Cup",
    volume: "250ml",
    priceModifier: 0,
  },
  {
    id: "bottle",
    type: "bottle",
    name: "Bottle",
    volume: "1L",
    priceModifier: 45000,
  },
];

// Filter type
type FilterType = "all" | "cups" | "bottles";

// Format price to IDR
function formatIDR(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

// Product card component
interface ProductCardProps {
  variant: ProductVariant;
  size: ProductSize;
  onSizeChange: (variantId: string, size: ProductSize) => void;
  selectedSize: ProductSize;
}

function ProductCard({
  variant,
  size,
  selectedSize,
  onSizeChange,
}: ProductCardProps) {
  const { addToCart, setIsOpen } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const totalPrice = variant.price + selectedSize.priceModifier;

  const handleAddToCart = useCallback(() => {
    setIsAdding(true);

    addToCart({
      id: `${variant.id}-${selectedSize.id}-${Date.now()}`,
      productId: `coldbrew-${variant.id}`,
      variant,
      size: selectedSize,
      quantity: 1,
    });

    // Open cart and reset feedback after short delay
    setTimeout(() => {
      setIsAdding(false);
      setIsOpen(true);
    }, 300);
  }, [addToCart, setIsOpen, variant, selectedSize]);

  return (
    <motion.div variants={itemVariants}>
      <Card className="group h-full overflow-hidden border-accent-dark/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5">
        <CardContent className="p-4">
          {/* Product Image Placeholder */}
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-secondary-dark/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {selectedSize.type === "cup" ? "☕" : "🫙"}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">
                  {variant.name}
                </div>
              </div>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h3 className="font-display text-lg font-semibold text-foreground">
              {variant.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {variant.description}
            </p>

            {/* Size Selector */}
            <div className="flex gap-2 pt-2">
              {PRODUCT_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSizeChange(variant.id, s)}
                  className={`flex-1 rounded-md px-3 py-2 text-xs font-medium transition-all duration-200 ${
                    selectedSize.id === s.id
                      ? "bg-gold text-primary-dark"
                      : "bg-accent-dark/50 text-muted-foreground hover:bg-accent-dark hover:text-foreground"
                  }`}
                >
                  <span className="block">{s.name}</span>
                  <span className="block text-[10px] opacity-75">
                    {s.volume}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 p-4 pt-0">
          <div className="flex items-center justify-between w-full">
            <span className="font-display text-xl font-semibold text-gold">
              {formatIDR(totalPrice)}
            </span>
            <span className="text-xs text-muted-foreground">
              {selectedSize.name}
            </span>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full transition-all duration-200 ${
              isAdding
                ? "bg-green-600 hover:bg-green-600"
                : "bg-gold text-primary-dark hover:bg-gold-light"
            }`}
          >
            {isAdding ? "Added! ✓" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Main Shop Page component
export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedSizes, setSelectedSizes] = useState<
    Record<string, ProductSize>
  >({});

  // Initialize sizes for all variants
  const getSelectedSize = (variantId: string): ProductSize => {
    if (!selectedSizes[variantId]) {
      // Default to cup
      setSelectedSizes((prev) => ({
        ...prev,
        [variantId]: PRODUCT_SIZES[0],
      }));
      return PRODUCT_SIZES[0];
    }
    return selectedSizes[variantId];
  };

  const handleSizeChange = useCallback(
    (variantId: string, size: ProductSize) => {
      setSelectedSizes((prev) => ({
        ...prev,
        [variantId]: size,
      }));
    },
    [],
  );

  // Filter products based on active filter
  const filteredProducts = PRODUCT_VARIANTS.filter((variant) => {
    if (activeFilter === "all") return true;
    // For now, all variants are available in both sizes
    // In a real app, you might have different variants for different sizes
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Shop All
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Discover our signature cold brew collection. Crafted with
              precision, served with passion.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-16 z-40 border-b border-accent-dark/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {(["all", "cups", "bottles"] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative rounded-full px-6 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter
                    ? "text-primary-dark"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 rounded-full bg-gold"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 capitalize">{filter}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((variant) => (
              <ProductCard
                key={variant.id}
                variant={variant}
                size={getSelectedSize(variant.id)}
                selectedSize={getSelectedSize(variant.id)}
                onSizeChange={handleSizeChange}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">
              No products found in this category.
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
