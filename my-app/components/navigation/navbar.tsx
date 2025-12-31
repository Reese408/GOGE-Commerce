"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

const shopCategories = [
  { href: "/shop/t-shirts", label: "T-Shirts", icon: "👕" },
  { href: "/shop/hoodies", label: "Hoodies", icon: "🧥" },
  { href: "/shop/sweatshirts", label: "Sweatshirts", icon: "👚" },
  { href: "/shop/accessories", label: "Accessories", icon: "🎒" },
  { href: "/shop/stickers", label: "Stickers", icon: "✨" },
  { href: "/shop", label: "View All", icon: "🛍️" },
];

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
          >
            {link.label}
          </Link>
        ))}

        {/* Shop Mega Menu */}
        <div className="relative group">
          <Link
            href="/shop"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
          >
            Shop
          </Link>

          {/* Invisible bridge to keep menu open */}
          <div className="absolute left-0 right-0 h-6 top-full" />

          {/* Mega Menu Dropdown */}
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-screen max-w-4xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="grid grid-cols-3 gap-8 p-8">
                {/* Categories Column */}
                <div className="col-span-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                    Shop by Category
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {shopCategories.slice(0, -1).map((category) => (
                      <Link
                        key={category.href}
                        href={category.href}
                        className="group/item flex items-start gap-4 p-4 rounded-lg hover:bg-[#927194]/5 dark:hover:bg-[#D08F90]/5 transition-all"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 rounded-lg flex items-center justify-center text-2xl group-hover/item:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white group-hover/item:text-[#927194] dark:group-hover/item:text-[#D08F90] transition-colors">
                            {category.label}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Shop now
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Featured/CTA Column */}
                <div className="bg-gradient-to-br from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 dark:from-[#927194]/20 dark:via-[#D08F90]/20 dark:to-[#A0B094]/20 rounded-xl p-6 flex flex-col">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                    Featured
                  </h3>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                        New Arrivals
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Check out our latest faith-inspired designs
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="inline-flex items-center justify-center px-6 py-3 bg-[#927194] hover:bg-[#927194]/90 text-white rounded-lg font-semibold transition-all hover:scale-105"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/collections"
          className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
        >
          Collections
        </Link>
      </nav>

      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 lg:hidden border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Shop Dropdown in Mobile */}
            <div>
              <button
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 rounded-lg transition-colors"
              >
                Shop
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    mobileShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Shop Categories Dropdown */}
              {mobileShopOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  {shopCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileShopOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 rounded-lg transition-colors"
                    >
                      <span className="text-xl">{category.icon}</span>
                      {category.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10 rounded-lg transition-colors"
            >
              Collections
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}