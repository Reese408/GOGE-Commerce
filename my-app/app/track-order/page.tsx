"use client";

import { motion } from "framer-motion";
import { Package, Mail, ExternalLink, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <Package className="mx-auto mb-4 text-[#927194]" size={64} />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Track Your Order
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Check your email for tracking information
          </p>
        </motion.div>

        {/* Main Info Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 rounded-2xl p-8 border border-[#927194]/20 mb-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-[#927194]/20 rounded-lg">
              <Mail className="text-[#927194]" size={28} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-700 dark:text-gray-300">
                When your order ships, you'll receive an email with a tracking link from Shopify.
              </p>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Order Confirmation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent immediately after purchase</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="text-[#927194] mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Shipping Notification</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sent when your order is shipped with tracking link</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What You'll Get */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ExternalLink size={20} className="text-[#927194]" />
            What's Included in Your Tracking Email
          </h3>
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#927194] font-bold">•</span>
              <span>Direct link to track your package in real-time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#927194] font-bold">•</span>
              <span>Estimated delivery date</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#927194] font-bold">•</span>
              <span>Carrier information (USPS, UPS, or FedEx)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#927194] font-bold">•</span>
              <span>Order details and receipt</span>
            </li>
          </ul>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
            Need Help?
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/contact" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 hover:border-[#927194] transition-all hover:shadow-lg cursor-pointer h-full">
                <Mail className="text-[#927194] mb-3" size={24} />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Contact Support
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send us a message
                </p>
              </div>
            </Link>

            <Link href="/returns" className="block">
              <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-gray-200 dark:border-zinc-800 hover:border-[#927194] transition-all hover:shadow-lg cursor-pointer h-full">
                <Package className="text-[#927194] mb-3" size={24} />
                <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
                  Start a Return
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Need to return your order?
                </p>
              </div>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">Didn't receive a tracking email?</strong>
              <br />
              Check your spam folder or{" "}
              <a href="/contact" className="text-[#927194] hover:underline">
                contact us
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
