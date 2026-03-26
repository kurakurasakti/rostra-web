"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Mail, MapPin, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Zod schema for contact form validation
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    details: "hello@rostra.coffee",
    description: "We reply within 24 hours",
  },
  {
    icon: Phone,
    title: "Phone",
    details: "+1 (555) 123-4567",
    description: "Mon-Fri, 9am-6pm EST",
  },
  {
    icon: MapPin,
    title: "Location",
    details: "Brooklyn, New York",
    description: "Visit our flagship store",
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      setIsSubmitted(true);
      reset();
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="Contact Rostra"
            fill
            className="object-cover"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/80 via-primary-dark/60 to-primary-dark" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-gold tracking-[0.3em] text-sm font-body uppercase mb-6">
              Get in Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-off-white mb-6 leading-tight"
          >
            Contact <span className="text-gold italic">Us</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-muted max-w-2xl mx-auto font-body"
          >
            Have questions? We'd love to hear from you. Reach out and let's
            connect.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-secondary-dark border border-accent-dark p-8 md:p-12"
            >
              <h2 className="font-display text-3xl md:text-4xl text-off-white mb-2">
                Send a Message
              </h2>
              <p className="text-muted font-body mb-8">
                Fill out the form below and we'll get back to you shortly.
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gold/10 border border-gold/30 rounded-lg p-8 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="font-display text-2xl text-off-white mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-muted font-body">
                    Thank you for reaching out. We'll respond within 24 hours.
                  </p>
                  <Button
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 bg-gold hover:bg-gold-light text-primary-dark"
                  >
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-off-white font-body text-sm mb-2"
                    >
                      Name <span className="text-gold">*</span>
                    </label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      {...register("name")}
                      className={cn(
                        "bg-accent-dark border-accent-dark text-off-white placeholder:text-muted focus:ring-gold focus:border-gold",
                        errors.name &&
                          "border-red-500 focus:ring-red-500 focus:border-red-500",
                      )}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 font-body">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-off-white font-body text-sm mb-2"
                    >
                      Email <span className="text-gold">*</span>
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      {...register("email")}
                      className={cn(
                        "bg-accent-dark border-accent-dark text-off-white placeholder:text-muted focus:ring-gold focus:border-gold",
                        errors.email &&
                          "border-red-500 focus:ring-red-500 focus:border-red-500",
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 font-body">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-off-white font-body text-sm mb-2"
                    >
                      Subject <span className="text-gold">*</span>
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What's this about?"
                      {...register("subject")}
                      className={cn(
                        "bg-accent-dark border-accent-dark text-off-white placeholder:text-muted focus:ring-gold focus:border-gold",
                        errors.subject &&
                          "border-red-500 focus:ring-red-500 focus:border-red-500",
                      )}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1 font-body">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-off-white font-body text-sm mb-2"
                    >
                      Message <span className="text-gold">*</span>
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Tell us what's on your mind..."
                      rows={5}
                      {...register("message")}
                      className={cn(
                        "bg-accent-dark border-accent-dark text-off-white placeholder:text-muted focus:ring-gold focus:border-gold resize-none",
                        errors.message &&
                          "border-red-500 focus:ring-red-500 focus:border-red-500",
                      )}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 font-body">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {submitError && (
                    <p className="text-red-500 text-sm font-body">
                      {submitError}
                    </p>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold-light text-primary-dark font-body font-medium py-6"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-display text-3xl md:text-4xl text-off-white mb-4">
                  Let's <span className="text-gold italic">Connect</span>
                </h2>
                <p className="text-muted font-body text-lg leading-relaxed">
                  Whether you have a question about our products, need
                  recommendations, or want to collaborate, we're here to help.
                </p>
              </div>

              {/* Contact Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-6 bg-secondary-dark border border-accent-dark"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg text-off-white mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gold font-body">{info.details}</p>
                      <p className="text-muted font-body text-sm">
                        {info.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                viewport={{ once: true }}
                className="p-6 bg-secondary-dark border border-accent-dark"
              >
                <h3 className="font-display text-xl text-off-white mb-4">
                  Business Inquiries
                </h3>
                <p className="text-muted font-body leading-relaxed mb-4">
                  For wholesale orders, partnerships, or media inquiries, please
                  email us at{" "}
                  <a
                    href="mailto:partners@rostra.coffee"
                    className="text-gold hover:underline"
                  >
                    partners@rostra.coffee
                  </a>
                </p>
                <p className="text-muted font-body text-sm">
                  We typically respond within 1-2 business days.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
