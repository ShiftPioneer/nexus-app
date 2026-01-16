/**
 * NEXUS User Progress Ring
 * Displays XP progress in a circular ring around the user avatar
 */

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  children: React.ReactNode;
  className?: string;
}

const UserProgressRing: React.FC<UserProgressRingProps> = ({
  progress,
  size = 48,
  strokeWidth = 3,
  children,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      {/* Background ring */}
      <svg
        width={size}
        height={size}
        className="absolute transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700/50"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(25, 95%, 60%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Avatar content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default UserProgressRing;
