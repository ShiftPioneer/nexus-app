
import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface UnifiedActionButtonProps {
  onClick: () => void;
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export const UnifiedActionButton: React.FC<UnifiedActionButtonProps> = ({
  onClick,
  icon: Icon,
  children,
  variant = "primary",
  className = "",
  disabled = false
}) => {
  if (variant === "primary") {
    return (
      <Button
        onClick={onClick}
        disabled={disabled}
        className={`gap-2 bg-gradient-to-r from-primary via-orange-500 to-red-500 hover:from-primary/90 hover:via-orange-500/90 hover:to-red-500/90 text-white shadow-xl shadow-primary/25 border-none rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${className}`}
      >
        <Icon className="h-5 w-5" />
        {children}
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="outline"
      className={`gap-2 border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50 text-slate-300 hover:text-white rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${className}`}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Button>
  );
};
