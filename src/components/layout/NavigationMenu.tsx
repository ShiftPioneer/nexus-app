
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, CheckCircle, Clock, Zap, FileText, Brain, 
  BookOpen, Settings, BarChartHorizontal, Target, RefreshCw, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationMenuProps {
  isCollapsed?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isCollapsed = false
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "GTD",
      path: "/gtd",
      icon: CheckSquare
    },
    {
      title: "Actions",
      path: "/actions",
      icon: CheckCircle
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock
    },
    {
      title: "Plans",
      path: "/planning",
      icon: Target
    },
    {
      title: "Habits",
      path: "/habits",
      icon: RefreshCw
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Brain
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Zap
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: BookOpen
    },
    {
      title: "Journal",
      path: "/journal",
      icon: FileText
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
    }
  ];

  return (
    <SidebarMenu className="space-y-1 scrollbar-none px-2">
      {menuItems.map(item => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={currentPath === item.path} 
            tooltip={isCollapsed ? item.title : undefined} 
            className={cn(
              "nav-item group transition-all duration-200 border border-slate-300",
              currentPath === item.path 
                ? "active bg-primary/10 text-primary border-primary/30" 
                : "text-slate-300 hover:text-white hover:bg-slate-800/50",
              isCollapsed ? "justify-center p-3" : "px-3 py-2.5"
            )}
          >
            <Link to={item.path} className="w-full flex items-center gap-3">
              <item.icon 
                className={cn(
                  "h-5 w-5 transition-all duration-200 flex-shrink-0", 
                  currentPath === item.path ? "text-primary" : "text-slate-300 group-hover:text-white"
                )} 
              />
              
              {!isCollapsed && (
                <span className="transition-all duration-200 text-sm font-medium group-hover:translate-x-1">
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
