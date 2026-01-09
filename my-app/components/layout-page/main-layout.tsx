"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/navigation/navbar";
import { useCartStore } from "@/lib/store/cart-store";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { QueryProvider } from "@/lib/providers/query-provider";
import { Footer } from "@/components/layout-page/footer";
import { Search } from "lucide-react";
import { LOGO_URL } from "@/lib/config";

// Lazy load heavy components for better performance
const SearchDropdown = lazy(() =>
  import("@/components/search/search-dropdown").then(module => ({
    default: module.SearchDropdown
  }))
);

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { totalItems, toggleCart } = useCartStore();
  const itemCount = totalItems();
  const [logoError, setLogoError] = useState(false);


  return (
    <QueryProvider>
      {/* Navbar - appears on all pages */}
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
           <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {!logoError ? (
              <Image
                src={LOGO_URL}
                alt="Grace, Ongoing - Faith-inspired apparel and accessories"
                width={360}
                height={120}
                priority
                onError={() => setLogoError(true)}
                className="h-14 lg:h-19 w-auto object-contain"
              />
            ) : (
              <span className="text-xl lg:text-2xl font-bold bg-linear-to-r from-[#927194] via-[#D08F90] to-[#A0B094] bg-clip-text text-transparent">
                Grace, Ongoing
              </span>
            )}
          </Link>


            {/* Navigation Links */}
            <NavBar />

            {/* Search - Desktop */}
            <div className="hidden lg:block flex-1 max-w-md mx-8">
              <Suspense fallback={
                <div className="relative w-full">
                  <div className="flex items-center ring-1 ring-gray-300 dark:ring-zinc-700 rounded-full overflow-hidden bg-white dark:bg-zinc-800 px-4 py-2.5">
                    <Search className="text-gray-400 dark:text-zinc-500 mr-3" size={18} />
                    <span className="text-sm text-gray-400 dark:text-zinc-500">Search products...</span>
                  </div>
                </div>
              }>
                <SearchDropdown />
              </Suspense>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <ModeToggle />

              {/* Cart Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCart}
                className="relative hover:bg-[#927194]/10 dark:hover:bg-[#D08F90]/10"
                aria-label="Shopping cart"
              >
                <ShoppingBag size={20} />
                {/* Cart count badge */}
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#D08F90] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="lg:hidden pb-4">
            <Suspense fallback={
              <div className="relative w-full">
                <div className="flex items-center ring-1 ring-gray-300 dark:ring-zinc-700 rounded-full overflow-hidden bg-white dark:bg-zinc-800 px-4 py-2.5">
                  <Search className="text-gray-400 dark:text-zinc-500 mr-3" size={18} />
                  <span className="text-sm text-gray-400 dark:text-zinc-500">Search products...</span>
                </div>
              </div>
            }>
              <SearchDropdown />
            </Suspense>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar />
    </QueryProvider>
  );
}
