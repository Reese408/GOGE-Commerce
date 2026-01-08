"use client";

import { motion } from "framer-motion";
import { Heart, Sparkles, Hand } from "lucide-react";

interface MissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

function MissionCard({ icon, title, description, delay }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      className="bg-white dark:bg-zinc-900 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-[#927194] to-[#D08F90] flex items-center justify-center mb-4 sm:mb-6 text-white">
        {icon}
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export function MissionSection() {
  const missions = [
    {
      icon: <Heart size={28} />,
      title: "Faith & Love",
      description:
        "Every design carries a message of God's love and grace, created to inspire and uplift believers in their daily walk with Christ.",
    },
    {
      icon: <Hand size={28} />,
      title: "Handmade with Care",
      description:
        "Each product is personally handcrafted with attention to detail, ensuring quality and uniqueness in every piece.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Positive Impact",
      description:
        "Spreading positivity and encouragement through thoughtful designs that remind us of God's ongoing grace in our lives.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Our Mission
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
            Grace, Ongoing exists to share the good news of Jesus through
            creative designs and authentic faith
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {missions.map((mission, index) => (
            <MissionCard
              key={mission.title}
              icon={mission.icon}
              title={mission.title}
              description={mission.description}
              delay={index * 0.2}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
