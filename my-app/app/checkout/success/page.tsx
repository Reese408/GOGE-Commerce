"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
        >
          <CheckCircle className="text-green-600 dark:text-green-400" size={48} />
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
        >
          Order Placed Successfully!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          Thank you for your order! We've sent a confirmation email with your
          order details.
        </motion.p>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-6 mb-8 space-y-4"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="bg-[#927194]/10 p-3 rounded-lg">
              <Package className="text-[#927194]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order Number
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                #GO-{Math.floor(Math.random() * 100000)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-left">
            <div className="bg-[#D08F90]/10 p-3 rounded-lg">
              <Mail className="text-[#D08F90]" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Confirmation Email
              </p>
              <p className="font-semibold text-gray-900 dark:text-white">
                Sent to your email address
              </p>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 dark:from-[#927194]/20 dark:via-[#D08F90]/20 dark:to-[#A0B094]/20 rounded-xl p-6 mb-8"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            What's Next?
          </h3>
          <ul className="text-left space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#927194] mt-0.5">✓</span>
              <span>We'll send you shipping updates via email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#927194] mt-0.5">✓</span>
              <span>Your order will be processed within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#927194] mt-0.5">✓</span>
              <span>Track your order status in your account</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4"
        >
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="flex-1 bg-[#927194] hover:bg-[#927194]/90 text-white"
          >
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
