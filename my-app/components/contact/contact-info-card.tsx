"use client";

import { Mail, Instagram, MapPin, type LucideIcon } from "lucide-react";

interface ContactInfoItem {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string | null;
}

const contactInfo: ContactInfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "graceogoing@gmail.com",
    href: "mailto:graceogoing@gmail.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@grace.ongoing",
    href: "https://www.instagram.com/grace.ongoing/",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "United States",
    href: null,
  },
];

export function ContactInfoCard() {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Contact Information
        </h2>
        <div className="space-y-6">
          {contactInfo.map((info) => (
            <div key={info.label} className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#927194]/10 to-[#D08F90]/10 dark:from-[#927194]/20 dark:to-[#D08F90]/20 flex items-center justify-center flex-shrink-0">
                <info.icon className="w-5 h-5 text-[#927194]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {info.label}
                </p>
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith("http") ? "_blank" : undefined}
                    rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-gray-900 dark:text-white hover:text-[#927194] dark:hover:text-[#D08F90] transition-colors"
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-900 dark:text-white">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-gray-200 dark:border-zinc-800 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Response Time
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          We typically respond to all inquiries within 24-48 hours during business days.
          Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
