
import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  bgClass: string;
  textClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgClass, textClass }) => {
  return (
    <div className={`p-4 rounded-xl ${bgClass} border border-slate-700/30 backdrop-blur-sm`}>
      <div className={`text-2xl font-bold ${textClass} mb-1`}>{value}</div>
      <div className="text-sm text-slate-400">{title}</div>
    </div>
  );
};

export default StatsCard;
