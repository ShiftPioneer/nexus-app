
import React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";
import RecentlyVisited from "./sidebar/RecentlyVisited";

interface ModernSidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isCollapsed,
  isMobile,
  onToggle
}) => {
  const { user } = useAuth();
  
  return (
    <aside className={cn(
      "bg-slate-950 border-r border-slate-700/50 transition-all duration-300 ease-out flex-shrink-0 relative h-full flex flex-col shadow-xl",
      // Desktop behavior
      !isMobile && (isCollapsed ? "w-16" : "w-60"),
      // Mobile behavior - full overlay when open, completely hidden when closed
      isMobile && (
        isCollapsed 
          ? "-translate-x-full w-0 opacity-0 pointer-events-none" 
          : "fixed inset-y-0 left-0 w-72 z-50 translate-x-0 opacity-100"
      ),
      // Enhanced shadows and backdrop
      isMobile && !isCollapsed && "shadow-2xl backdrop-blur-sm"
    )}>
      <SidebarHeader isCollapsed={isCollapsed && !isMobile} onToggle={onToggle} />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <SidebarNavigation isCollapsed={isCollapsed && !isMobile} />
        <RecentlyVisited isCollapsed={isCollapsed && !isMobile} />
        <SidebarFooter isCollapsed={isCollapsed && !isMobile} />
      </div>
    </aside>
  );
};

export default ModernSidebar;
