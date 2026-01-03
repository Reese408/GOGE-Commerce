"use client";

import { motion } from "framer-motion";
import { Gift, Zap, Star, Crown } from "lucide-react";

interface RewardsProgressBarProps {
  currentTotal: number;
}

const REWARD_TIERS = [
  { threshold: 50, reward: "Free Shipping", icon: Zap, color: "from-blue-500 to-blue-600" },
  { threshold: 100, reward: "10% Off Next Order", icon: Gift, color: "from-purple-500 to-purple-600" },
  { threshold: 150, reward: "Free Gift", icon: Star, color: "from-pink-500 to-pink-600" },
  { threshold: 200, reward: "VIP Status", icon: Crown, color: "from-yellow-500 to-yellow-600" },
];

export function RewardsProgressBar({ currentTotal }: RewardsProgressBarProps) {
  // Find current tier and next tier
  const currentTierIndex = REWARD_TIERS.findIndex(tier => currentTotal < tier.threshold);
  const nextTier = REWARD_TIERS[currentTierIndex] || REWARD_TIERS[REWARD_TIERS.length - 1];
  const previousTier = currentTierIndex > 0 ? REWARD_TIERS[currentTierIndex - 1] : null;

  // Calculate progress percentage
  const startAmount = previousTier?.threshold || 0;
  const targetAmount = nextTier.threshold;
  const progress = Math.min(
    ((currentTotal - startAmount) / (targetAmount - startAmount)) * 100,
    100
  );

  const amountToNext = Math.max(targetAmount - currentTotal, 0);
  const hasReachedGoal = currentTotal >= REWARD_TIERS[REWARD_TIERS.length - 1].threshold;

  const Icon = nextTier.icon;

  return (
    <div className="space-y-3">
      {/* Progress Message */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md bg-gradient-to-r ${nextTier.color}`}>
            <Icon className="text-white" size={14} />
          </div>
          <div className="text-xs">
            {hasReachedGoal ? (
              <p className="font-semibold text-gray-900 dark:text-white">
                🎉 You've unlocked all rewards!
              </p>
            ) : (
              <>
                <p className="font-semibold text-gray-900 dark:text-white">
                  ${amountToNext.toFixed(2)} away from {nextTier.reward}
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Current: ${currentTotal.toFixed(2)}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${nextTier.color} rounded-full relative`}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </motion.div>
      </div>

      {/* Reward Milestones */}
      <div className="flex justify-between items-center text-xs">
        {REWARD_TIERS.map((tier, index) => {
          const isUnlocked = currentTotal >= tier.threshold;
          const isCurrent = tier.threshold === nextTier.threshold && !hasReachedGoal;
          const TierIcon = tier.icon;

          return (
            <div
              key={tier.threshold}
              className={`flex flex-col items-center gap-1 ${
                isUnlocked ? "opacity-100" : isCurrent ? "opacity-80" : "opacity-40"
              } transition-opacity`}
            >
              <div
                className={`p-1 rounded-full ${
                  isUnlocked
                    ? `bg-gradient-to-r ${tier.color}`
                    : "bg-gray-300 dark:bg-zinc-700"
                }`}
              >
                <TierIcon className="text-white" size={10} />
              </div>
              <span
                className={`text-[10px] font-medium ${
                  isUnlocked
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                ${tier.threshold}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
