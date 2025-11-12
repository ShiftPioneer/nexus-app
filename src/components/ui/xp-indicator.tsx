/**
 * NEXUS XP Indicator Component
 * Experience points display with level progress
 */

import React from "react";
import { Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LinearProgress } from "./linear-progress";

interface XPIndicatorProps {
  currentXP: number;
  levelXP: number; // XP needed for current level
  nextLevelXP: number; // XP needed for next level
  level: number;
  variant?: "compact" | "detailed";
  animated?: boolean;
  className?: string;
}

export const XPIndicator: React.FC<XPIndicatorProps> = ({
  currentXP,
  levelXP,
  nextLevelXP,
  level,
  variant = "detailed",
  animated = true,
  className = "",
}) => {
  // Calculate progress within current level
  const xpInLevel = currentXP - levelXP;
  const xpNeeded = nextLevelXP - levelXP;
  const progress = (xpInLevel / xpNeeded) * 100;

  if (variant === "compact") {
    return (
      <div className={cn("inline-flex items-center gap-2", className)}>
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-primary fill-primary/50" />
          <span className="text-sm font-bold text-white">
            Lvl {level}
          </span>
        </div>
        <div className="w-32">
          <LinearProgress
            value={progress}
            variant="primary"
            size="sm"
            animated={animated}
          />
        </div>
        <span className="text-xs text-slate-400">
          {xpInLevel}/{xpNeeded}
        </span>
      </div>
    );
  }

  return (
    <div className={cn(
      "space-y-3 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 p-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-orange-500 p-2",
            animated && "animate-pulse-slow"
          )}>
            <Star className="h-5 w-5 text-white fill-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-white">Level {level}</div>
            <div className="text-xs text-slate-400">
              {xpInLevel} / {xpNeeded} XP
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-600/30">
          <TrendingUp className="h-4 w-4 text-success" />
          <span className="text-sm font-semibold text-success">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      <LinearProgress
        value={progress}
        variant="primary"
        size="md"
        animated={animated}
      />

      <div className="text-xs text-slate-400 text-center">
        {xpNeeded - xpInLevel} XP until next level
      </div>
    </div>
  );
};
