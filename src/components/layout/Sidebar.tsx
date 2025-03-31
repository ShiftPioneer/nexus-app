import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarRail } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import NavigationMenu from "./NavigationMenu";
interface SidebarProps {
  collapsed?: boolean;
}
const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  return <ShadcnSidebar variant="sidebar"
  // Remove the collapsed prop as it doesn't exist in the type definition
  // Use data attributes to control the collapsed state
  className={`transition-all duration-300 ${isCollapsed ? 'collapsed' : ''}`} style={{
    '--sidebar-width': '14rem',
    '--sidebar-width-collapsed': '4rem'
  } as React.CSSProperties} data-collapsed={isCollapsed}>
      <SidebarRail>
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-center py-4">
            <Button size="icon" variant="ghost" onClick={() => setIsCollapsed(!isCollapsed)} className="rounded-full h-8 w-8">
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
        </div>
      </SidebarRail>
      <SidebarContent className="px-[12px] py-[24px]">
        <NavigationMenu />
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>;
};
export default Sidebar;