"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/about", label: "About" },
];

const shopCategories = [
  {
    href: "/shop?category=shirts",
    label: "Shirts",
    color: "from-[#D08F90] to-[#927194]",
    description: "Faith-inspired tees & tops"
  },
  {
    href: "/shop?category=sweatshirts",
    label: "Sweatshirts",
    color: "from-[#927194] to-[#A0B094]",
    description: "Cozy hoodies & crewnecks"
  },
  {
    href: "/shop?category=accessories",
    label: "Accessories",
    color: "from-[#A0B094] to-[#D08F90]",
    description: "Stickers, buttons & more"
  },
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
          <div className="absolute left-1/2 -translate-x-1/2 top-full pt-6 w-screen max-w-3xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none group-hover:pointer-events-auto">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                  Shop by Category
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {shopCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      className="group/item relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      {/* Gradient Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover/item:opacity-100 transition-opacity`}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <p className="font-bold text-white mb-1">
                          {category.label}
                        </p>
                        <p className="text-xs text-white/90 font-medium">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <Link
                  href="/shop?category=all"
                  className="mt-4 block text-center px-6 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-[#927194] dark:hover:bg-[#927194] text-gray-700 dark:text-gray-300 hover:text-white rounded-lg font-semibold transition-all"
                >
                  View All Products
                </Link>
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
                <div className="ml-2 mt-2 space-y-2">
                  {shopCategories.map((category) => (
                    <Link
                      key={category.href}
                      href={category.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileShopOpen(false);
                      }}
                      className="relative overflow-hidden block rounded-xl p-4 transition-all duration-300 hover:scale-102"
                    >
                      {/* Gradient Background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90`}
                      />

                      {/* Content */}
                      <div className="relative z-10">
                        <p className="font-bold text-white text-sm mb-0.5">
                          {category.label}
                        </p>
                        <p className="text-xs text-white/90">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  ))}

                  {/* View All Link */}
                  <Link
                    href="/shop?category=all"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setMobileShopOpen(false);
                    }}
                    className="block text-center px-4 py-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold text-sm transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700"
                  >
                    View All Products
                  </Link>
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