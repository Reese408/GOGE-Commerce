import { motion } from "framer-motion";
import { AlertCircle, Package, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReturnPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Return & Refund Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
          {/* All Sales Final */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-8 border-2 border-amber-200 dark:border-amber-900">
            <div className="flex items-start gap-4">
              <AlertCircle className="text-amber-600 dark:text-amber-500 mt-1 flex-shrink-0" size={32} />
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  All Sales Are Final
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                  As a small, family-operated business with a dedicated team, we are unable to offer returns or exchanges on purchased items. We appreciate your understanding and support as we work hard to bring you quality products with faith and care.
                </p>
              </div>
            </div>
          </div>

          {/* Why No Returns */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Package size={24} className="text-[#927194]" />
              Our Small Business Commitment
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Grace, Ongoing is a small business with a limited staff. We carefully prepare and fulfill each order with love and attention to detail. Due to our size and resources, we cannot accommodate returns or exchanges at this time.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              We encourage you to review product descriptions, sizing information, and images carefully before completing your purchase. If you have any questions about a product, please contact us before ordering.
            </p>
          </div>

          {/* Damaged or Defective Items */}
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-8 border-2 border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Damaged or Defective Items Only
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              While we cannot accept returns for change of mind, we absolutely stand behind the quality of our products. If you receive a damaged or defective item, please contact us immediately.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              <strong className="text-gray-900 dark:text-white">To report a damaged or defective item, email us at:</strong>
            </p>
            <div className="bg-white/60 dark:bg-zinc-900/60 rounded-lg p-4 mb-4">
              <a href="mailto:graceogoing@gmail.com" className="text-lg font-semibold text-[#927194] hover:underline">
                graceogoing@gmail.com
              </a>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              <strong className="text-gray-900 dark:text-white">Please include:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
              <li>Your order number</li>
              <li>Clear photos of the damaged or defective item</li>
              <li>Detailed description of the issue</li>
              <li>Date you received the order</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              We will review your case and, if approved, provide a replacement or full refund for items that arrive damaged or defective. Please report any issues within <strong>7 days</strong> of receiving your order.
            </p>
          </div>

          {/* Before You Buy */}
          <div className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-8 border border-[#927194]/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Before You Purchase
            </h2>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p className="flex items-start gap-2">
                <span className="text-[#927194] font-bold mt-1">✓</span>
                <span>Review product descriptions and sizing charts carefully</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#927194] font-bold mt-1">✓</span>
                <span>Check product images and details</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#927194] font-bold mt-1">✓</span>
                <span>Contact us with any questions before ordering</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-[#927194] font-bold mt-1">✓</span>
                <span>Ensure your shipping address is correct</span>
              </p>
            </div>
          </div>

          {/* Contact Us */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Mail size={24} className="text-[#927194]" />
              Have Questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about our products before purchasing, we're here to help!
            </p>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                📧 <strong>Email:</strong>{" "}
                <a href="mailto:graceogoing@gmail.com" className="text-[#927194] hover:underline">
                  graceogoing@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Thank You */}
          <div className="text-center bg-gradient-to-r from-[#927194]/5 to-[#D08F90]/5 rounded-xl p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 italic">
              "Thank you for supporting our small business. Every purchase helps us continue our mission of spreading faith and inspiration through quality apparel."
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              — The Grace, Ongoing Team
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 pt-8">
            <Link href="/shop">
              <Button size="lg" className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/track-order">
              <Button size="lg" variant="outline" className="w-full">
                Track My Order
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
