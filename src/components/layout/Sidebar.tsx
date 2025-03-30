
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Target,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  BookOpen,
  Brain,
  LayoutGrid,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import NavigationMenu from "./NavigationMenu";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <ShadcnSidebar
      variant="sidebar"
      collapsed={isCollapsed}
      collapsible="icon"
      className="transition-all duration-300"
      style={{
        '--sidebar-width': '14rem',
        '--sidebar-width-collapsed': '4rem'
      } as React.CSSProperties}
    >
      <SidebarRail>
        <div className="h-full flex flex-col justify-between">
          <div className="flex justify-center py-4">
            <Button 
              size="icon" 
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-full h-8 w-8"
            >
              {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          </div>
        </div>
      </SidebarRail>
      <SidebarContent>
        <NavigationMenu />
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
};

export default Sidebar;
