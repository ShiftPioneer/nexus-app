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
        "relative overflow-hidden rounded-xl sm:rounded-2xl",
        "border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm",
        "shadow-xl min-h-[80px] sm:min-h-[100px] md:min-h-[120px]",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10`} />
      
      {/* Ambient glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${gradient} opacity-20 blur-3xl rounded-full`} />
      
      <div className="relative p-4 sm:p-6 md:p-8 h-full flex items-center">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Icon */}
          <motion.div 
            className={cn(
              "flex h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 items-center justify-center rounded-xl sm:rounded-2xl",
              "bg-gradient-to-br shadow-lg flex-shrink-0",
              gradient
            )}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
          </motion.div>
          
          {/* Content */}
          <div className="min-w-0 flex-1">
            <motion.h1 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              {title}
            </motion.h1>
            <motion.p 
              className="text-sm sm:text-base md:text-lg text-slate-300 line-clamp-2 mt-0.5 sm:mt-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {description}
            </motion.p>
          </div>
          
          {/* Optional action */}
          {action && (
            <motion.div
              className="flex-shrink-0 mt-2 sm:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              {action}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};