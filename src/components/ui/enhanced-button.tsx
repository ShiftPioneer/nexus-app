import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { variants, iconSizes } from "@/styles/design-tokens";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "success" | "glow";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-6 py-3 text-base gap-2.5",
};

const iconSizeMap = {
  sm: iconSizes.sm,
  md: iconSizes.md,
  lg: iconSizes.lg,
};

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    icon: Icon, 
    iconPosition = "left",
    children, 
    variant = "primary", 
    size = "md",
    isLoading = false, 
    disabled = false, 
    className,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      "inline-flex items-center justify-center font-semibold rounded-xl",
      "transition-all duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      "active:scale-95 active:shadow-inner",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      sizeClasses[size],
      variants.button[variant],
      !isLoading && !disabled && "hover:scale-105",
      className
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isLoading && !disabled && onClick) {
        onClick(e);
      }
    };

    const iconElement = isLoading ? (
      <Loader2 className={cn(iconSizeMap[size], "animate-spin")} />
    ) : Icon ? (
      <Icon className={iconSizeMap[size]} />
    ) : null;

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        onClick={handleClick}
        {...props}
      >
        {iconPosition === "left" && iconElement}
        {children}
        {iconPosition === "right" && iconElement}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
