import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type EmptyStateVariant = "onboarding" | "zero-data" | "filtered";

interface EnhancedEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  variant?: EmptyStateVariant;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

const variantStyles: Record<EmptyStateVariant, { iconBg: string; iconColor: string }> = {
  onboarding: {
    iconBg: "bg-primary/10 border-primary/20",
    iconColor: "text-primary",
  },
  "zero-data": {
    iconBg: "bg-slate-800/50 border-slate-700/50",
    iconColor: "text-slate-400",
  },
  filtered: {
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
};

const variantMessages: Record<EmptyStateVariant, { title: string; description: string }> = {
  onboarding: {
    title: "Get started!",
    description: "Create your first item to begin your journey.",
  },
  "zero-data": {
    title: "Nothing here yet",
    description: "Items you create will appear here.",
  },
  filtered: {
    title: "No matches found",
    description: "Try adjusting your filters or search criteria.",
  },
};

export const EnhancedEmptyState: React.FC<EnhancedEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  variant = "zero-data",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  const styles = variantStyles[variant];
  const defaultMessages = variantMessages[variant];

  return (
    <motion.div
      className={cn("empty-state", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Animated Icon Container */}
      <motion.div
        className={cn(
          "empty-state-icon border",
          styles.iconBg
        )}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <Icon className={cn("h-8 w-8 sm:h-10 sm:w-10", styles.iconColor)} />
      </motion.div>

      {/* Title */}
      <motion.h3
        className="empty-state-title"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {title || defaultMessages.title}
      </motion.h3>

      {/* Description */}
      <motion.p
        className="empty-state-description"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {description || defaultMessages.description}
      </motion.p>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {actionLabel && onAction && (
            <Button
              onClick={onAction}
              className="bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25"
            >
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button
              onClick={onSecondaryAction}
              variant="outline"
              className="border-slate-600/50 hover:bg-slate-700/30 text-slate-300"
            >
              {secondaryActionLabel}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedEmptyState;
