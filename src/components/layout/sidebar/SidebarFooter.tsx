/**
 * NEXUS Sidebar Footer
 * Minimal footer - just settings access (user info is in top bar)
 */

import React from "react";
import { SidebarFooter as BaseSidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  isCollapsed
}) => {
  if (isCollapsed) {
    return (
      <BaseSidebarFooter className="border-t border-slate-700/30 p-2">
        <div className="flex flex-col items-center gap-1.5">
          <ThemeToggle sidebarTheme />
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="h-9 w-9 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-white"
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
    <BaseSidebarFooter className="border-t border-slate-700/30 p-3">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          asChild 
          className="flex-1 justify-start gap-2 h-9 text-slate-400 hover:text-white hover:bg-slate-800/70 rounded-lg"
        >
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            <span className="text-sm">Settings</span>
          </Link>
        </Button>
        <ThemeToggle sidebarTheme />
      </div>
    </BaseSidebarFooter>
  );
};

export default SidebarFooter;
