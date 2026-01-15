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
        "stat-card p-3 sm:p-4 md:p-5",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      {/* Header: Title and Icon */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col min-w-0 flex-1">
          <p className="stat-label truncate">{title}</p>
          <h3 className="stat-value mt-0.5 sm:mt-1 truncate">{value}</h3>
        </div>
        <div className={cn("rounded-lg p-2 sm:p-3 flex-shrink-0", iconBgColor, iconColor)}>
          <Icon className="h-4 w-4 sm:h-5 md:h-6 sm:w-5 md:w-6" />
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-3 sm:mt-4">
        <div className="micro-progress">
          <motion.div
            className={cn("micro-progress-bar", progressColor)}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{
              duration: 1,
              ease: "circOut",
              delay: 0.5 + index * 0.1,
            }}
          />
        </div>
        {subtitle && (
          <p className="stat-change mt-1.5 sm:mt-2 truncate">{subtitle}</p>
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
