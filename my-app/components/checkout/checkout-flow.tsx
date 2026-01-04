"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  Truck,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store/cart-store";
import { OrderSummary } from "./order-summary";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_TIERS } from "@/lib/constants";

interface ShippingFormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  minWeight?: number;
  maxWeight?: number;
}

// Shipping methods matching Shopify configuration
// NOTE: These are for UX display only - Shopify checkout determines actual shipping cost
const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "economy",
    name: "Economy Shipping",
    description: "5-7 business days",
    price: SHIPPING_TIERS.ECONOMY_0_5.cost,
    estimatedDays: "5-7",
    minWeight: 0,
    maxWeight: 5,
  },
  {
    id: "standard",
    name: "Standard Shipping",
    description: "3-5 business days",
    price: SHIPPING_TIERS.STANDARD_0_1.cost,
    estimatedDays: "3-5",
    minWeight: 0,
    maxWeight: 1,
  },
];

export function CheckoutFlow() {
  const router = useRouter();
  const { items, totalPrice, totalWeight } = useCartStore();
  const [step, setStep] = useState<"shipping" | "payment" | "review">(
    "shipping"
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingData, setShippingData] = useState<ShippingFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
  });

  const [selectedShipping, setSelectedShipping] = useState<string>("economy");

  const subtotal = totalPrice();
  const cartWeight = totalWeight();

  // Calculate shipping cost based on Shopify rules (UX display only)
  const getShippingCost = () => {
    // Free shipping for orders $75+
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      return 0;
    }

    // Economy shipping tiers based on weight
    if (selectedShipping === "economy") {
      if (cartWeight >= 5 && cartWeight <= 70) {
        return SHIPPING_TIERS.ECONOMY_5_70.cost;
      }
      return SHIPPING_TIERS.ECONOMY_0_5.cost;
    }

    // Standard shipping tiers based on weight
    if (selectedShipping === "standard") {
      if (cartWeight > 1 && cartWeight <= 5) {
        return SHIPPING_TIERS.STANDARD_1_5.cost;
      }
      return SHIPPING_TIERS.STANDARD_0_1.cost;
    }

    return 0;
  };

  const shippingCost = getShippingCost();
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleContinueToPayment = async () => {
    // Validate shipping form
    if (
      !shippingData.email ||
      !shippingData.firstName ||
      !shippingData.lastName ||
      !shippingData.address ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.zipCode
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsProcessing(true);

    try {
      // Redirect to Shopify checkout with cart items AND pre-filled shipping info
      const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

      // Build cart items for URL using variant IDs from item.id
      const cartItems = items
        .map((item) => {
          // The item.id contains the variant ID
          // Extract numeric ID from Shopify GID if needed
          let variantId = item.id;

          // If it's a full GID (gid://shopify/ProductVariant/123456789), extract numeric part
          if (variantId.includes("gid://shopify/ProductVariant/")) {
            variantId = variantId.split("/").pop() || variantId;
          }

          // Remove any size suffix that might have been added (e.g., "123456789-L")
          const numericId = variantId.split("-")[0];

          return `${numericId}:${item.quantity}`;
        })
        .join(",");

      // Create checkout URL with cart items and pre-filled customer info
      const checkoutUrl = new URL(`https://${shopifyDomain}/cart/${cartItems}`);

      // Add shipping info as query parameters to pre-fill Shopify checkout
      checkoutUrl.searchParams.set("checkout[email]", shippingData.email);
      checkoutUrl.searchParams.set("checkout[shipping_address][first_name]", shippingData.firstName);
      checkoutUrl.searchParams.set("checkout[shipping_address][last_name]", shippingData.lastName);
      checkoutUrl.searchParams.set("checkout[shipping_address][address1]", shippingData.address);
      if (shippingData.apartment) {
        checkoutUrl.searchParams.set("checkout[shipping_address][address2]", shippingData.apartment);
      }
      checkoutUrl.searchParams.set("checkout[shipping_address][city]", shippingData.city);
      checkoutUrl.searchParams.set("checkout[shipping_address][province]", shippingData.state);
      checkoutUrl.searchParams.set("checkout[shipping_address][zip]", shippingData.zipCode);
      checkoutUrl.searchParams.set("checkout[shipping_address][country]", shippingData.country);
      if (shippingData.phone) {
        checkoutUrl.searchParams.set("checkout[shipping_address][phone]", shippingData.phone);
      }

      console.log("Redirecting to Shopify checkout with pre-filled info:", checkoutUrl.toString());
      console.log("Cart items:", cartItems);

      // Redirect to Shopify cart/checkout with pre-filled data
      window.location.href = checkoutUrl.toString();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error creating your checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Redirect directly to Shopify checkout with cart items
      const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

      // Build cart items for URL using variant IDs from item.id
      // Shopify cart URL format: /cart/VARIANT_ID:QUANTITY,VARIANT_ID:QUANTITY
      const cartItems = items
        .map((item) => {
          // The item.id contains the variant ID
          // Extract numeric ID from Shopify GID if needed
          let variantId = item.id;

          // If it's a full GID (gid://shopify/ProductVariant/123456789), extract numeric part
          if (variantId.includes("gid://shopify/ProductVariant/")) {
            variantId = variantId.split("/").pop() || variantId;
          }

          // Remove any size suffix that might have been added (e.g., "123456789-L")
          const numericId = variantId.split("-")[0];

          return `${numericId}:${item.quantity}`;
        })
        .join(",");

      console.log("Redirecting to Shopify cart:", `https://${shopifyDomain}/cart/${cartItems}`);
      console.log("Cart items:", items);

      // Redirect to Shopify cart/checkout
      window.location.href = `https://${shopifyDomain}/cart/${cartItems}`;
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Your cart is empty
          </h2>
          <Button onClick={() => router.push("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-8">
      <div className="container mx-auto px-6 sm:px-8 max-w-7xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-8 hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <ChevronLeft size={20} />
          Back
        </Button>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { id: "shipping", icon: MapPin, label: "Shipping" },
              { id: "payment", icon: CreditCard, label: "Payment" },
              { id: "review", icon: Check, label: "Review" },
            ].map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    step === s.id
                      ? "bg-[#927194] text-white"
                      : index <
                        ["shipping", "payment", "review"].indexOf(step)
                      ? "bg-[#A0B094] text-white"
                      : "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <s.icon size={18} />
                  <span className="font-semibold text-sm">{s.label}</span>
                </div>
                {index < 2 && (
                  <div className="w-12 h-0.5 bg-gray-300 dark:bg-zinc-700 mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {/* Shipping Step */}
              {step === "shipping" && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="text-[#927194]" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Shipping Information
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        placeholder="you@example.com"
                      />
                    </div>

                    {/* Name */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={shippingData.firstName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={shippingData.lastName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                      />
                    </div>

                    {/* Apartment */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={shippingData.apartment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                      />
                    </div>

                    {/* City, State, ZIP */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={shippingData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={shippingData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={shippingData.zipCode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                      />
                    </div>

                    {/* Shipping Methods */}
                    <div className="pt-6 border-t border-gray-200 dark:border-zinc-700">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Shipping Method
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cart weight: {cartWeight.toFixed(2)} lb
                        </p>
                      </div>

                      {/* Free Shipping Notice */}
                      {subtotal >= FREE_SHIPPING_THRESHOLD && (
                        <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                            <Check size={16} />
                            🎉 You qualify for free shipping!
                          </p>
                        </div>
                      )}

                      <div className="space-y-3">
                        {SHIPPING_METHODS.map((method) => {
                          // Calculate actual shipping price based on weight and method
                          let displayPrice = method.price;

                          if (subtotal >= FREE_SHIPPING_THRESHOLD) {
                            displayPrice = 0;
                          } else if (method.id === "economy") {
                            displayPrice = cartWeight >= 5 ? SHIPPING_TIERS.ECONOMY_5_70.cost : SHIPPING_TIERS.ECONOMY_0_5.cost;
                          } else if (method.id === "standard") {
                            displayPrice = cartWeight > 1 ? SHIPPING_TIERS.STANDARD_1_5.cost : SHIPPING_TIERS.STANDARD_0_1.cost;
                          }

                          return (
                            <label
                              key={method.id}
                              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedShipping === method.id
                                  ? "border-[#927194] bg-[#927194]/5"
                                  : "border-gray-200 dark:border-zinc-700 hover:border-[#927194]/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  name="shipping"
                                  value={method.id}
                                  checked={selectedShipping === method.id}
                                  onChange={(e) =>
                                    setSelectedShipping(e.target.value)
                                  }
                                  className="w-4 h-4 text-[#927194] focus:ring-[#927194]"
                                />
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {method.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {method.description}
                                  </p>
                                </div>
                              </div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {displayPrice === 0 ? "FREE" : `$${displayPrice.toFixed(2)}`}
                              </p>
                            </label>
                          );
                        })}
                      </div>

                      {/* Shopify Note */}
                      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 italic">
                        Note: Final shipping cost will be calculated by Shopify checkout based on your location and cart weight.
                      </p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    onClick={handleContinueToPayment}
                    className="w-full mt-6 bg-[#927194] hover:bg-[#927194]/90 text-white"
                  >
                    Continue to Payment
                  </Button>
                </motion.div>
              )}

              {/* Payment Step */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-200 dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="text-[#927194]" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Payment Information
                    </h2>
                  </div>

                  {/* Shopify Payment Integration Placeholder */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 rounded-lg p-6 border border-[#927194]/20">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        In a production environment, this would integrate with
                        Shopify Payments or Shopify's checkout API to securely
                        process payments.
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg flex items-center justify-center">
                          <span className="text-2xl">💳</span>
                        </div>
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-600">
                            VISA
                          </span>
                        </div>
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg flex items-center justify-center">
                          <span className="text-xl font-bold text-red-600">
                            MC
                          </span>
                        </div>
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg flex items-center justify-center">
                          <span className="text-xl font-bold text-blue-500">
                            AMEX
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mock Payment Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setStep("shipping")}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-[#927194] hover:bg-[#927194]/90 text-white"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shipping={shippingCost}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
