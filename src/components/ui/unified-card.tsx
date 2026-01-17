import React from "react";
import { cn } from "@/lib/utils";
import { backgrounds, radius, shadows, padding } from "@/styles/design-tokens";
import { motion } from "framer-motion";

interface UnifiedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "interactive" | "glass" | "elevated" | "futuristic";
  noPadding?: boolean;
  animated?: boolean;
  glowOnHover?: boolean;
  children: React.ReactNode;
}

export const UnifiedCard = React.forwardRef<HTMLDivElement, UnifiedCardProps>(
  ({ variant = "primary", noPadding = false, animated = false, glowOnHover = false, className, children, ...props }, ref) => {
    const baseClasses = cn(
      // Background and border based on variant
      variant === "primary" && backgrounds.card.primary,
      variant === "secondary" && backgrounds.card.secondary,
      variant === "interactive" && backgrounds.card.interactive,
      variant === "glass" && backgrounds.card.glass,
      variant === "elevated" && backgrounds.elevated,
      variant === "futuristic" && "glass-futuristic",
      
      // Common styles
      radius.large,
      shadows.large,
      !noPadding && padding.card.desktop,
      
      // Mobile padding adjustment
      !noPadding && "sm:p-6 p-4",
      
      // Glow on hover
      glowOnHover && "border-glow",
      
      // Custom className
      className
    );

    if (animated) {
      return (
        <motion.div 
          ref={ref as any} 
          className={baseClasses}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          {...(props as any)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    );
  }
);

UnifiedCard.displayName = "UnifiedCard";

interface UnifiedCardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  glowTitle?: boolean;
}

export const UnifiedCardHeader: React.FC<UnifiedCardHeaderProps> = ({
  title,
  description,
  action,
  className,
  glowTitle = false,
}) => {
  return (
    <div className={cn("flex items-start justify-between mb-6", className)}>
      <div className="space-y-1">
        <h3 className={cn(
          "text-xl font-semibold text-white",
          glowTitle && "text-glow"
        )}>{title}</h3>
        {description && (
          <p className="text-sm text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

interface UnifiedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const UnifiedCardContent: React.FC<UnifiedCardContentProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {children}
    </div>
  );
};

interface UnifiedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const UnifiedCardFooter: React.FC<UnifiedCardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex items-center justify-between mt-6 pt-4 border-t border-slate-700/50", className)} {...props}>
      {children}
    </div>
  );
};
