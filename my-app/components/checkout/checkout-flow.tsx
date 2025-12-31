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
import { RewardsProgress } from "./rewards-progress";

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
}

const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "5-7 business days",
    price: 5.99,
    estimatedDays: "5-7",
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "2-3 business days",
    price: 12.99,
    estimatedDays: "2-3",
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "1 business day",
    price: 24.99,
    estimatedDays: "1",
  },
];

export function CheckoutFlow() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
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

  const [selectedShipping, setSelectedShipping] = useState<string>("standard");

  const subtotal = totalPrice();
  const shippingMethod = SHIPPING_METHODS.find(
    (method) => method.id === selectedShipping
  );
  const shippingCost = subtotal >= 50 ? 0 : shippingMethod?.price || 0;
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

  const handleContinueToPayment = () => {
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
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    // Simulate Shopify checkout process
    try {
      // In a real implementation, this would:
      // 1. Create a Shopify checkout
      // 2. Add line items
      // 3. Set shipping address
      // 4. Process payment
      // 5. Complete the order

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear cart and redirect to success page
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
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
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        {SHIPPING_METHODS.map((method) => (
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
                              {subtotal >= 50 && method.id === "standard"
                                ? "FREE"
                                : `$${method.price.toFixed(2)}`}
                            </p>
                          </label>
                        ))}
                      </div>
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
            <RewardsProgress currentTotal={subtotal} />
          </div>
        </div>
      </div>
    </div>
  );
}
