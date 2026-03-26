"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "./CartProvider";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const {
    items,
    cartTotal,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-secondary-dark border-l border-accent-dark">
        <SheetHeader className="border-b border-accent-dark pb-4">
          <SheetTitle className="text-off-white font-display text-xl tracking-wide">
            Your Cart ({cartItemCount})
          </SheetTitle>
        </SheetHeader>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full text-center px-4"
              >
                <div className="w-20 h-20 rounded-full bg-accent-dark/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-10 h-10 text-muted" />
                </div>
                <p className="text-off-white font-body text-lg mb-2">
                  Your cart is empty
                </p>
                <p className="text-muted text-sm">
                  Add some premium coffee to get started
                </p>
              </motion.div>
            ) : (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 p-4 bg-primary-dark/50 rounded-lg border border-accent-dark/50"
                  >
                    {/* Product Image Placeholder */}
                    <div className="w-20 h-20 bg-accent-dark rounded-md flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs font-medium">
                        {item.variant.type.toUpperCase()}
                      </span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-off-white font-body text-sm font-medium truncate">
                            {item.variant.name}
                          </h4>
                          <p className="text-muted text-xs mt-1">
                            {item.size.name} • {item.size.volume}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted hover:text-destructive transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-md bg-accent-dark hover:bg-accent-dark/80 flex items-center justify-center text-off-white/80 hover:text-off-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-off-white font-body text-sm w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-md bg-accent-dark hover:bg-accent-dark/80 flex items-center justify-center text-off-white/80 hover:text-off-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-gold font-body text-sm font-medium">
                          {formatPrice(item.totalPrice)}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-accent-dark pt-4 flex-col gap-4">
            {/* Clear Cart */}
            <div className="flex justify-center">
              <button
                onClick={clearCart}
                className="text-muted text-sm hover:text-destructive transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-off-white/80 font-body text-sm">
                Subtotal
              </span>
              <span className="text-gold font-display text-xl font-semibold">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <p className="text-muted text-xs text-center">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <Button
              className={cn(
                "w-full bg-gold hover:bg-gold-light text-primary-dark font-body font-medium py-3",
                "transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              Proceed to Checkout
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
