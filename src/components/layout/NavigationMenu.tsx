
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, CheckCircle, Clock, Zap, 
  BookOpen, Brain, LayoutGrid, Settings, 
  Calendar, BarChartHorizontal, Target, RefreshCcw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationMenuProps {
  isCollapsed?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ isCollapsed = false }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    }, 
    {
      title: "Tasks",
      path: "/tasks",
      icon: CheckCircle
    }, 
    {
      title: "Habits",
      path: "/habits",
      icon: RefreshCcw
    }, 
    {
      title: "Goals",
      path: "/planning",
      icon: Target
    }, 
    {
      title: "Focus",
      path: "/focus",
      icon: Brain
    }, 
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock
    }, 
    {
      title: "Journal",
      path: "/journal",
      icon: BookOpen
    }, 
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: LayoutGrid
    }, 
    {
      title: "Energy",
      path: "/energy",
      icon: Zap
    }, 
    {
      title: "Stats",
      path: "/stats",
      icon: BarChartHorizontal
    }, 
    {
      title: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];
  
  return (
    <SidebarMenu className="space-y-1">
      {menuItems.map(item => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={currentPath === item.path} 
            tooltip={isCollapsed ? item.title : undefined}
            className={cn(
              "hover:bg-[#2A2F3C] transition-all duration-200",
              currentPath === item.path ? "bg-[#2A2F3C] text-[#0FA0CE]" : "text-[#B0B5BD]",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            <Link to={item.path} className="w-full flex items-center gap-3">
              <item.icon className={cn(
                "h-5 w-5", 
                currentPath === item.path ? "text-[#0FA0CE]" : "text-[#B0B5BD]"
              )} />
              
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {item.title}
                </span>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavigationMenu;
