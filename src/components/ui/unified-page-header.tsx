import React from "react";
import { LucideIcon } from "lucide-react";

interface UnifiedPageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
}

export const UnifiedPageHeader: React.FC<UnifiedPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  gradient
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10`} />
      <div className="relative p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`flex h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-r ${gradient} shadow-lg flex-shrink-0`}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white truncate">{title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 line-clamp-2">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};