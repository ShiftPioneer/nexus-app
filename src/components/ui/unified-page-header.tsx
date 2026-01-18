import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UnifiedPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  action?: React.ReactNode;
  className?: string;
}

export const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  gradient,
  action,
  className
}) => {
  return (
    <motion.div 
      className={cn(
        "relative overflow-hidden rounded-xl",
        "border border-slate-700/30 bg-background",
        "min-h-[70px] sm:min-h-[80px]",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`} />
      
      <div className="relative p-4 sm:p-5 h-full flex items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full">
          {/* Icon */}
          <motion.div 
            className={cn(
              "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
              "bg-gradient-to-br shadow-lg flex-shrink-0",
              gradient
            )}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </motion.div>
          
          {/* Content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
              {description}
            </p>
          </div>
          
          {/* Optional action */}
          {action && (
            <div className="flex-shrink-0 mt-2 sm:mt-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};