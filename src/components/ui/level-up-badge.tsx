/**
 * NEXUS Level Up Badge Component
 * Animated badge for level-up celebrations
 */

import React, { useEffect, useState } from "react";
import { Trophy, Star, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelUpBadgeProps {
  level: number;
  visible?: boolean;
  onClose?: () => void;
  duration?: number; // Auto-hide after duration (ms)
  variant?: "gold" | "silver" | "bronze";
}

const variantMap = {
  gold: {
    bg: "from-yellow-500 via-yellow-400 to-yellow-500",
    shadow: "shadow-[0_0_40px_rgba(234,179,8,0.6)]",
    sparkle: "text-yellow-200",
  },
  silver: {
    bg: "from-slate-300 via-slate-200 to-slate-300",
    shadow: "shadow-[0_0_40px_rgba(148,163,184,0.6)]",
    sparkle: "text-slate-100",
  },
  bronze: {
    bg: "from-orange-600 via-orange-500 to-orange-600",
    shadow: "shadow-[0_0_40px_rgba(249,115,22,0.6)]",
    sparkle: "text-orange-300",
  },
};

export const LevelUpBadge: React.FC<LevelUpBadgeProps> = ({
  level,
  visible = false,
  onClose,
  duration = 4000,
  variant = "gold",
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!show) return null;

  const colors = variantMap[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none animate-scale-in">
      <div className="relative">
        {/* Outer glow */}
        <div className={cn(
          "absolute inset-0 rounded-full blur-3xl animate-pulse-slow",
          colors.shadow
        )} />

        {/* Rotating sparkles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "3s" }}>
          <Sparkles className={cn("absolute -top-4 left-1/2 -translate-x-1/2 h-6 w-6", colors.sparkle)} />
          <Sparkles className={cn("absolute top-1/2 -right-4 -translate-y-1/2 h-6 w-6", colors.sparkle)} />
          <Sparkles className={cn("absolute -bottom-4 left-1/2 -translate-x-1/2 h-6 w-6", colors.sparkle)} />
          <Sparkles className={cn("absolute top-1/2 -left-4 -translate-y-1/2 h-6 w-6", colors.sparkle)} />
        </div>

        {/* Main badge */}
        <div className={cn(
          "relative w-48 h-48 rounded-full flex flex-col items-center justify-center",
          "bg-gradient-to-br",
          colors.bg,
          colors.shadow,
          "animate-bounce"
        )}>
          {/* Trophy icon */}
          <Trophy className="h-16 w-16 text-white mb-2 drop-shadow-lg" />

          {/* Level text */}
          <div className="text-white text-center">
            <div className="text-sm font-semibold uppercase tracking-wider drop-shadow-md">
              Level Up!
            </div>
            <div className="text-5xl font-bold drop-shadow-xl">
              {level}
            </div>
          </div>

          {/* Star decorations */}
          <div className="absolute top-4 left-4">
            <Star className="h-6 w-6 text-white fill-white animate-pulse" />
          </div>
          <div className="absolute top-4 right-4">
            <Star className="h-6 w-6 text-white fill-white animate-pulse" style={{ animationDelay: "150ms" }} />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <Star className="h-6 w-6 text-white fill-white animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        </div>

        {/* Radiating rings */}
        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping" />
        <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-ping" style={{ animationDelay: "150ms" }} />
      </div>
    </div>
  );
};
