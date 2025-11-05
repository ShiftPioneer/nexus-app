import React from "react";
import { cn } from "@/lib/utils";
import { backgrounds, radius, shadows, padding, hover, transitions } from "@/styles/design-tokens";

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "glass" | "elevated";
  noPadding?: boolean;
  children: React.ReactNode;
  asButton?: boolean;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ variant = "primary", noPadding = false, className, children, asButton = false, onClick, ...props }, ref) => {
    const baseClasses = cn(
      // Background and border based on variant
      variant === "primary" && backgrounds.card.primary,
      variant === "secondary" && backgrounds.card.secondary,
      variant === "glass" && backgrounds.card.glass,
      variant === "elevated" && backgrounds.elevated,
      
      // Common styles
      radius.large,
      shadows.large,
      !noPadding && padding.card.desktop,
      
      // Mobile padding adjustment
      !noPadding && "sm:p-6 p-4",
      
      // Interactive effects
      transitions.default,
      hover.lift,
      hover.scale,
      "hover:border-slate-600/70",
      
      // Cursor for interactive cards
      (onClick || asButton) && "cursor-pointer",
      
      // Custom className
      className
    );

    return (
      <div 
        ref={ref} 
        className={baseClasses} 
        onClick={onClick}
        role={asButton ? "button" : undefined}
        tabIndex={asButton ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

InteractiveCard.displayName = "InteractiveCard";
