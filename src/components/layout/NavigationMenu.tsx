
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
      icon: LayoutDashboard,
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "GTD",
      path: "/gtd",
      icon: CheckSquare,
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      title: "Actions",
      path: "/actions",
      icon: CheckCircle,
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock,
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "Plans",
      path: "/planning",
      icon: Target,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Habits",
      path: "/habits",
      icon: RefreshCw,
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Brain,
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-600"
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: BookOpen,
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      title: "Journal",
      path: "/journal",
      icon: FileText,
      gradient: "from-pink-500 to-rose-600"
    },
    {
      title: "Energy",
      path: "/energy",
      icon: Zap,
      gradient: "from-red-500 to-orange-600"
    },
    {
      title: "Stats",
      path: "/stats",
      icon: BarChartHorizontal,
      gradient: "from-slate-500 to-gray-600"
    }
  ];

  return (
    <SidebarMenu className="space-y-2 px-3">
      {menuItems.map(item => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={currentPath === item.path} 
            tooltip={isCollapsed ? item.title : undefined} 
            className={cn(
              "group relative overflow-hidden transition-all duration-300 ease-out rounded-xl border border-slate-700/50 hover:border-slate-600/50",
              currentPath === item.path 
                ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 shadow-lg shadow-primary/10" 
                : "hover:bg-slate-800/70 hover:shadow-md hover:shadow-slate-900/20",
              isCollapsed ? "justify-center p-3 mx-1" : "px-4 py-3"
            )}
          >
            <Link to={item.path} className="w-full flex items-center gap-3 relative z-10">
              {/* Animated background for active state */}
              {currentPath === item.path && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-10 rounded-xl transition-opacity duration-300",
                  item.gradient
                )} />
              )}
              
              {/* Icon with gradient background */}
              <div className={cn(
                "relative flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                currentPath === item.path 
                  ? `bg-gradient-to-r ${item.gradient} shadow-lg` 
                  : "bg-slate-800/50 group-hover:bg-slate-700/50"
              )}>
                <item.icon 
                  className={cn(
                    "h-4 w-4 transition-all duration-300", 
                    currentPath === item.path 
                      ? "text-white" 
                      : "text-slate-400 group-hover:text-white"
                  )} 
                />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-medium transition-all duration-300",
                    currentPath === item.path 
                      ? "text-white" 
                      : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.title}
                  </span>
                </div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavigationMenu;
