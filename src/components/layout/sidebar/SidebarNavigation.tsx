
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  Home,
  CheckCircle2,
  Clock,
  Target,
  Brain,
  BookOpen,
  Crosshair,
  Zap,
  Repeat,
  Pencil,
} from "lucide-react";

interface SidebarNavigationProps {
  isCollapsed: boolean;
}

// Navigation groups for better organization
const navigationGroups = [
  {
    name: "Overview",
    items: [
      { name: "Dashboard", path: "/", icon: Home, description: "Overview & insights" },
    ]
  },
  {
    name: "Productivity",
    items: [
      { name: "Actions", path: "/actions", icon: CheckCircle2, description: "Tasks & todos" },
      { name: "Time Design", path: "/time-design", icon: Clock, description: "Schedule & matrix" },
      { name: "Planning", path: "/planning", icon: Target, description: "Goals & projects" },
      { name: "Focus", path: "/focus", icon: Crosshair, description: "Deep work sessions" },
    ]
  },
  {
    name: "Growth",
    items: [
      { name: "Habits", path: "/habits", icon: Repeat, description: "Track habits" },
      { name: "Mindset", path: "/mindset", icon: Brain, description: "Values & beliefs" },
      { name: "Knowledge", path: "/knowledge", icon: BookOpen, description: "Learning & notes" },
      { name: "Journal", path: "/journal", icon: Pencil, description: "Thoughts & reflections" },
    ]
  },
  {
    name: "Wellness",
    items: [
      { name: "Energy", path: "/energy", icon: Zap, description: "Fitness & wellness" },
    ]
  }
];

// Flat navigation for collapsed view
const flatNavigation = navigationGroups.flatMap(g => g.items);

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Track expanded groups - default all open
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Productivity: true,
    Growth: true,
    Wellness: true,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isActive = (path: string) => location.pathname === path;

  // Collapsed view - simple list
  if (isCollapsed && !isMobile) {
    return (
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-none">
        {flatNavigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link key={item.path} to={item.path} className="block">
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 mx-auto rounded-lg transition-all duration-200",
                  active
                    ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20 border border-slate-700/50"
                    : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                )}
                title={item.name}
              >
                <Icon className="h-5 w-5" />
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    );
  }

  // Expanded view - grouped with collapsible sections
  return (
    <nav className="flex-1 px-2 py-3 overflow-y-auto scrollbar-none">
      {navigationGroups.map((group) => {
        const isExpanded = expandedGroups[group.name];
        const hasActiveItem = group.items.some(item => isActive(item.path));
        
        return (
          <div key={group.name} className="mb-2">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.name)}
              className={cn(
                "flex items-center justify-between w-full px-3 py-2 rounded-md",
                "text-xs font-semibold uppercase tracking-wider",
                "transition-colors duration-200",
                hasActiveItem ? "text-primary" : "text-slate-500 hover:text-slate-300"
              )}
            >
              <span>{group.name}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-3 w-3" />
              </motion.div>
            </button>
            
            {/* Group Items */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-0.5 mt-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.path);
                      
                      return (
                        <Link key={item.path} to={item.path} className="block">
                          <div
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                              isMobile && "min-h-[44px] px-4 py-3",
                              active
                                ? "bg-slate-800 text-white shadow-lg shadow-slate-900/20 border border-slate-700/50"
                                : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
                            )}
                          >
                            <div className={cn(
                              "flex-shrink-0 flex items-center justify-center transition-all duration-200",
                              active ? "text-white" : "group-hover:text-primary"
                            )}>
                              <Icon className="h-5 w-5" />
                            </div>
                            
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className={cn(
                                "text-sm font-medium leading-tight truncate",
                                isMobile && "text-base",
                                active ? "text-white" : "text-slate-200 group-hover:text-white"
                              )}>
                                {item.name}
                              </span>
                              {!isMobile && (
                                <span className="text-xs text-slate-400 leading-tight truncate">
                                  {item.description}
                                </span>
                              )}
                            </div>
                            
                            {active && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;
