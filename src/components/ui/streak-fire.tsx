/**
 * NEXUS Streak Fire Component
 * Elaborate animated fire effect for celebrating streaks
 */

import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakFireProps {
  count: number;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showCount?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8", icon: "h-5 w-5", text: "text-xs" },
  md: { container: "w-24 h-24", icon: "h-12 w-12", text: "text-2xl" },
  lg: { container: "w-32 h-32", icon: "h-16 w-16", text: "text-3xl" },
  xl: { container: "w-40 h-40", icon: "h-20 w-20", text: "text-4xl" },
};

export const StreakFire: React.FC<StreakFireProps> = ({
  count,
  size = "lg",
  animated = true,
  showCount = true,
  className = "",
}) => {
  const { container, icon, text } = sizeMap[size];

  return (
    <div className={cn("relative inline-flex items-center justify-center", container, className)}>
      {/* Outer glow pulse */}
      {animated && (
        <>
          <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full bg-orange-500/10 animate-pulse" />
        </>
      )}

      {/* Main fire icon */}
      <div className="relative z-10">
        <Flame
          className={cn(
            icon,
            "text-orange-500 fill-orange-500/80",
            "drop-shadow-[0_0_20px_rgba(249,115,22,0.8)]",
            animated && "animate-pulse-slow"
          )}
        />
      </div>

      {/* Streak count overlay */}
      {showCount && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center z-20",
          text,
          "font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        )}>
          {count}
        </div>
      )}

      {/* Particle effects */}
      {animated && (
        <>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-orange-400 animate-bounce opacity-70" style={{ animationDelay: "0ms" }} />
          <div className="absolute top-4 left-1/3 w-1.5 h-1.5 rounded-full bg-red-400 animate-bounce opacity-60" style={{ animationDelay: "150ms" }} />
          <div className="absolute top-3 right-1/3 w-1.5 h-1.5 rounded-full bg-yellow-400 animate-bounce opacity-60" style={{ animationDelay: "300ms" }} />
        </>
      )}
    </div>
  );
};
