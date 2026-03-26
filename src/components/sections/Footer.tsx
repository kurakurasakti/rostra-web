"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Globe, ShoppingBag, Send, ArrowRight, Coffee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Zod schema for newsletter subscription
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

const quickLinks = [
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  { name: "Instagram", icon: Globe, href: "https://instagram.com" },
  { name: "Shop", icon: ShoppingBag, href: "https://twitter.com" },
  { name: "Contact", icon: Send, href: "https://facebook.com" },
];

export function Footer() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: NewsletterData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubscribed(true);
    reset();
  };

  return (
    <footer className="bg-secondary-dark border-t border-accent-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="inline-block mb-4">
                <span className="font-display text-3xl font-bold tracking-widest text-off-white">
                  ROSTRA
                </span>
              </Link>
              <p className="text-muted font-body text-sm leading-relaxed mb-6">
                Experience the finest premium coffee with Rostra. Moody,
                high-end aesthetic coffee for the discerning taste.
              </p>
              <div className="flex items-center space-x-2 text-gold">
                <Coffee className="w-5 h-5" />
                <span className="text-sm font-body">
                  Premium Coffee Experience
                </span>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-lg font-semibold text-off-white mb-6">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-gold transition-colors duration-300 font-body text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Social Media */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-lg font-semibold text-off-white mb-6">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-accent-dark flex items-center justify-center text-muted hover:text-gold hover:bg-accent-dark/80 transition-colors duration-300"
                    aria-label={social.name}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-lg font-semibold text-off-white mb-6">
                Newsletter
              </h3>
              <p className="text-muted font-body text-sm mb-4">
                Subscribe to receive updates on new blends and exclusive offers.
              </p>

              {isSubscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/10 border border-gold/30 rounded-lg p-4"
                >
                  <p className="text-gold font-body text-sm">
                    Thank you for subscribing! Check your inbox for a welcome
                    gift.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="bg-accent-dark border-accent-dark text-off-white placeholder:text-muted focus:ring-gold focus:border-gold"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gold hover:bg-gold-light text-primary-dark font-body font-medium px-6"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center">
                          <span className="w-4 h-4 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin mr-2" />
                          Subs...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Subscribe
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </span>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted font-body">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="py-6 border-t border-accent-dark">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted font-body text-sm">
              © {new Date().getFullYear()} Rostra. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="text-muted hover:text-gold transition-colors duration-300 font-body text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted hover:text-gold transition-colors duration-300 font-body text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
