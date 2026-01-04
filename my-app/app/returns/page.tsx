"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnsPage() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    reason: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to your backend/email
    console.log("Return request:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full text-center"
        >
          <CheckCircle className="mx-auto mb-6 text-green-500" size={64} />
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Return Request Submitted
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We've received your return request. Our team will review it and contact you within 24-48 hours at {formData.email}.
          </p>
          <Button
            size="lg"
            onClick={() => setIsSubmitted(false)}
            className="mr-4"
          >
            Submit Another Request
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline">
              Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 py-16">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <Package className="mx-auto mb-4 text-[#927194]" size={48} />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Returns & Exchanges
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We want you to love your purchase! If you're not satisfied, we're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Return Request Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Start a Return Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., #GO12345"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Return *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194]"
                >
                  <option value="">Select a reason</option>
                  <option value="wrong-size">Wrong Size</option>
                  <option value="defective">Defective/Damaged</option>
                  <option value="not-as-described">Not as Described</option>
                  <option value="changed-mind">Changed My Mind</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Details
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please provide any additional information about your return..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194] resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
              >
                Submit Return Request
              </Button>
            </form>
          </motion.div>

          {/* Return Policy & Contact Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Return Policy
              </h3>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    30-Day Return Window
                  </strong>
                  <br />
                  Items can be returned within 30 days of delivery.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    Condition Requirements
                  </strong>
                  <br />
                  Items must be unworn, unwashed, and in original condition with all tags attached.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    Free Returns
                  </strong>
                  <br />
                  We offer free returns on all orders. A prepaid shipping label will be provided.
                </p>
                <p>
                  <strong className="text-gray-900 dark:text-white">
                    Refund Timeline
                  </strong>
                  <br />
                  Refunds are processed within 5-7 business days of receiving your return.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Need Help?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[#927194] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email Us
                    </p>
                    <a
                      href="mailto:support@graceongoing.com"
                      className="text-[#927194] hover:underline"
                    >
                      support@graceongoing.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-[#927194] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Call Us
                    </p>
                    <a
                      href="tel:1-800-GRACE-GO"
                      className="text-[#927194] hover:underline"
                    >
                      1-800-GRACE-GO
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MessageSquare className="text-[#927194] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Live Chat
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Mon-Fri, 9am-5pm EST
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-6 border border-[#927194]/20"
            >
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                Track Your Order
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Want to check your order status instead?
              </p>
              <Link href="/track-order">
                <Button variant="outline" className="w-full">
                  Track Order
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
