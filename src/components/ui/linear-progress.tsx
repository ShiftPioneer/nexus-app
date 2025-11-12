/**
 * NEXUS Linear Progress Component
 * Horizontal progress bar with glow effects
 */

import React from "react";
import { cn } from "@/lib/utils";

interface LinearProgressProps {
  value: number; // 0-100
  variant?: "primary" | "success" | "warning" | "error";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
}

const variantMap = {
  primary: "bg-gradient-to-r from-primary via-orange-500 to-red-500",
  success: "bg-gradient-to-r from-success/80 to-success",
  warning: "bg-gradient-to-r from-orange-400 to-orange-600",
  error: "bg-gradient-to-r from-error/80 to-error",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export const LinearProgress: React.FC<LinearProgressProps> = ({
  value,
  variant = "primary",
  size = "md",
  showLabel = false,
  label,
  className = "",
  animated = true,
}) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("w-full space-y-2", className)}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-300 font-medium">{label}</span>}
          {showLabel && <span className="text-slate-400">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      
      <div className={cn(
        "w-full rounded-full bg-slate-800/50 overflow-hidden",
        sizeMap[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantMap[variant],
            animated && "animate-pulse-slow",
            "shadow-glow"
          )}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
