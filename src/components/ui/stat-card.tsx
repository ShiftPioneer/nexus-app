import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  progress?: number;
  progressColor?: string;
  iconBgColor?: string;
  iconColor?: string;
  index?: number;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  progress = 0,
  progressColor = "bg-primary",
  iconBgColor = "bg-primary/20",
  iconColor = "text-primary",
  index = 0,
  className,
}) => {
  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-xl p-3 sm:p-4 md:p-5",
        "bg-slate-900/40 backdrop-blur-md border border-slate-700/40",
        "transition-all duration-300 group",
        "hover:border-slate-600/60 hover:bg-slate-800/50",
        "hover:shadow-xl hover:-translate-y-0.5",
        className
      )}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn(
          "absolute -top-10 -right-10 w-20 h-20 rounded-full blur-2xl",
          iconBgColor?.replace('/20', '/10') || "bg-primary/10"
        )} />
      </div>
      
      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Header: Title and Icon */}
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-slate-400 truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1 truncate">{value}</h3>
        </div>
        <motion.div 
          className={cn(
            "rounded-xl p-2 sm:p-3 flex-shrink-0 transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            iconBgColor, 
            iconColor
          )}
          whileHover={{ rotate: 5 }}
        >
          <Icon className="h-4 w-4 sm:h-5 md:h-6 sm:w-5 md:w-6" />
        </motion.div>
      </div>

      {/* Progress Section */}
      <div className="relative mt-3 sm:mt-4">
        <div className="h-1.5 sm:h-2 w-full rounded-full bg-slate-700/50 overflow-hidden">
          <motion.div
            className={cn(
              "h-full rounded-full relative overflow-hidden",
              progressColor
            )}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{
              duration: 1.2,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.3 + index * 0.08,
            }}
          >
            {/* Progress bar shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer-slide_2s_infinite]" />
          </motion.div>
        </div>
        {subtitle && (
          <p className="text-[10px] sm:text-xs text-slate-500 mt-1.5 sm:mt-2 truncate">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

// Stat card grid container
interface StatCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ children, className }) => {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6", className)}>
      {children}
    </div>
  );
};

export default StatCard;
