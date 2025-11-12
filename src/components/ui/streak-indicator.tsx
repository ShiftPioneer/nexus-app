/**
 * NEXUS Streak Indicator Component
 * Fire icon with streak count and animations for gamification
 */

import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakIndicatorProps {
  count: number;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: "h-5 w-5", text: "text-sm", container: "gap-1.5" },
  md: { icon: "h-6 w-6", text: "text-base", container: "gap-2" },
  lg: { icon: "h-8 w-8", text: "text-xl", container: "gap-3" },
};

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  count,
  isActive = true,
  size = "md",
  animated = true,
  showLabel = false,
  className = "",
}) => {
  const { icon, text, container } = sizeMap[size];

  return (
    <div className={cn(
      "inline-flex items-center justify-center",
      container,
      className
    )}>
      <div className={cn(
        "relative inline-flex items-center justify-center",
        animated && isActive && "animate-pulse-slow"
      )}>
        <Flame
          className={cn(
            icon,
            isActive 
              ? "text-orange-500 fill-orange-500/50 drop-shadow-glow" 
              : "text-slate-500",
            "transition-colors duration-300"
          )}
        />
        {animated && isActive && (
          <div className="absolute inset-0 animate-ping">
            <Flame className={cn(icon, "text-orange-500 opacity-30")} />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className={cn(
          text,
          "font-bold",
          isActive ? "text-white" : "text-slate-400"
        )}>
          {count}
        </span>
        {showLabel && (
          <span className={cn(
            "text-xs",
            isActive ? "text-slate-300" : "text-slate-500"
          )}>
            {count === 1 ? "day" : "days"}
          </span>
        )}
      </div>
    </div>
  );
};
