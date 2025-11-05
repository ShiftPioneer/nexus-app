import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { variants } from "@/styles/design-tokens";

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    icon: Icon, 
    children, 
    variant = "primary", 
    isLoading = false, 
    disabled = false, 
    className,
    onClick,
    ...props 
  }, ref) => {
    const baseClasses = cn(
      "gap-2 rounded-xl px-6 py-3 font-semibold",
      "transition-all duration-300",
      "active:scale-95 active:shadow-inner",
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
      variant === "primary" && variants.button.primary,
      variant === "secondary" && cn(
        variants.button.secondary,
        "border-2 border-slate-600 hover:border-primary/50"
      ),
      variant === "ghost" && variants.button.ghost,
      !isLoading && !disabled && "hover:scale-105",
      className
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isLoading && !disabled && onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={baseClasses}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : Icon ? (
          <Icon className="h-5 w-5" />
        ) : null}
        {children}
      </Button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
