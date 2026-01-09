"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfoCard } from "@/components/contact/contact-info-card";
import { ContactSuccess } from "@/components/contact/contact-success";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSuccess = () => {
    setIsSubmitted(true);
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleSendAnother = () => {
    setIsSubmitted(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="container mx-auto px-6 py-16 lg:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-[#927194] via-[#D08F90] to-[#A0B094] bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have a question or want to collaborate? We'd love to hear from you.
            Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto"
        >
          {/* Contact Information Sidebar */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <ContactInfoCard />
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 lg:p-10 border border-gray-200 dark:border-zinc-800 shadow-lg">
              {isSubmitted ? (
                <ContactSuccess onSendAnother={handleSendAnother} />
              ) : (
                <ContactForm onSuccess={handleSuccess} />
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-16 lg:mt-24 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looking for quick answers? Check out our{" "}
            <a
              href="/return-policy"
              className="text-[#927194] hover:text-[#D08F90] font-medium transition-colors"
            >
              Return Policy
            </a>{" "}
            or{" "}
            <a
              href="/track-order"
              className="text-[#927194] hover:text-[#D08F90] font-medium transition-colors"
            >
              Track Your Order
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
