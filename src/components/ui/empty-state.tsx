import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { typography, radius, padding } from "@/styles/design-tokens";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        padding.section.vertical,
        className
      )}
    >
      <div
        className={cn(
          "w-20 h-20 rounded-full",
          "bg-slate-800/50 backdrop-blur-sm",
          "border border-slate-700/50",
          "flex items-center justify-center mb-6",
          "animate-fade-in",
          iconClassName
        )}
      >
        <Icon className="h-10 w-10 text-slate-400" />
      </div>

      <h3 className={cn(typography.sectionHeader.medium, "text-white mb-2")}>
        {title}
      </h3>

      {description && (
        <p className={cn(typography.description, "max-w-md mb-6")}>
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
