
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, CheckCircle, Target, Calendar, BookOpen, Zap, Brain, BarChart3, Clock, NotebookPen, Crosshair, SquareCheck } from "lucide-react";

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
    name: "GTD",
    path: "/gtd",
    icon: SquareCheck,
    description: "Getting Things Done"
  },
  {
    name: "Actions",
    path: "/actions",
    icon: CheckCircle,
    description: "Tasks & todos"
  },
  {
    name: "Time Design",
    path: "/timedesign",
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
    icon: BarChart3,
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
    icon: NotebookPen,
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

  return (
    <ScrollArea className="flex-1 bg-slate-950 overflow-y-auto">
      <nav className={cn("space-y-1", isCollapsed ? "px-2 py-3" : "px-3 py-3")}>
        {navigationItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} to={item.path} className="block">
              <div
                className={cn(
                  "flex items-center transition-all duration-200 group relative rounded-lg",
                  isCollapsed 
                    ? "w-10 h-10 justify-center mx-auto"
                    : "gap-3 px-3 py-2.5",
                  isActive 
                    ? "bg-primary/20 text-primary shadow-md" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 flex items-center justify-center transition-all duration-200",
                  isCollapsed ? "w-4 h-4" : "w-5 h-5",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )}>
                  <Icon className={cn(isCollapsed ? "h-4 w-4" : "h-5 w-5")} />
                </div>
                
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className={cn(
                      "text-sm font-medium leading-tight truncate",
                      isActive ? "text-white" : "text-slate-200 group-hover:text-white"
                    )}>
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-400 leading-tight truncate">
                      {item.description}
                    </span>
                  </div>
                )}
                
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </ScrollArea>
  );
};

export default SidebarNavigation;
