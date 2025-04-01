import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import NavigationMenu from "./NavigationMenu";
import { cn } from "@/lib/utils";
interface SidebarProps {
  collapsed?: boolean;
}
const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return <ShadcnSidebar variant="sidebar" className={cn("transition-all duration-300", isCollapsed ? 'collapsed' : '',
  // Add smooth scrolling and hide scrollbar
  "[&_[data-sidebar=content]]:scrollbar-none")} style={{
    '--sidebar-width': '14rem',
    '--sidebar-width-collapsed': '4rem'
  } as React.CSSProperties} data-collapsed={isCollapsed}>
      <SidebarRail>
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-center py-4">
            
          </div>
        </div>
      </SidebarRail>
      <SidebarContent className="px-[12px] py-[24px] scrollbar-none">
        <NavigationMenu />
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>;
};
export default Sidebar;