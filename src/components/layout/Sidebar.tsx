
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

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Planning",
      path: "/planning",
      icon: Target,
    },
    {
      title: "Tasks",
      path: "/tasks",
      icon: CheckCircle,
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock,
    },
    {
      title: "Energy",
      path: "/energy",
      icon: Zap,
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Sparkles,
    },
    {
      title: "Journal",
      path: "/journal",
      icon: BookOpen,
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Brain,
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: LayoutGrid,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      <ShadcnSidebar
        variant="sidebar"
        collapsed={isCollapsed}
        collapsible={true}
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
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={currentPath === item.path}
                  tooltip={item.title}
                >
                  <Link to={item.path} className="w-full">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter />
      </ShadcnSidebar>
    </>
  );
};

export default Sidebar;
