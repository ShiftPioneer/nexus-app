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
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10`} />
      <div className="relative p-8">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            <p className="text-lg text-slate-300">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};