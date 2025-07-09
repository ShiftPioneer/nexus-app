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
  return <div className="mb-8 bg-slate-900">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {title}
      </h1>
      <p className="text-slate-400 mt-3 text-lg">{description}</p>
    </div>;
};