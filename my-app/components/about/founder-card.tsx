"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SocialLink, FounderCardProps } from "@/lib/types";

// X (Twitter) icon component since lucide doesn't have the new logo
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);



export function FounderCard({
  imageSrc = "/placeholder-founder.jpg",
  imageAlt = "Founder portrait",
  name,
  title,
  university,
  sport,
  bio,
  socials,
}: FounderCardProps) {
  const socialLinks: SocialLink[] = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/amanda_10k/",
      icon: <Instagram size={20} />,
      color: "hover:bg-pink-500 hover:text-white",
    },
    {
      name: "X",
      href: "https://x.com/amanda_10k?lang=en",
      icon: <XIcon />,
      color: "hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61564522843321",
      icon: <Facebook size={20} />,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/amanda-kolar-04013a333/",
      icon: <Linkedin size={20} />,
      color: "hover:bg-blue-700 hover:text-white",
    },
    {
      name: "Portfolio",
      href: "https://amandakolar.myportfolio.com/",
      icon: <ExternalLink size={20} />,
      color: "hover:bg-[#927194] hover:text-white",
    },
  ].filter((link) => link.href !== "#");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0 md:gap-8">
        {/* Image Section */}
        <div className="md:col-span-2 relative h-96 sm:h-[500px] md:h-auto bg-gradient-to-br from-[#927194] to-[#D08F90]">
          <div className="relative w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
          {/* Header */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {name}
              </h2>
              <p className="text-base sm:text-lg font-semibold text-[#927194] dark:text-[#D08F90]">
                {title}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-2">
                  🎓 {university}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-2">
                  🥎 {sport}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              {bio}
            </p>
          </div>

          {/* Social Links */}
          <div className="mt-6 sm:mt-8 pt-6 border-t border-gray-200 dark:border-zinc-700">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
              Connect with Amanda
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className={`transition-all duration-300 ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Button>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
