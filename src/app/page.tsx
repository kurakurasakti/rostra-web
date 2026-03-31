"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";
import type { DisplayVariant, DisplaySize } from "@/types";
import homeBG from "../../public/hero-bg.webp";

// Product data for the 4 signature Cold Brew variants
const coldBrewVariants: DisplayVariant[] = [
  {
    id: "origin",
    type: "coldbrew",
    name: "The Origin",
    description: "Classic cold brew with notes of rich chocolate and caramel",
    price: 28,
  },
  {
    id: "yuzu",
    type: "coldbrew",
    name: "Yuzu Zest",
    description: "Bright citrus notes from premium yuzu extract",
    price: 32,
  },
  {
    id: "pineapple",
    type: "coldbrew",
    name: "Golden Pine",
    description: "Tropical pineapple-infused cold brew perfection",
    price: 34,
  },
  {
    id: "coconut",
    type: "coldbrew",
    name: "Coco-Luxe",
    description: "Creamy coconut milk blended with smooth cold brew",
    price: 36,
  },
];

const productSizes: DisplaySize[] = [
  { id: "cup", type: "cup", name: "Cup", volume: "250ml", priceModifier: 0 },
  {
    id: "bottle",
    type: "bottle",
    name: "Bottle",
    volume: "1L",
    priceModifier: 12,
  },
];

// Animation variants - define without transition to avoid type issues
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const fadeInItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

// Section wrapper for scroll animations
function AnimatedSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Product Card Component
function ProductCard({
  variant,
  index,
}: {
  variant: DisplayVariant;
  index: number;
}) {
  const [selectedSize, setSelectedSize] = useState<DisplaySize>(
    productSizes[0],
  );
  const { addToCart, setIsOpen } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: `${variant.id}-${selectedSize.id}`,
      productId: variant.id,
      variant,
      size: selectedSize,
      quantity: 1,
    });
    setIsOpen(true);
  };

  return (
    <motion.div variants={fadeInItem} className="group">
      <Card className="bg-secondary-dark border-accent-dark overflow-hidden hover:border-gold/50 transition-colors duration-500">
        <CardContent className="p-0">
          {/* Product Image Placeholder */}
          <div className="relative aspect-square bg-accent-dark/30 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gold/20 to-transparent" />
            </div>
            <div className="absolute bottom-4 left-4">
              <span className="text-xs tracking-widest text-gold uppercase font-body">
                Cold Brew
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="font-display text-xl text-off-white mb-2">
                {variant.name}
              </h3>
              <p className="text-muted text-sm font-body leading-relaxed">
                {variant.description}
              </p>
            </div>

            {/* Size Selector */}
            <div className="flex gap-2">
              {productSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "flex-1 py-2 px-3 text-sm font-body transition-all duration-300 border",
                    selectedSize.id === size.id
                      ? "border-gold text-gold bg-gold/10"
                      : "border-accent-dark text-muted hover:border-gold/50 hover:text-off-white",
                  )}
                >
                  <span className="block">{size.name}</span>
                  <span className="block text-xs opacity-70">
                    {size.volume}
                  </span>
                </button>
              ))}
            </div>

            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-lg font-display text-off-white">
                  ${variant.price + selectedSize.priceModifier}
                </span>
              </div>
              <Button
                onClick={handleAddToCart}
                className="bg-gold hover:bg-gold-light text-primary-dark font-body text-sm px-4 py-2"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Home() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={homeBG}
            alt="Cold brew coffee background"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              // Fallback to gradient if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/70 via-primary-dark/50 to-primary-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/40 via-transparent to-primary-dark/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-gold tracking-[0.3em] text-sm font-body uppercase mb-6">
              Premium Cold Brew
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6 leading-tight"
          >
            The Art of <span className="text-gold italic">Cold Brew</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 font-body"
          >
            Crafted with precision, aged for depth, and brewed to perfection.
            Experience the pinnacle of artisanal coffee craftsmanship.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <Link href="#featured">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold-light text-primary-dark font-body text-base px-8 py-6 tracking-wide"
              >
                Explore Collection
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-off-white/30 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-gold rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* The Rostra Story Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-primary-dark">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Text Content */}
              <div className="order-2 lg:order-1 space-y-8">
                <motion.div variants={staggerContainer} className="space-y-6">
                  <motion.span
                    variants={fadeInItem}
                    className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                  >
                    Our Story
                  </motion.span>
                  <motion.h2
                    variants={fadeInItem}
                    className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white leading-tight"
                  >
                    Crafted by{" "}
                    <span className="text-gold italic">Tradition</span>
                  </motion.h2>
                  <motion.div className="space-y-4">
                    <motion.p
                      variants={fadeInItem}
                      className="text-muted text-lg font-body leading-relaxed"
                    >
                      Born from a obsession with perfection, Rostra represents
                      the pinnacle of cold brew craftsmanship. Our journey began
                      with a simple belief: that exceptional coffee deserves
                      exceptional preparation.
                    </motion.p>
                    <motion.p
                      variants={fadeInItem}
                      className="text-muted text-lg font-body leading-relaxed"
                    >
                      Each batch is carefully sourced from single-origin farms,
                      slow-steeped for 24 hours, and crafted with meticulous
                      attention to detail. The result is a smooth, rich, and
                      complex flavor profile that defines the art of cold brew.
                    </motion.p>
                    <motion.p
                      variants={fadeInItem}
                      className="text-off-white font-body text-lg leading-relaxed"
                    >
                      We don't just make coffee. We create experiences that
                      linger on your palate and stay in your memory.
                    </motion.p>
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeInItem} className="pt-4">
                  <div className="flex gap-8 md:gap-12">
                    <div className="text-center">
                      <span className="block font-display text-3xl md:text-4xl text-gold">
                        24h
                      </span>
                      <span className="text-muted text-sm font-body uppercase tracking-wider">
                        Steep Time
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-3xl md:text-4xl text-gold">
                        100%
                      </span>
                      <span className="text-muted text-sm font-body uppercase tracking-wider">
                        Arabica
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="block font-display text-3xl md:text-4xl text-gold">
                        12°
                      </span>
                      <span className="text-muted text-sm font-body uppercase tracking-wider">
                        Cold Brew
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Image Placeholder */}
              <div className="order-1 lg:order-2">
                <motion.div
                  variants={fadeInUp}
                  className="relative aspect-[4/5] bg-secondary-dark border border-accent-dark overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-40 h-40 mx-auto mb-6 rounded-full border border-gold/30 flex items-center justify-center">
                        <span className="font-display text-4xl text-gold italic">
                          R
                        </span>
                      </div>
                      <span className="text-muted font-body text-sm tracking-widest uppercase">
                        Est. 2024
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Featured Variants Section */}
      <section
        id="featured"
        className="py-32 px-4 md:px-8 lg:px-16 bg-secondary-dark"
      >
        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <motion.div variants={staggerContainer}>
                <motion.span
                  variants={fadeInItem}
                  className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                >
                  Signature Collection
                </motion.span>
                <motion.h2
                  variants={fadeInItem}
                  className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-4 mb-6"
                >
                  Featured <span className="text-gold italic">Variants</span>
                </motion.h2>
                <motion.p
                  variants={fadeInItem}
                  className="text-muted text-lg font-body max-w-2xl mx-auto"
                >
                  Discover our four signature cold brew expressions, each
                  crafted to deliver a unique and unforgettable taste journey.
                </motion.p>
              </motion.div>
            </div>

            {/* Product Grid */}
            <motion.div
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            >
              {coldBrewVariants.map((variant, index) => (
                <ProductCard key={variant.id} variant={variant} index={index} />
              ))}
            </motion.div>

            {/* View All Link */}
            <motion.div variants={fadeInItem} className="text-center mt-16">
              <Link href="/shop">
                <Button
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold hover:text-primary-dark font-body px-8 py-3"
                >
                  View Full Collection
                </Button>
              </Link>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
