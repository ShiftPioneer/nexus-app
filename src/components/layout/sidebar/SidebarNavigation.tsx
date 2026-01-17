
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
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

// Flat navigation - simple, clean, professional
const navigationItems = [
  { name: "Dashboard", path: "/", icon: Home },
  { name: "Actions", path: "/actions", icon: CheckCircle2 },
  { name: "Time Design", path: "/time-design", icon: Clock },
  { name: "Planning", path: "/planning", icon: Target },
  { name: "Focus", path: "/focus", icon: Crosshair },
  { name: "Habits", path: "/habits", icon: Repeat },
  { name: "Mindset", path: "/mindset", icon: Brain },
  { name: "Knowledge", path: "/knowledge", icon: BookOpen },
  { name: "Journal", path: "/journal", icon: Pencil },
  { name: "Energy", path: "/energy", icon: Zap },
];

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const isActive = (path: string) => location.pathname === path;

  // Collapsed view - icon only
  if (isCollapsed && !isMobile) {
    return (
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto scrollbar-none">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
            >
              <Link to={item.path} className="block">
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 mx-auto rounded-xl transition-all duration-300",
                    active
                      ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-lg shadow-primary/10 border border-primary/30"
                      : "text-slate-400 hover:bg-slate-800/70 hover:text-white hover:scale-105"
                  )}
                  title={item.name}
                >
                  <Icon className="h-5 w-5" />
                  {active && (
                    <motion.div 
                      layoutId="nav-indicator-collapsed"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    );
  }

  // Expanded view - flat list, clean and professional
  return (
    <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-none">
      <div className="space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
            >
              <Link to={item.path} className="block">
                <div
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                    isMobile && "min-h-[48px] px-4 py-3",
                    active
                      ? "bg-gradient-to-r from-primary/15 via-primary/10 to-transparent text-white border border-primary/20 shadow-lg shadow-primary/5"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white hover:translate-x-1"
                  )}
                >
                  {/* Active indicator */}
                  {active && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon with glow effect on active */}
                  <div className={cn(
                    "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300",
                    active 
                      ? "bg-primary/20 text-primary" 
                      : "text-slate-500 group-hover:text-primary group-hover:bg-slate-800"
                  )}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-sm font-medium tracking-wide transition-colors duration-200",
                    isMobile && "text-base",
                    active ? "text-white" : "text-slate-300 group-hover:text-white"
                  )}>
                    {item.name}
                  </span>
                  
                  {/* Hover shimmer effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
                    "bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  )} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};

export default SidebarNavigation;
