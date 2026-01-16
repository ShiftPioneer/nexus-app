
import React from "react";
import { SidebarFooter as BaseSidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
import { useGamification } from "@/hooks/use-gamification";
import UserProgressRing from "./UserProgressRing";
import { motion } from "framer-motion";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed
}) => {
  const { user } = useUser();
  const { currentXP, level, nextLevelXP, levelXP, streakDays } = useGamification();
  
  // Calculate progress percentage for current level
  const xpProgress = ((currentXP - levelXP) / (nextLevelXP - levelXP)) * 100;
  
  if (isCollapsed) {
    return (
      <BaseSidebarFooter className="border-t border-slate-700/30 p-2">
        <div className="flex flex-col items-center gap-2">
          <UserProgressRing progress={xpProgress} size={40} strokeWidth={2}>
            <Avatar className="h-8 w-8 border-2 border-slate-700">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </UserProgressRing>
          <div className="w-full">
            <ThemeToggle sidebarTheme />
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="h-8 w-8 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
          >
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </BaseSidebarFooter>
    );
  }
  
  return (
    <BaseSidebarFooter className="border-t border-slate-700/30 p-4 space-y-3">
      {/* User Profile with Progress Ring */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
        <UserProgressRing progress={xpProgress} size={48} strokeWidth={3}>
          <Avatar className="h-10 w-10 border-2 border-slate-700">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </UserProgressRing>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.displayName || "User"}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-primary font-semibold">Lv. {level}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400">{currentXP} XP</span>
          </div>
        </div>
        
        {/* Streak indicator */}
        {streakDays > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400"
          >
            <span className="text-xs">🔥</span>
            <span className="text-xs font-semibold">{streakDays}</span>
          </motion.div>
        )}
      </div>
      
      {/* XP Progress Bar */}
      <div className="px-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Level {level}</span>
          <span>{currentXP}/{nextLevelXP} XP</span>
        </div>
        <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild className="flex-1 justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800">
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
        <ThemeToggle sidebarTheme />
      </div>
    </BaseSidebarFooter>
  );
};

export default SidebarFooter;
