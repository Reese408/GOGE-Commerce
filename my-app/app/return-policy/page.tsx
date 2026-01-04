import { motion } from "framer-motion";
import { CheckCircle, XCircle, Package, RefreshCw } from "lucide-react";
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
          {/* Overview */}
          <div className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-6 border border-[#927194]/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <Package size={24} />
              Our Commitment
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              At Grace, Ongoing, we want you to be completely satisfied with your purchase. If you're not happy with your order for any reason, we're here to help with our hassle-free return policy.
            </p>
          </div>

          {/* Return Window */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              30-Day Return Window
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              You have <strong>30 days</strong> from the date of delivery to initiate a return. Returns requested after this period cannot be accepted.
            </p>
          </div>

          {/* Eligible Items */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              Eligible for Return
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Unworn and unwashed items</li>
              <li>Items with original tags still attached</li>
              <li>Items in original packaging (if applicable)</li>
              <li>Items without any signs of wear, damage, or alteration</li>
              <li>Defective or damaged items received</li>
            </ul>
          </div>

          {/* Non-Returnable Items */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <XCircle className="text-red-500" size={24} />
              Non-Returnable Items
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Items marked as "Final Sale"</li>
              <li>Worn, washed, or altered items</li>
              <li>Items without original tags</li>
              <li>Customized or personalized items</li>
              <li>Items damaged due to misuse</li>
            </ul>
          </div>

          {/* How to Return */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <RefreshCw size={24} />
              How to Return an Item
            </h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li className="font-semibold">
                Initiate Your Return
                <p className="ml-6 mt-1 font-normal">
                  Visit our <Link href="/returns" className="text-[#927194] hover:underline">Returns & Exchanges</Link> page and fill out the return request form, or email us at <a href="mailto:support@graceongoing.com" className="text-[#927194] hover:underline">support@graceongoing.com</a> with your order number.
                </p>
              </li>
              <li className="font-semibold">
                Receive Your Return Label
                <p className="ml-6 mt-1 font-normal">
                  Within 24-48 hours, we'll email you a prepaid return shipping label.
                </p>
              </li>
              <li className="font-semibold">
                Pack Your Items
                <p className="ml-6 mt-1 font-normal">
                  Securely pack the item(s) in the original packaging or a suitable box. Include all tags and accessories.
                </p>
              </li>
              <li className="font-semibold">
                Ship Your Return
                <p className="ml-6 mt-1 font-normal">
                  Attach the prepaid label and drop off at your nearest shipping location.
                </p>
              </li>
            </ol>
          </div>

          {/* Refund Process */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Refund Process
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Processing Time:</strong> Once we receive your return, we'll inspect it and process your refund within <strong>5-7 business days</strong>.
              </p>
              <p>
                <strong>Refund Method:</strong> Refunds will be issued to your original payment method. Depending on your bank or credit card company, it may take an additional 3-5 business days for the refund to appear in your account.
              </p>
              <p>
                <strong>Notification:</strong> You'll receive an email confirmation once your refund has been processed.
              </p>
            </div>
          </div>

          {/* Exchanges */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Exchanges
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We currently don't offer direct exchanges. If you'd like a different size or item, please return your original purchase for a refund and place a new order. This ensures you get exactly what you want without delay.
            </p>
          </div>

          {/* Damaged or Defective Items */}
          <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-6 border border-red-200 dark:border-red-900">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Damaged or Defective Items
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you receive a damaged or defective item, please contact us immediately at <a href="mailto:support@graceongoing.com" className="text-[#927194] hover:underline">support@graceongoing.com</a> with:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Your order number</li>
              <li>Photos of the damaged/defective item</li>
              <li>Description of the issue</li>
            </ul>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              We'll arrange for a replacement or full refund, including return shipping costs.
            </p>
          </div>

          {/* Free Returns */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Free Returns
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              All returns are free! We provide a prepaid return shipping label for all eligible returns within the United States. You won't be charged for return shipping.
            </p>
          </div>

          {/* Questions */}
          <div className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-6 border border-[#927194]/20">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Have Questions?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our customer service team is here to help! Reach out to us:
            </p>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                📧 Email: <a href="mailto:support@graceongoing.com" className="text-[#927194] hover:underline">support@graceongoing.com</a>
              </p>
              <p>
                📞 Phone: <a href="tel:1-800-GRACE-GO" className="text-[#927194] hover:underline">1-800-GRACE-GO</a>
              </p>
              <p>
                💬 Live Chat: Mon-Fri, 9am-5pm EST
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid sm:grid-cols-2 gap-4 pt-8">
            <Link href="/returns">
              <Button size="lg" className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white">
                Start a Return
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
