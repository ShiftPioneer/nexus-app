
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  CheckSquare,
  Repeat,
  BookOpen,
  Target,
  Clock,
  DollarSign,
  Dumbbell,
  Brain,
  Zap,
  ListTodo
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
    icon: CheckSquare,
    description: "To Do / Not To Do"
  },
  {
    name: "Habits",
    path: "/habits",
    icon: Repeat,
    description: "Track daily habits"
  },
  {
    name: "Journal",
    path: "/journal",
    icon: BookOpen,
    description: "Reflect & grow"
  },
  {
    name: "Planning",
    path: "/planning",
    icon: Target,
    description: "Goals & projects"
  },
  {
    name: "Tasks",
    path: "/tasks",
    icon: ListTodo,
    description: "Task management"
  },
  {
    name: "Time Design",
    path: "/time-design",
    icon: Clock,
    description: "Schedule & matrix"
  },
  {
    name: "Finance",
    path: "/finance",
    icon: DollarSign,
    description: "Track expenses"
  },
  {
    name: "Energy Hub",
    path: "/energy",
    icon: Dumbbell,
    description: "Fitness & nutrition"
  },
  {
    name: "Mindset",
    path: "/mindset",
    icon: Brain,
    description: "Vision & beliefs"
  },
  {
    name: "Knowledge",
    path: "/knowledge",
    icon: Zap,
    description: "Learning hub"
  },
  {
    name: "Focus",
    path: "/focus",
    icon: Target,
    description: "Focus sessions"
  },
  {
    name: "GTD",
    path: "/gtd",
    icon: ListTodo,
    description: "Getting Things Done"
  }
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed }) => {
  const location = useLocation();

  return (
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-none">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link key={item.path} to={item.path} className="block">
            <div
              className={cn(
                "flex items-center transition-all duration-200 group relative rounded-lg",
                isCollapsed 
                  ? "w-12 h-12 justify-center mx-auto"
                  : "gap-3 px-3 py-3",
                isActive
                  ? "bg-slate-800 text-white shadow-md" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <div className={cn(
                "flex-shrink-0 flex items-center justify-center transition-all duration-200",
                isCollapsed ? "w-5 h-5" : "w-5 h-5",
                isActive ? "text-white" : "group-hover:text-primary"
              )}>
                <Icon className="h-5 w-5" />
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
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-300 rounded-r-full" />
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
