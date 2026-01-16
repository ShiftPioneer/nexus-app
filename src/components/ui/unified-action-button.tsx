import React from "react";
import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { variants, iconSizes } from "@/styles/design-tokens";

type ActionVariant = "primary" | "secondary" | "ghost" | "destructive" | "success";

interface UnifiedActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: ActionVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2.5 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3 text-base gap-2.5 rounded-xl",
};

const iconSizeMap = {
  sm: iconSizes.sm,
  md: iconSizes.md,
  lg: iconSizes.lg,
};

export const UnifiedActionButton: React.FC<UnifiedActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  isLoading = false,
}) => {
  const baseClasses = cn(
    "inline-flex items-center justify-center font-semibold",
    "transition-all duration-300 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "active:scale-95",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    sizeClasses[size],
    variants.button[variant],
    !isLoading && !disabled && "hover:scale-105",
    className
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={baseClasses}
    >
      {isLoading ? (
        <Loader2 className={cn(iconSizeMap[size], "animate-spin")} />
      ) : (
        <Icon className={iconSizeMap[size]} />
      )}
      {children}
    </button>
  );
};
