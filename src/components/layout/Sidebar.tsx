import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import NavigationMenu from "./NavigationMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface SidebarProps {
  collapsed?: boolean;
}
const Sidebar: React.FC<SidebarProps> = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  return <div className="relative h-screen">
      <ShadcnSidebar variant="sidebar" className={cn("transition-all duration-300 bg-[#1A1F2C] text-white border-r border-[#2A2F3C]", isCollapsed ? 'collapsed w-[4rem]' : 'w-[14rem]', "[&_[data-sidebar=content]]:scrollbar-none")} style={{
      '--sidebar-width': '14rem',
      '--sidebar-width-collapsed': '4rem'
    } as React.CSSProperties} data-collapsed={isCollapsed}>
        
        
        <SidebarContent className="px-2 py-4 scrollbar-none">
          <div className={cn("flex items-center justify-between mb-6 px-2", isCollapsed ? "justify-center" : "")}>
            {!isCollapsed && <>
                <h1 className="text-xl font-bold text-[#FF5722]">NEXUS</h1>
                <span className="p-1 cursor-pointer hover:bg-[#2A2F3C] rounded-md transition-colors" onClick={handleToggleCollapse}>
                  <ChevronLeft className="h-5 w-5 text-[#0FA0CE]" />
                </span>
              </>}
          </div>
          
          <NavigationMenu isCollapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-[#2A2F3C] p-3">
          <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
            <Avatar className="h-8 w-8 bg-[#FF5722]/20 text-[#FF5722]">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            {!isCollapsed && <div className="flex flex-col">
                <span className="text-sm font-medium">John Doe</span>
                <span className="text-xs text-[#0FA0CE]">Pro Plan</span>
              </div>}
          </div>
        </SidebarFooter>
      </ShadcnSidebar>
    </div>;
};
export default Sidebar;