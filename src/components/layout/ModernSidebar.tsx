
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
  
  return (
    <aside className={cn(
      "sidebar-glass border-r border-slate-700/30 transition-all duration-300 ease-out flex-shrink-0 relative h-full flex flex-col",
      // Desktop behavior
      !isMobile && (isCollapsed ? "w-16" : "w-60"),
      // Mobile behavior - full overlay when open, completely hidden when closed
      isMobile && (
        isCollapsed 
          ? "-translate-x-full w-0 opacity-0 pointer-events-none" 
          : "fixed inset-y-0 left-0 w-72 z-50 translate-x-0 opacity-100"
      ),
      // Enhanced shadows for depth
      isMobile && !isCollapsed && "shadow-2xl shadow-black/50"
    )}>
      {/* Ambient glow effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <SidebarHeader isCollapsed={isCollapsed && !isMobile} onToggle={onToggle} />
      
      <div className="flex flex-col flex-1 overflow-hidden relative z-10">
        <SidebarNavigation isCollapsed={isCollapsed && !isMobile} />
        <SidebarFooter isCollapsed={isCollapsed && !isMobile} />
      </div>
    </aside>
  );
};

export default ModernSidebar;
