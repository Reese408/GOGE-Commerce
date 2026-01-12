"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { UndoToast } from "@/components/cart/undo-toast";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import { useProducts } from "@/lib/hooks/use-products";
import { CartErrorBoundary } from "@/components/error-boundary";

// Memoized Cart Item component to prevent unnecessary re-renders
interface CartItemProps {
  item: {
    id: string;
    title: string;
    imageUrl?: string;
    price: number;
    currencyCode: string;
    quantity: number;
    variant?: { title: string };
  };
  loadingImages: Record<string, boolean>;
  onImageLoad: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItemRow = memo(({ item, loadingImages, onImageLoad, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-4 bg-gray-50 dark:bg-zinc-800 rounded-lg p-4 transition-opacity duration-200">
      {/* Product Image */}
      {item.imageUrl && (
        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-200 dark:bg-zinc-700 flex-shrink-0">
          {/* Loading skeleton */}
          {loadingImages[item.id] !== false && (
            <div className="absolute inset-0 bg-gray-300 dark:bg-zinc-600 animate-pulse" />
          )}
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className={`object-cover transition-opacity duration-300 ${
              loadingImages[item.id] === false ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => onImageLoad(item.id)}
          />
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {item.title}
        </h3>
        {item.variant && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {item.variant.title}
          </p>
        )}
        <p className="text-sm font-medium text-[#927194] dark:text-[#D08F90] mt-2">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: item.currencyCode,
          }).format(item.price)}
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="h-7 w-7"
          >
            <Minus size={14} />
          </Button>
          <span className="text-sm font-medium w-8 text-center">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="h-7 w-7"
          >
            <Plus size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(item.id)}
            className="h-7 w-7 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
});

CartItemRow.displayName = "CartItemRow";

function CartSidebarContent() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, totalPrice } =
    useCartStore();
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>(
    {}
    
  );

  // Fetch products for "You May Also Like" section
  const { data: allProducts } = useProducts(8);

  const suggestedProducts = useMemo(() => {
    if (!allProducts) return [];

    // Get all product handles that are in the cart
    const cartProductHandles = new Set(items.map(item => item.handle));

    // Filter out products that are already in cart (by handle, so any variant excludes the product)
    const availableProducts = allProducts.filter(
      product => !cartProductHandles.has(product.handle)
    );

    // Fisher-Yates shuffle with stable seed based on cart items count
    const shuffled = [...availableProducts];
    const seed = items.length; // Stable seed

    for (let i = shuffled.length - 1; i > 0; i--) {
      // Pseudo-random based on seed
      const j = Math.floor(((seed * (i + 1)) % shuffled.length));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, 4);
  }, [allProducts, items]);

  const total = totalPrice();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const handleImageLoad = useCallback((itemId: string) => {
    setLoadingImages((prev) => ({ ...prev, [itemId]: false }));
  }, []);

  const handleUpdateQuantity = useCallback((itemId: string, quantity: number) => {
    updateQuantity(itemId, quantity);
  }, [updateQuantity]);

  const handleRemoveItem = useCallback((itemId: string) => {
    removeItem(itemId);
  }, [removeItem]);

  const handleCheckout = useCallback(() => {
    closeCart();
    router.push("/review");
  }, [closeCart, router]);

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
          />

          {/* Cart Modal - Slide up from bottom on mobile (with top gap), slide from right on desktop */}
          <div
            className="fixed bottom-0 left-0 right-0 top-16 md:top-0 md:right-0 md:left-auto md:bottom-0 w-full md:w-112.5 bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col rounded-t-2xl md:rounded-none animate-slide-in-mobile md:animate-slide-in-right"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag size={24} />
                Cart
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCart}
                className="hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={24} />
              </Button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingBag
                    size={64}
                    className="text-gray-300 dark:text-zinc-700 mb-4"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Empty Cart
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                    Add some products to get started
                  </p>
                  <Button
                    size="lg"
                    onClick={() => {
                      closeCart();
                      router.push("/shop");
                    }}
                    className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
                  >
                    Shop Products
                  </Button>
                </div>
              ) : (
                <>
                  {/* Free Shipping Progress */}
                  <div className="px-6 pt-6 pb-4">
                    <FreeShippingProgress currentSubtotal={total} />
                  </div>

                  {/* Cart Items List */}
                  <div className="p-6 space-y-4">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      loadingImages={loadingImages}
                      onImageLoad={handleImageLoad}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                  </div>

                  {/* "You May Also Like" Section - MOVED INSIDE scrollable area */}
                  {suggestedProducts.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-zinc-800 py-4 px-6 bg-gray-50 dark:bg-zinc-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          You May Also Like
                        </h3>
                        <Link
                          href="/shop"
                          onClick={closeCart}
                          className="flex items-center gap-1 text-xs font-medium text-[#927194] dark:text-[#D08F90] hover:underline"
                        >
                          Shop All
                          <ArrowRight size={12} />
                        </Link>
                      </div>

                      {/* Horizontal Scroll Product List */}
                      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                        {suggestedProducts.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.handle}`}
                            onClick={closeCart}
                            className="group flex-shrink-0"
                          >
                            <div className="w-24 bg-white dark:bg-zinc-900 rounded-md overflow-hidden border border-gray-200 dark:border-zinc-700 hover:border-[#927194] dark:hover:border-[#D08F90] transition-colors">
                              {/* Product Image */}
                              {product.imageUrl && (
                                <div className="relative aspect-square bg-gray-100 dark:bg-zinc-800">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="100px"
                                  />
                                </div>
                              )}

                              {/* Product Info - Compact */}
                              <div className="p-1.5">
                                <h4 className="text-[10px] font-medium text-gray-900 dark:text-white line-clamp-1 mb-0.5">
                                  {product.title}
                                </h4>
                                <p className="text-xs font-bold text-[#927194] dark:text-[#D08F90]">
                                  ${product.price}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900">
                {/* Subtotal */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Subtotal
                  </span>
                  <span className="text-2xl font-bold text-[#927194] dark:text-[#D08F90]">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: items[0].currencyCode,
                    }).format(total)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Shipping and taxes calculated at checkout
                </p>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  onClick={handleCheckout}
                  className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
                >
                  Review Order
                </Button>
              </div>
            )}

            {/* Undo Toast - Inside cart sidebar */}
            <UndoToast />
          </div>
        </>
      )}
    </>
  );
}

// Wrap with error boundary
export function CartSidebar() {
  return (
    <CartErrorBoundary>
      <CartSidebarContent />
    </CartErrorBoundary>
  );
}
