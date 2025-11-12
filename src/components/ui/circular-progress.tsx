/**
 * NEXUS Circular Progress Component
 * Animated circular progress indicator with percentage display
 */

import React from "react";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number; // 0-100
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  variant?: "primary" | "success" | "warning" | "error";
  className?: string;
  strokeWidth?: number;
}

const sizeMap = {
  sm: { dimension: 48, fontSize: "text-xs" },
  md: { dimension: 64, fontSize: "text-sm" },
  lg: { dimension: 96, fontSize: "text-base" },
  xl: { dimension: 128, fontSize: "text-xl" },
};

const variantMap = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-orange-500",
  error: "text-error",
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = "md",
  showLabel = true,
  variant = "primary",
  className = "",
  strokeWidth = 8,
}) => {
  const { dimension, fontSize } = sizeMap[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={dimension}
        height={dimension}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-slate-700/30"
        />
        {/* Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            variantMap[variant],
            "transition-all duration-500 ease-out drop-shadow-glow"
          )}
        />
      </svg>
      
      {showLabel && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center",
          fontSize,
          "font-bold text-white"
        )}>
          {Math.round(value)}%
        </div>
      )}
    </div>
  );
};
