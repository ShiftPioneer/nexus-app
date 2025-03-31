
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { LayoutDashboard, Target, CheckCircle, Clock, Zap, Sparkles, BookOpen, Brain, LayoutGrid, Settings, Calendar, ChevronRight, Menu } from "lucide-react";
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
    position: fixed;
    top: 0.5rem;
    left: 0;
    z-index: 50;
    border-radius: 0 8px 8px 0;
    padding: 8px 5px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  /* App logo styling */
  .app-logo {
    font-weight: bold;
    font-size: 18px;
    padding: 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  /* Partially visible sidebar */
  .sidebar-tab {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background-color: var(--background);
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    border: 1px solid var(--border);
    border-left: none;
    padding: 10px 5px;
    cursor: pointer;
    z-index: 100;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .sidebar-tab:hover {
    background-color: var(--accent);
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
      <div className={cn("relative h-full", collapsed ? "sidebar-collapsed" : "")}>
        {collapsed && (
          <div 
            className="sidebar-tab"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5 text-primary" />
          </div>
        )}
        
        <SidebarMenu className="sidebar-scroll-area border-r h-full shadow-sm">
          {!collapsed && (
            <div className="app-logo border-b bg-primary/5">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span className="text-orange-600">Life OS</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleSidebar} 
                className="h-6 w-6 p-0 rounded-full hover:bg-orange-100"
              >
                <ChevronRight className="h-4 w-4 sidebar-toggle" />
              </Button>
            </div>
          )}
          
          <div className={cn("py-2", collapsed ? "px-2" : "px-0")}>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  asChild 
                  isActive={currentPath === item.path} 
                  tooltip={collapsed ? item.title : undefined}
                  className={cn(
                    "hover:bg-orange-100/70 transition-all duration-200 sidebar-menu-button",
                    currentPath === item.path ? "bg-orange-100/80 text-orange-700" : "",
                    collapsed ? "justify-center" : "px-4"
                  )}
                >
                  <Link to={item.path} className="w-full">
                    <item.icon className={cn("h-5 w-5", currentPath === item.path ? "text-orange-500" : "")} />
                    <span className={cn(
                      "text-base font-normal py-[12px] text-center menu-text transition-colors",
                      currentPath === item.path ? "text-orange-600" : ""
                    )}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>
      </div>
    </>
  );
};

export default NavigationMenu;
