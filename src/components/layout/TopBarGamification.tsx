/**
 * NEXUS TopBar Gamification Component
 * Compact horizontal display of XP, level, and streak for the top bar
 */

import React from "react";
import { useGamification } from "@/hooks/use-gamification";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Flame, Zap, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBarGamificationProps {
  className?: string;
  compact?: boolean;
}

const TopBarGamification: React.FC<TopBarGamificationProps> = ({
  className,
  compact = false,
}) => {
  const { currentXP, level, nextLevelXP, levelXP, streakDays } = useGamification();
  
  // Calculate progress percentage for current level
  const xpInCurrentLevel = currentXP - levelXP;
  const xpNeededForLevel = nextLevelXP - levelXP;
  const xpProgress = (xpInCurrentLevel / xpNeededForLevel) * 100;

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        "flex items-center gap-1 sm:gap-2",
        className
      )}>
        {/* Level Badge */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg",
                "bg-gradient-to-r from-primary/20 to-primary/10",
                "border border-primary/30",
                "cursor-default select-none",
                compact ? "px-1.5 py-0.5" : "px-2 py-1"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <TrendingUp className={cn(
                "text-primary",
                compact ? "h-3 w-3" : "h-3.5 w-3.5"
              )} />
              <span className={cn(
                "font-bold text-primary",
                compact ? "text-[10px]" : "text-xs"
              )}>
                Lv.{level}
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-900 border-slate-700">
            <p className="text-xs">Level {level}</p>
          </TooltipContent>
        </Tooltip>

        {/* XP with Progress Bar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-lg",
                "bg-slate-800/60 border border-slate-700/50",
                "cursor-default select-none",
                compact ? "px-1.5 py-0.5" : "px-2 py-1"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Zap className={cn(
                "text-yellow-400",
                compact ? "h-3 w-3" : "h-3.5 w-3.5"
              )} />
              <div className="flex flex-col gap-0.5">
                <span className={cn(
                  "font-semibold text-slate-200 leading-none",
                  compact ? "text-[10px]" : "text-xs"
                )}>
                  {xpInCurrentLevel}/{xpNeededForLevel}
                </span>
                {/* Mini progress bar */}
                <div className={cn(
                  "bg-slate-700/50 rounded-full overflow-hidden",
                  compact ? "h-0.5 w-10" : "h-1 w-12"
                )}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-slate-900 border-slate-700">
            <p className="text-xs">{Math.round(xpProgress)}% to Level {level + 1}</p>
          </TooltipContent>
        </Tooltip>

        {/* Streak Badge - Only show if streak exists */}
        {streakDays > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                className={cn(
                  "flex items-center gap-0.5 px-2 py-1 rounded-lg",
                  "bg-gradient-to-r from-orange-500/20 to-red-500/20",
                  "border border-orange-500/30",
                  "cursor-default select-none",
                  compact ? "px-1.5 py-0.5" : "px-2 py-1"
                )}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className={cn(
                  "text-orange-400",
                  compact ? "h-3 w-3" : "h-3.5 w-3.5",
                  streakDays >= 7 && "animate-pulse"
                )} />
                <span className={cn(
                  "font-bold text-orange-400",
                  compact ? "text-[10px]" : "text-xs"
                )}>
                  {streakDays}
                </span>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-slate-900 border-slate-700">
              <p className="text-xs">{streakDays} day streak! 🔥</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
};

export default TopBarGamification;
