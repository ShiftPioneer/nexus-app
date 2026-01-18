/**
 * NEXUS Sidebar Footer
 * Simplified footer with user profile and settings (gamification moved to top bar)
 */

import React from "react";
import { SidebarFooter as BaseSidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed
}) => {
  const { user } = useUser();
  
  if (isCollapsed) {
    return (
      <BaseSidebarFooter className="border-t border-slate-700/30 p-2">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-8 w-8 border-2 border-slate-700">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
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
      {/* User Profile - Simplified */}
      <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
        <Avatar className="h-10 w-10 border-2 border-slate-700">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            {user?.displayName || "User"}
          </p>
          <p className="text-xs text-slate-400 truncate">
            Pro Account
          </p>
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
