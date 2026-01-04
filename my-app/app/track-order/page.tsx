"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Search, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleTrackOrder = () => {
    if (!orderNumber || !email) {
      alert("Please enter both order number and email");
      return;
    }

    // Redirect to Shopify order status page
    const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const cleanOrderNumber = orderNumber.replace(/^#/, ""); // Remove # if present

    // Shopify order status URL format
    const trackingUrl = `https://${shopifyDomain}/tools/order-lookup`;

    window.open(trackingUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <Package className="mx-auto mb-4 text-[#927194]" size={48} />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter your order details to check the status of your shipment
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., #GO12345 or GO12345"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                You can find your order number in your confirmation email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                The email address used for your order
              </p>
            </div>

            <Button
              size="lg"
              onClick={handleTrackOrder}
              className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
            >
              <Search className="mr-2" size={20} />
              Track Order
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 space-y-4"
        >
          <div className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-6 border border-[#927194]/20">
            <h3 className="font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
              <ExternalLink size={20} />
              Shopify Order Status
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Your order tracking is powered by Shopify. You'll be redirected to Shopify's secure order status page where you can:
            </p>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-disc list-inside">
              <li>View real-time shipping updates</li>
              <li>Track your package location</li>
              <li>See estimated delivery date</li>
              <li>View order details and receipt</li>
            </ul>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/returns" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 hover:border-[#927194] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Need to Return?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Start a return request
                </p>
              </div>
            </Link>

            <Link href="mailto:support@graceongoing.com" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 hover:border-[#927194] transition-colors cursor-pointer">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Contact Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get help with your order
                </p>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
