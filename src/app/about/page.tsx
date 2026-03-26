"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import homeBG from "../../../public/hero-bg.webp";

// Animation variants
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

// Staggered text component
function StaggeredText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Section data
const craftContent = {
  title: "The Craft",
  subtitle: "Cold Brew, Perfected",
  description: [
    "Our cold brew is not merely coffee—it's a meditation in patience. Each batch begins with carefully selected beans, roasted to our exacting specifications and ground to the precise coarseness that unlocks their full potential.",
    "We steep our grounds in cold, filtered water for a full 24 hours, allowing the slow extraction process to draw out the complex flavors without the bitterness that heat can introduce. The result is a smooth, rich concentrate that forms the foundation of every Rostra creation.",
    "This isn't mass production. It's artisanal dedication to a craft we've spent years perfecting.",
  ],
  stats: [
    { value: "24", unit: "Hours", label: "Steep Time" },
    { value: "18", unit: "°C", label: "Optimal Temp" },
    { value: "12", unit: "Days", label: "Aging Process" },
  ],
};

const philosophyContent = {
  title: "Our Philosophy",
  subtitle: "Quality Without Compromise",
  description: [
    "At Rostra, we believe that exceptional coffee shouldn't be a luxury—it's a right. Every cup we serve represents our unwavering commitment to quality, from bean to bottle.",
    "We reject the notion that convenience must come at the expense of craftsmanship. Our slow-steeped process takes time, but time is what transforms good coffee into extraordinary coffee.",
    "Quality isn't just a standard we maintain; it's a promise we keep with every batch, every pour, every sip.",
  ],
};

const sourcingContent = {
  title: "Sourcing",
  subtitle: "From Farm to Cup",
  description: [
    "Great cold brew begins with great beans. We source our Arabica beans from select high-altitude farms where the cool climate and rich soil create ideal growing conditions.",
    "Our partnerships with these farms aren't transactional—they're collaborative. We work directly with growers to ensure sustainable practices, fair wages, and the highest quality standards.",
    "Every bean is hand-selected, ethically traded, and traceable back to its origin. This isn't just transparency—it's our promise to you.",
  ],
  regions: [
    { name: "Ethiopia", notes: "Floral & Citrus" },
    { name: "Colombia", notes: "Caramel & Nut" },
    { name: "Brazil", notes: "Chocolate & Earth" },
    { name: "Guatemala", notes: "Spice & Balance" },
  ],
};

const variantsContent = {
  title: "The Variants",
  subtitle: "Four Signatures",
  description: [
    "Our signature collection represents the pinnacle of cold brew innovation. Four distinct expressions, each crafted to deliver a unique taste journey while maintaining the smooth, rich character that defines Rostra.",
    "From the classic elegance of The Origin to the tropical indulgence of Golden Pine, each variant showcases our dedication to flavor innovation.",
  ],
  variants: [
    {
      name: "The Origin",
      description:
        "Our signature cold brew—classic, timeless, pure. Notes of rich chocolate and caramel with a smooth, velvety finish.",
      notes: ["Dark Chocolate", "Caramel", "Vanilla"],
    },
    {
      name: "Yuzu Zest",
      description:
        "Bright, bold, and beautifully balanced. Premium Japanese yuzu adds citrus brightness to our smooth cold brew base.",
      notes: ["Yuzu Citrus", "Honey", "White Tea"],
    },
    {
      name: "Golden Pine",
      description:
        "Tropical paradise in a bottle. Sweet pineapple meets cold brew for an unexpected, refreshing twist.",
      notes: ["Tropical Pineapple", "Coconut", "Agave"],
    },
    {
      name: "Coco-Luxe",
      description:
        "Indulgent and creamy. silky coconut milk blends seamlessly with our signature cold brew for pure luxury.",
      notes: ["Coconut Cream", "Toasted Almond", "Brown Sugar"],
    },
  ],
};

export default function AboutPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
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
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/50 via-transparent to-primary-dark/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="inline-block text-gold tracking-[0.3em] text-sm font-body uppercase mb-6">
              Rostra
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6 leading-tight"
          >
            Our <span className="text-gold italic">Story</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-body"
          >
            The journey of crafting the perfect cold brew, from bean to bottle.
          </motion.p>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHeroInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
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

      {/* The Craft Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-primary-dark">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Section Header */}
              <div className="lg:col-span-4">
                <StaggeredText>
                  <motion.span
                    variants={fadeInItem}
                    className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                  >
                    {craftContent.title}
                  </motion.span>
                  <motion.h2
                    variants={fadeInItem}
                    className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-4 mb-6 leading-tight"
                  >
                    {craftContent.subtitle}
                  </motion.h2>
                </StaggeredText>
              </div>

              {/* Content */}
              <div className="lg:col-span-8">
                <StaggeredText className="space-y-8">
                  {craftContent.description.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      variants={fadeInItem}
                      className="text-muted text-lg font-body leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </StaggeredText>

                {/* Stats */}
                <motion.div
                  variants={fadeInItem}
                  className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-accent-dark"
                >
                  {craftContent.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <span className="block font-display text-4xl md:text-5xl text-gold">
                        {stat.value}
                        <span className="text-2xl ml-1">{stat.unit}</span>
                      </span>
                      <span className="text-muted text-sm font-body uppercase tracking-wider mt-2 block">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-secondary-dark">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              {/* Image Placeholder */}
              <motion.div
                variants={fadeInUp}
                className="relative aspect-[4/5] bg-accent-dark/30 border border-accent-dark overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 rounded-full border border-gold/30 flex items-center justify-center">
                      <span className="font-display text-5xl text-gold italic">
                        R
                      </span>
                    </div>
                    <span className="text-muted font-body text-sm tracking-widest uppercase">
                      Est. 2024
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="space-y-8">
                <StaggeredText>
                  <motion.span
                    variants={fadeInItem}
                    className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                  >
                    {philosophyContent.title}
                  </motion.span>
                  <motion.h2
                    variants={fadeInItem}
                    className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-4 mb-8 leading-tight"
                  >
                    {philosophyContent.subtitle}
                  </motion.h2>
                </StaggeredText>

                <StaggeredText className="space-y-6">
                  {philosophyContent.description.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      variants={fadeInItem}
                      className="text-muted text-lg font-body leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </StaggeredText>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Sourcing Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-primary-dark">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
              {/* Section Header */}
              <div className="lg:col-span-5">
                <StaggeredText>
                  <motion.span
                    variants={fadeInItem}
                    className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                  >
                    {sourcingContent.title}
                  </motion.span>
                  <motion.h2
                    variants={fadeInItem}
                    className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-4 mb-6 leading-tight"
                  >
                    {sourcingContent.subtitle}
                  </motion.h2>
                </StaggeredText>
              </div>

              {/* Content */}
              <div className="lg:col-span-7">
                <StaggeredText className="space-y-8">
                  {sourcingContent.description.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      variants={fadeInItem}
                      className="text-muted text-lg font-body leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </StaggeredText>

                {/* Regions */}
                <motion.div
                  variants={fadeInItem}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
                >
                  {sourcingContent.regions.map((region, index) => (
                    <div
                      key={index}
                      className="p-4 bg-secondary-dark border border-accent-dark text-center hover:border-gold/50 transition-colors duration-300"
                    >
                      <span className="block font-display text-lg text-off-white">
                        {region.name}
                      </span>
                      <span className="text-muted text-sm font-body">
                        {region.notes}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* The Variants Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-secondary-dark">
        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-20">
              <StaggeredText>
                <motion.span
                  variants={fadeInItem}
                  className="text-gold tracking-[0.2em] text-sm font-body uppercase"
                >
                  {variantsContent.title}
                </motion.span>
                <motion.h2
                  variants={fadeInItem}
                  className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-4 mb-6"
                >
                  {variantsContent.subtitle}
                </motion.h2>
                <motion.p
                  variants={fadeInItem}
                  className="text-muted text-lg font-body max-w-2xl mx-auto"
                >
                  {variantsContent.description[0]}
                </motion.p>
              </StaggeredText>
            </div>

            {/* Variants Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {variantsContent.variants.map((variant, index) => (
                <motion.div
                  key={index}
                  variants={fadeInItem}
                  className="group p-8 bg-primary-dark border border-accent-dark hover:border-gold/50 transition-all duration-500"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl text-off-white mb-2">
                        {variant.name}
                      </h3>
                      <p className="text-muted font-body leading-relaxed">
                        {variant.description}
                      </p>
                    </div>
                    <div className="hidden md:block w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center flex-shrink-0 ml-4">
                      <span className="font-display text-xl text-gold italic">
                        {index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Flavor Notes */}
                  <div className="flex flex-wrap gap-2">
                    {variant.notes.map((note, noteIndex) => (
                      <span
                        key={noteIndex}
                        className="px-3 py-1 text-xs font-body tracking-wider text-gold bg-gold/10 border border-gold/20"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 bg-primary-dark">
        <AnimatedSection>
          <div className="max-w-3xl mx-auto text-center">
            <motion.div variants={staggerContainer}>
              <motion.span
                variants={fadeInItem}
                className="text-gold tracking-[0.2em] text-sm font-body uppercase"
              >
                Experience Rostra
              </motion.span>
              <motion.h2
                variants={fadeInItem}
                className="font-display text-4xl md:text-5xl lg:text-6xl text-off-white mt-6 mb-8"
              >
                Taste the <span className="text-gold italic">Difference</span>
              </motion.h2>
              <motion.p
                variants={fadeInItem}
                className="text-muted text-lg font-body leading-relaxed mb-12"
              >
                Now that you know our story, we invite you to experience it
                firsthand. Explore our signature collection and discover why
                Rostra is more than coffee—it's a craft.
              </motion.p>
              <motion.div variants={fadeInItem}>
                <a
                  href="/shop"
                  className="inline-block bg-gold hover:bg-gold-light text-primary-dark font-body text-base px-10 py-4 tracking-wide transition-colors duration-300"
                >
                  Shop Collection
                </a>
              </motion.div>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
