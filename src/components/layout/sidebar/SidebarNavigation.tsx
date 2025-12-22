
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Home,
  CheckSquare,
  Clock,
  Target,
  Brain,
  BookOpen,
  Crosshair,
  Zap,
  CheckCircle2,
  Repeat,
  Pencil,
} from "lucide-react";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

const navigationItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
    description: "Overview & insights"
  },
  {
    name: "Actions",
    path: "/actions",
    icon: CheckCircle2,
    description: "Tasks & todos"
  },
  {
    name: "Time Design",
    path: "/time-design",
    icon: Clock,
    description: "Schedule & matrix"
  },
  {
    name: "Planning",
    path: "/planning",
    icon: Target,
    description: "Goals & projects"
  },
  {
    name: "Habits",
    path: "/habits",
    icon: Repeat,
    description: "Track habits"
  },
  {
    name: "Focus",
    path: "/focus",
    icon: Crosshair,
    description: "Deep work sessions"
  },
  {
    name: "Mindset",
    path: "/mindset",
    icon: Brain,
    description: "Values & beliefs"
  },
  {
    name: "Knowledge",
    path: "/knowledge",
    icon: BookOpen,
    description: "Learning & notes"
  },
  {
    name: "Journal",
    path: "/journal",
    icon: Pencil,
    description: "Thoughts & reflections"
  },
  {
    name: "Energy",
    path: "/energy",
    icon: Zap,
    description: "Fitness & wellness"
  }
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <nav className="flex-1 px-2 py-3 sm:py-4 space-y-1 overflow-y-auto scrollbar-none">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path} className="block">
            <div
              className={cn(
                "flex items-center transition-all duration-200 group relative rounded-lg touch-manipulation",
                isCollapsed && !isMobile
                  ? "w-12 h-12 justify-center mx-auto"
                  : "gap-3 px-3 py-3 sm:py-3.5",
                // Enhanced mobile touch targets
                isMobile && "min-h-[44px] px-4 py-3",
                isActive
                  ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20 border border-slate-700/50" 
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white active:bg-slate-800"
              )}
            >
              <div className={cn(
                "flex-shrink-0 flex items-center justify-center transition-all duration-200",
                isCollapsed && !isMobile ? "w-5 h-5" : "w-5 h-5",
                isActive ? "text-white" : "group-hover:text-primary"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              
              {(!isCollapsed || isMobile) && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className={cn(
                    "text-sm font-medium leading-tight truncate",
                    // Mobile-optimized text size
                    isMobile && "text-base",
                    isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                  )}>
                    {item.name}
                  </span>
                  {!isMobile && (
                    <span className="text-xs text-slate-400 leading-tight truncate">
                      {item.description}
                    </span>
                  )}
                </div>
              )}
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
