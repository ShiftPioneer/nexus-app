import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface UnifiedCardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
  stagger?: boolean;
}

const columnClasses = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

const gapClasses = {
  sm: "gap-3 sm:gap-4",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

export const UnifiedCardGrid: React.FC<UnifiedCardGridProps> = ({
  children,
  columns = 3,
  gap = "md",
  className,
  stagger = true,
}) => {
  const childArray = React.Children.toArray(children);

  if (stagger) {
    return (
      <div
        className={cn(
          "grid",
          columnClasses[columns],
          gapClasses[gap],
          className
        )}
      >
        {childArray.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
          >
            {child}
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  );
};

// Card wrapper with consistent hover effects
interface UnifiedCardWrapperProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const UnifiedCardWrapper: React.FC<UnifiedCardWrapperProps> = ({
  children,
  className,
  onClick,
  interactive = true,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm",
        "transition-all duration-300",
        interactive && [
          "hover:border-slate-600/70",
          "hover:bg-slate-800/60",
          "hover:-translate-y-1",
          "hover:shadow-xl",
          "hover:shadow-primary/5",
          "cursor-pointer",
        ],
        className
      )}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
      </div>
      {children}
    </div>
  );
};

// Skeleton loader for card grids
interface CardGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  cardHeight?: string;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  count = 6,
  columns = 3,
  gap = "md",
  cardHeight = "h-48",
}) => {
  return (
    <div
      className={cn(
        "grid",
        columnClasses[columns],
        gapClasses[gap]
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "rounded-xl border border-slate-700/50",
            cardHeight
          )}
        />
      ))}
    </div>
  );
};

// Auto-fill grid for variable content
interface AutoFillGridProps {
  children: React.ReactNode;
  minWidth?: string;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export const AutoFillGrid: React.FC<AutoFillGridProps> = ({
  children,
  minWidth = "280px",
  gap = "md",
  className,
}) => {
  return (
    <div
      className={cn(
        "grid",
        gapClasses[gap],
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

// Stats grid - always 4 columns with responsive behavior
interface StatsGridProps {
  children: React.ReactNode;
  className?: string;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6",
        className
      )}
    >
      {children}
    </div>
  );
};
