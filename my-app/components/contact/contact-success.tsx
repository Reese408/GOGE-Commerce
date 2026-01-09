"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactSuccessProps {
  onSendAnother: () => void;
}

export function ContactSuccess({ onSendAnother }: ContactSuccessProps) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="text-center py-12"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Message Sent Successfully!
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Thank you for reaching out. We'll get back to you soon.
      </p>
      <Button
        onClick={onSendAnother}
        className="bg-[#927194] hover:bg-[#927194]/90 text-white"
      >
        Send Another Message
      </Button>
    </motion.div>
  );
}
