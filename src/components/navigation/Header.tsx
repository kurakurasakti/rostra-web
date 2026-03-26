"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { CartSheet } from "@/components/cart/CartSheet";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { cartItemCount } = useCart();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        isScrolled
          ? "bg-primary-dark/95 backdrop-blur-md border-b border-accent-dark"
          : "bg-transparent",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          {/* TODO: Add original Logo Rostra with SVG */}
          <Link href="/" className="flex-shrink-0 group">
            <motion.span
              className="font-display text-2xl font-bold tracking-widest text-off-white group-hover:text-gold transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              ROSTRA
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-off-white/80 hover:text-gold transition-colors duration-300 font-body text-sm tracking-wide uppercase"
              >
                <motion.span whileHover={{ y: -2 }} className="relative">
                  {item.name}
                  <motion.span
                    className="absolute -bottom-1 left-0 h-px bg-gold"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <CartSheet />

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-off-white hover:text-gold hover:bg-accent-dark/50"
                >
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:w-[400px] bg-secondary-dark border-l border-accent-dark"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Logo */}
                  <div className="flex items-center justify-between py-6 border-b border-accent-dark">
                    <span className="font-display text-xl font-bold tracking-widest text-off-white">
                      ROSTRA
                    </span>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-off-white/80 hover:text-gold"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 py-8">
                    <ul className="space-y-6">
                      {navigation.map((item, index) => (
                        <motion.li
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className="block text-2xl font-display text-off-white hover:text-gold transition-colors duration-300"
                            >
                              {item.name}
                            </Link>
                          </SheetClose>
                        </motion.li>
                      ))}
                      <motion.li
                        key="cart-mobile"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: navigation.length * 0.1 }}
                      >
                        <SheetClose asChild>
                          <Link
                            href="/cart"
                            className="block text-2xl font-display text-off-white hover:text-gold transition-colors duration-300"
                          >
                            Cart ({cartItemCount})
                          </Link>
                        </SheetClose>
                      </motion.li>
                    </ul>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="py-6 border-t border-accent-dark">
                    <p className="text-sm text-muted font-body">
                      Premium Coffee Experience
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}

export default Header;
