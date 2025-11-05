import React from "react";
import { cn } from "@/lib/utils";
import { radius, padding, backgrounds } from "@/styles/design-tokens";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-slate-800/50 rounded",
        className
      )}
    />
  );
};

export const SkeletonCard: React.FC<{ variant?: "primary" | "compact" }> = ({ 
  variant = "primary" 
}) => {
  return (
    <div
      className={cn(
        backgrounds.card.primary,
        radius.large,
        variant === "primary" ? padding.card.desktop : padding.card.compact,
        "animate-pulse"
      )}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonStat: React.FC = () => {
  return (
    <div
      className={cn(
        backgrounds.card.primary,
        radius.large,
        padding.card.desktop,
        "animate-pulse"
      )}
    >
      <div className="space-y-3">
        <Skeleton className="h-10 w-10 rounded-lg mx-auto" />
        <Skeleton className="h-8 w-16 mx-auto" />
        <Skeleton className="h-4 w-24 mx-auto" />
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number; cols?: number }> = ({ 
  rows = 5, 
  cols = 4 
}) => {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={`header-${i}`} className="h-10" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-12" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Shimmer effect skeleton with gradient animation
export const SkeletonShimmer: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-800/50 rounded",
        className
      )}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
        }}
      />
    </div>
  );
};
