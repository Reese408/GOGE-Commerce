"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/shop" },
    { label: "T-Shirts", href: "/shop/t-shirts" },
    { label: "Hoodies", href: "/shop/hoodies" },
    { label: "Accessories", href: "/shop/accessories" },
    { label: "Stickers", href: "/shop/stickers" },
  ],
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Meet Amanda", href: "/about#founder" },
    { label: "Mission & Values", href: "/about#mission" },
  ],
  support: [
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "Contact Us", href: "mailto:support@graceongoing.com" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/grace.ongoing/", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com/graceongoing", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/graceongoing", label: "Twitter" },
];

export function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-t border-gray-200 dark:border-zinc-800">
      <div className="container mx-auto px-6 sm:px-8 py-12 lg:py-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Link
              href="/"
              className="inline-block text-2xl font-bold bg-gradient-to-r from-[#927194] via-[#D08F90] to-[#A0B094] bg-clip-text text-transparent mb-4"
            >
              Grace, Ongoing
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
              Spreading faith, love, and positive messages through handmade designs.
              Every piece is crafted with purpose to inspire and encourage believers
              in their daily walk with Christ.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Shop Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Shop
            </h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* About Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              About
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                © {new Date().getFullYear()} Grace, Ongoing LLC. Made with{" "}
                <Heart size={14} className="text-[#D08F90] fill-current" /> by Amanda Kolar
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                App powered by Shopify
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
