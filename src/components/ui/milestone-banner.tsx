/**
 * NEXUS Milestone Banner Component
 * Full-width celebration banner for major achievements
 */

import React, { useEffect, useState } from "react";
import { X, Trophy, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

interface MilestoneBannerProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  visible?: boolean;
  onClose?: () => void;
  duration?: number; // Auto-hide after duration (ms), 0 = manual close only
  variant?: "success" | "primary" | "gold";
}

const variantMap = {
  success: "from-success/20 to-success/5 border-success/30",
  primary: "from-primary/20 to-primary/5 border-primary/30",
  gold: "from-yellow-500/20 to-yellow-500/5 border-yellow-500/30",
};

export const MilestoneBanner: React.FC<MilestoneBannerProps> = ({
  title,
  description,
  icon,
  visible = false,
  onClose,
  duration = 5000,
  variant = "gold",
}) => {
  const [show, setShow] = useState(visible);

  useEffect(() => {
    setShow(visible);
    
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!show) return null;

  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl mx-auto px-4",
      "animate-slide-in-right"
    )}>
      <div className={cn(
        "relative overflow-hidden rounded-2xl border backdrop-blur-lg",
        "bg-gradient-to-r shadow-2xl",
        variantMap[variant],
        "animate-scale-in"
      )}>
        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Sparkles className="absolute top-2 right-4 h-6 w-6 text-yellow-400 animate-pulse" />
          <Sparkles className="absolute bottom-3 left-6 h-4 w-4 text-yellow-300 animate-pulse delay-100" />
          <Sparkles className="absolute top-1/2 left-12 h-5 w-5 text-yellow-200 animate-pulse delay-200" />
        </div>

        <div className="relative flex items-center gap-4 p-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            {icon || (
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 animate-pulse-slow">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-white mb-1">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-slate-300">
                {description}
              </p>
            )}
          </div>

          {/* Close button */}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShow(false);
                onClose();
              }}
              className="flex-shrink-0 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
