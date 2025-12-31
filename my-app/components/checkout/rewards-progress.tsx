"use client";

import { motion } from "framer-motion";
import { Gift, Sparkles } from "lucide-react";

interface RewardsProgressProps {
  currentTotal: number;
}

const REWARD_TIERS = [
  { threshold: 50, reward: "Free Shipping", icon: "🚚" },
  { threshold: 100, reward: "10% Off Next Order", icon: "💰" },
  { threshold: 150, reward: "Free Gift", icon: "🎁" },
  { threshold: 200, reward: "VIP Status", icon: "⭐" },
];

export function RewardsProgress({ currentTotal }: RewardsProgressProps) {
  const nextTier = REWARD_TIERS.find((tier) => currentTotal < tier.threshold);
  const currentTierIndex = REWARD_TIERS.findIndex(
    (tier) => currentTotal < tier.threshold
  );
  const previousTier =
    currentTierIndex > 0 ? REWARD_TIERS[currentTierIndex - 1] : null;

  const progress = nextTier
    ? ((currentTotal - (previousTier?.threshold || 0)) /
        (nextTier.threshold - (previousTier?.threshold || 0))) *
      100
    : 100;

  const amountToNext = nextTier ? nextTier.threshold - currentTotal : 0;

  return (
    <div className="bg-gradient-to-r from-[#927194]/10 via-[#D08F90]/10 to-[#A0B094]/10 dark:from-[#927194]/20 dark:via-[#D08F90]/20 dark:to-[#A0B094]/20 rounded-xl p-6 border border-[#927194]/20">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-[#927194]" size={20} />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Rewards Progress
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#927194] via-[#D08F90] to-[#A0B094] rounded-full"
        />
      </div>

      {/* Current Status */}
      {nextTier ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold text-[#927194] dark:text-[#D08F90]">
              ${amountToNext.toFixed(2)}
            </span>{" "}
            away from{" "}
            <span className="font-semibold">{nextTier.reward}</span>!
          </p>

          {/* Tier Milestones */}
          <div className="grid grid-cols-2 gap-2">
            {REWARD_TIERS.map((tier, index) => {
              const isUnlocked = currentTotal >= tier.threshold;
              const isCurrent = tier.threshold === nextTier?.threshold;

              return (
                <div
                  key={tier.threshold}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                    isUnlocked
                      ? "bg-[#A0B094]/20 border-[#A0B094] dark:bg-[#A0B094]/10"
                      : isCurrent
                      ? "bg-[#927194]/10 border-[#927194]/40 dark:bg-[#927194]/5"
                      : "bg-gray-50 border-gray-200 dark:bg-zinc-800 dark:border-zinc-700"
                  }`}
                >
                  <span className="text-xl">{tier.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {tier.reward}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ${tier.threshold}
                    </p>
                  </div>
                  {isUnlocked && (
                    <Gift className="text-[#A0B094] flex-shrink-0" size={16} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-lg font-bold text-[#927194] dark:text-[#D08F90] mb-2">
            🎉 All Rewards Unlocked! 🎉
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You've reached VIP status!
          </p>
        </div>
      )}
    </div>
  );
}
