
import React from "react";

interface StatsCardProps {
  title: string;
  value: number;
  bgClass: string;
  textClass: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, bgClass, textClass }) => {
  return (
    <div className={`p-4 rounded-lg ${bgClass}`}>
      <h3 className={`text-lg font-medium ${textClass}`}>{value}</h3>
      <p className={`text-sm ${textClass} opacity-90`}>{title}</p>
    </div>
  );
};

export default StatsCard;
