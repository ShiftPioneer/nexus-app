
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Target, CheckCircle, Clock, Zap, Sparkles, BookOpen, Brain, LayoutGrid, Settings, Calendar, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarStyles = `
  /* Hide scrollbar but keep functionality */
  .sidebar-scroll-area {
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scroll-behavior: smooth;
  }
  
  .sidebar-scroll-area::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }
  
  /* Hover effect for buttons */
  .sidebar-menu-button {
    transition: all 0.2s ease;
  }
  
  .sidebar-menu-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  }
  
  /* Sidebar collapsed styling */
  .sidebar-collapsed {
    width: 60px !important;
    overflow: visible;
  }
  
  .sidebar-collapsed .menu-text {
    display: none;
  }
  
  .sidebar-collapsed .sidebar-toggle {
    transform: rotate(180deg);
  }
  
  .sidebar-icon-visible {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 50;
  }
`;

const NavigationMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [{
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  }, {
    title: "Planning",
    path: "/planning",
    icon: Target
  }, {
    title: "Tasks",
    path: "/tasks",
    icon: CheckCircle
  }, {
    title: "Habits",
    path: "/habits",
    icon: Calendar
  }, {
    title: "Time Design",
    path: "/time-design",
    icon: Clock
  }, {
    title: "Energy",
    path: "/energy",
    icon: Zap
  }, {
    title: "Focus",
    path: "/focus",
    icon: Sparkles
  }, {
    title: "Journal",
    path: "/journal",
    icon: BookOpen
  }, {
    title: "Mindset",
    path: "/mindset",
    icon: Brain
  }, {
    title: "Knowledge",
    path: "/knowledge",
    icon: LayoutGrid
  }, {
    title: "Settings",
    path: "/settings",
    icon: Settings
  }];
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return (
    <>
      <style>{sidebarStyles}</style>
      <div className={cn("relative", collapsed ? "sidebar-collapsed" : "")}>
        {collapsed && (
          <div 
            className="sidebar-icon-visible cursor-pointer bg-background p-1 rounded-full border shadow-sm"
            onClick={toggleSidebar}
          >
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
        
        <SidebarMenu className="sidebar-scroll-area">
          {!collapsed && (
            <div className="flex justify-end p-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-6 w-6 p-0 rounded-full"
              >
                <ChevronRight className="h-4 w-4 sidebar-toggle" />
              </Button>
            </div>
          )}
          
          {menuItems.map(item => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={currentPath === item.path} 
                tooltip={collapsed ? item.title : undefined}
                className={cn(
                  "hover:bg-muted/70 transition-all duration-200 sidebar-menu-button",
                  currentPath === item.path ? "bg-muted/50" : ""
                )}
              >
                <Link to={item.path} className="w-full">
                  <item.icon className="h-4 w-4" />
                  <span className="text-xl font-normal py-[15px] my-[15px] text-accent-dark text-center menu-text">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </div>
    </>
  );
};

export default NavigationMenu;
