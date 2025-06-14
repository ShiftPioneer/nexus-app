
import React from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarNavigation from "./sidebar/SidebarNavigation";
import SidebarFooter from "./sidebar/SidebarFooter";

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
  const sidebarWidth = isCollapsed ? "w-20" : "w-72";

  return (
    <aside className={cn(
      "bg-slate-950 border-r border-slate-700 transition-all duration-300 ease-out flex-shrink-0 relative h-full flex flex-col shadow-lg",
      sidebarWidth,
      isMobile ? (isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50") : "relative"
    )}>
      <SidebarHeader isCollapsed={isCollapsed} onToggle={onToggle} />
      
      <div className="flex flex-col flex-1">
        <SidebarNavigation isCollapsed={isCollapsed} />
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
};

export default ModernSidebar;
