/**
 * NEXUS Loading Dots Component
 * Animated three-dot loading indicator
 */

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "white" | "slate";
  className?: string;
}

const sizeMap = {
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-3 h-3",
};

const variantMap = {
  primary: "bg-primary",
  white: "bg-white",
  slate: "bg-slate-400",
};

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = "md",
  variant = "primary",
  className = "",
}) => {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeMap[size],
          variantMap[variant]
        )}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeMap[size],
          variantMap[variant]
        )}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={cn(
          "rounded-full animate-bounce",
          sizeMap[size],
          variantMap[variant]
        )}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
};
