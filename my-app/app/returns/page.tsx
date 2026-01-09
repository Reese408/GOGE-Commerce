"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Mail, Phone, MessageSquare, CheckCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ReturnsPage() {
  const [formData, setFormData] = useState({
    orderNumber: "",
    email: "",
    issueDescription: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Build email body for damaged/defective items
    const subject = `Damaged/Defective Item Report - Order ${formData.orderNumber}`;
    const body = `
Order Number: ${formData.orderNumber}
Email: ${formData.email}

Issue Description:
${formData.issueDescription}

I have attached photos of the damaged/defective item and can provide additional information if needed.

Date of this report: ${new Date().toLocaleDateString()}
    `.trim();

    // Open email client with pre-filled data
    window.location.href = `mailto:graceogoing@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Show success message
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            Email Client Opened
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your email client should open with your report pre-filled.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            <strong>Important:</strong> Please attach clear photos of the damaged/defective item before sending. We'll review your case and respond within 24-48 hours.
          </p>
          <Button
            size="lg"
            onClick={() => setIsSubmitted(false)}
            className="mr-4"
          >
            Submit Another Report
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
          <AlertCircle className="mx-auto mb-4 text-amber-500" size={48} />
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Damaged or Defective Items
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Report damaged or defective items only. All other sales are final.
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-900">
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="text-amber-600 dark:text-amber-500" size={24} />
              All Sales Are Final
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-3">
              As a small business, we cannot accept returns for change of mind. However, we stand behind the quality of our products.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              If your item arrived <strong>damaged or defective</strong>, please report it within <strong>7 days</strong> of receiving your order using the form below.
            </p>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Report Form */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              Report Damaged/Defective Item
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
                  Issue Description *
                </label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Please describe the damage or defect in detail. Remember to attach photos when you send the email."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#927194] resize-none"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>📸 Don't forget:</strong> After clicking submit, attach clear photos of the damaged/defective item to the email before sending.
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-[#927194] hover:bg-[#927194]/90 text-white"
              >
                Open Email to Report Issue
              </Button>
            </form>
          </motion.div>

          {/* Information Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                <Package size={24} className="text-[#927194]" />
                What We Need
              </h3>
              <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-[#927194] font-bold mt-1">✓</span>
                  <span>Clear photos of the damaged/defective item</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#927194] font-bold mt-1">✓</span>
                  <span>Your order number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#927194] font-bold mt-1">✓</span>
                  <span>Detailed description of the issue</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#927194] font-bold mt-1">✓</span>
                  <span>Report within 7 days of delivery</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                What Happens Next?
              </h3>
              <ol className="space-y-3 text-gray-700 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-[#927194]">1.</span>
                  <span>We review your report and photos</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#927194]">2.</span>
                  <span>If approved, we'll offer a replacement or refund</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-[#927194]">3.</span>
                  <span>We'll respond within 24-48 hours</span>
                </li>
              </ol>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-zinc-900 rounded-xl p-8 border border-gray-200 dark:border-zinc-800"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Contact Support
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="text-[#927194] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <a
                      href="mailto:graceogoing@gmail.com"
                      className="text-[#927194] hover:underline text-sm"
                    >
                      graceogoing@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="text-[#927194] mt-1" size={20} />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Phone
                    </p>
                    <a
                      href="tel:1-800-GRACE-GO"
                      className="text-[#927194] hover:underline text-sm"
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
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-[#927194]/10 to-[#D08F90]/10 rounded-xl p-6 border border-[#927194]/20"
            >
              <h3 className="font-bold mb-2 text-gray-900 dark:text-white">
                View Full Policy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Read our complete return and refund policy
              </p>
              <Link href="/return-policy">
                <Button variant="outline" className="w-full">
                  Return Policy
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
