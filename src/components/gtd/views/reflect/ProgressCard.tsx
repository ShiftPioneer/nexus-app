
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface ProgressCardProps {
  title: string;
  value: number;
  total?: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  subtitle?: string;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ 
  title, 
  value, 
  total, 
  color, 
  bgColor, 
  icon, 
  subtitle 
}) => {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
            <div className={color}>
              {icon}
            </div>
          </div>
          <div className="flex-1">
            <div className={`text-3xl font-bold ${color} mb-1`}>
              {value}{total && `/${total}`}
            </div>
            <div className="text-slate-400 font-medium">{title}</div>
            {subtitle && (
              <div className="text-xs text-slate-500 mt-1">{subtitle}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
