
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
      gradient: "from-violet-500 via-purple-500 to-blue-500",
      hoverGradient: "from-violet-400 via-purple-400 to-blue-400",
      bgGradient: "from-violet-500/10 via-purple-500/10 to-blue-500/10"
    },
    {
      title: "GTD",
      path: "/gtd",
      icon: CheckSquare,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      hoverGradient: "from-emerald-400 via-teal-400 to-cyan-400",
      bgGradient: "from-emerald-500/10 via-teal-500/10 to-cyan-500/10"
    },
    {
      title: "Actions",
      path: "/actions",
      icon: CheckCircle,
      gradient: "from-orange-500 via-red-500 to-pink-500",
      hoverGradient: "from-orange-400 via-red-400 to-pink-400",
      bgGradient: "from-orange-500/10 via-red-500/10 to-pink-500/10"
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock,
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      hoverGradient: "from-cyan-400 via-blue-400 to-indigo-400",
      bgGradient: "from-cyan-500/10 via-blue-500/10 to-indigo-500/10"
    },
    {
      title: "Plans",
      path: "/planning",
      icon: Target,
      gradient: "from-purple-500 via-pink-500 to-rose-500",
      hoverGradient: "from-purple-400 via-pink-400 to-rose-400",
      bgGradient: "from-purple-500/10 via-pink-500/10 to-rose-500/10"
    },
    {
      title: "Habits",
      path: "/habits",
      icon: RefreshCw,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      hoverGradient: "from-green-400 via-emerald-400 to-teal-400",
      bgGradient: "from-green-500/10 via-emerald-500/10 to-teal-500/10"
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Brain,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      hoverGradient: "from-indigo-400 via-purple-400 to-pink-400",
      bgGradient: "from-indigo-500/10 via-purple-500/10 to-pink-500/10"
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Zap,
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      hoverGradient: "from-yellow-400 via-orange-400 to-red-400",
      bgGradient: "from-yellow-500/10 via-orange-500/10 to-red-500/10"
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: BookOpen,
      gradient: "from-teal-500 via-cyan-500 to-blue-500",
      hoverGradient: "from-teal-400 via-cyan-400 to-blue-400",
      bgGradient: "from-teal-500/10 via-cyan-500/10 to-blue-500/10"
    },
    {
      title: "Journal",
      path: "/journal",
      icon: FileText,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      hoverGradient: "from-pink-400 via-rose-400 to-red-400",
      bgGradient: "from-pink-500/10 via-rose-500/10 to-red-500/10"
    },
    {
      title: "Energy",
      path: "/energy",
      icon: Zap,
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      hoverGradient: "from-red-400 via-orange-400 to-yellow-400",
      bgGradient: "from-red-500/10 via-orange-500/10 to-yellow-500/10"
    },
    {
      title: "Stats",
      path: "/stats",
      icon: BarChartHorizontal,
      gradient: "from-slate-500 via-gray-500 to-zinc-500",
      hoverGradient: "from-slate-400 via-gray-400 to-zinc-400",
      bgGradient: "from-slate-500/10 via-gray-500/10 to-zinc-500/10"
    }
  ];

  return (
    <SidebarMenu className="space-y-1 px-3">
      {menuItems.map(item => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={currentPath === item.path} 
            tooltip={isCollapsed ? item.title : undefined}
            className={cn(
              "group relative overflow-hidden transition-all duration-300 ease-out rounded-2xl",
              "border border-slate-700/30 backdrop-blur-sm",
              currentPath === item.path 
                ? `bg-gradient-to-r ${item.bgGradient} border-slate-600/50 shadow-xl shadow-black/20` 
                : "hover:bg-slate-800/40 hover:border-slate-600/40 hover:shadow-lg hover:shadow-black/10",
              isCollapsed ? "justify-center p-3 mx-1" : "px-4 py-3"
            )}
          >
            <Link to={item.path} className="w-full flex items-center gap-3 relative z-10">
              {/* Animated background for hover state */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl",
                `bg-gradient-to-r ${item.bgGradient}`
              )} />
              
              {/* Icon with unique gradient */}
              <div className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-lg",
                currentPath === item.path 
                  ? `bg-gradient-to-r ${item.gradient}` 
                  : `bg-gradient-to-r ${item.gradient} opacity-80 group-hover:opacity-100 group-hover:shadow-xl`
              )}>
                <item.icon 
                  className="h-5 w-5 text-white transition-transform duration-300 group-hover:scale-110" 
                />
                
                {/* Icon glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300",
                  `bg-gradient-to-r ${item.hoverGradient} blur-md`
                )} />
              </div>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-semibold transition-all duration-300",
                    currentPath === item.path 
                      ? "text-white" 
                      : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.title}
                  </span>
                </div>
              )}
              
              {/* Active indicator */}
              {currentPath === item.path && (
                <div className={cn(
                  "absolute right-2 w-2 h-2 rounded-full animate-pulse",
                  `bg-gradient-to-r ${item.gradient}`
                )} />
              )}
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavigationMenu;
