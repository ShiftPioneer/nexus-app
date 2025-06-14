
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CheckCircle, Target, Calendar, BookOpen, Zap, Brain, Settings, BarChart3, Clock, NotebookPen, Crosshair, ChevronLeft, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

interface ModernSidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}

const LOGO_URL = "https://nexus-plaform.lovable.app/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png";

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isCollapsed,
  isMobile,
  onToggle
}) => {
  const location = useLocation();
  const { user } = useAuth();

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

  const settingsItem = {
    name: "Settings",
    path: "/settings",
    icon: Settings,
    description: "App preferences"
  };

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";

  return (
    <aside className={cn(
      "bg-slate-950 border-r border-slate-700 transition-all duration-300 ease-out flex-shrink-0 relative h-full flex flex-col shadow-lg",
      sidebarWidth,
      isMobile ? (isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50") : "relative"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-slate-700 bg-slate-950",
        isCollapsed ? "justify-center py-6 px-2" : "py-5 gap-3 px-6 min-h-[80px]"
      )}>
        {isCollapsed ? (
          <Button
            variant="ghost"
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="w-14 h-14 p-0 rounded-xl transition-all duration-200 hover:bg-primary/20 hover:scale-105 group text-slate-300 hover:text-white"
          >
            <img 
              src={LOGO_URL} 
              alt="NEXUS" 
              className="w-8 h-8 object-contain group-hover:drop-shadow-glow transition-all duration-200" 
            />
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/20 border border-primary/30">
                <img src={LOGO_URL} alt="NEXUS" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto h-9 w-9 hover:bg-slate-800 transition-all duration-200 text-primary hover:text-primary-400"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex flex-col flex-1">
        <ScrollArea className="flex-1 bg-slate-950 px-3">
          <nav className="space-y-1 py-4">
            {navigationItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              if (isCollapsed) {
                return (
                  <Link key={item.path} to={item.path} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 relative group mx-auto",
                        isActive 
                          ? "bg-primary/20 text-primary shadow-lg hover:bg-primary/30" 
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                      )}
                    </Button>
                  </Link>
                );
              }

              return (
                <Link key={item.path} to={item.path} className="block">
                  <div
                    className={cn(
                      "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative",
                      isActive 
                        ? "bg-primary/20 text-primary shadow-sm" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200",
                      isActive ? "bg-primary/30" : "group-hover:bg-slate-700"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 flex flex-col min-w-0 flex-1">
                      <span className="text-sm font-semibold text-white">
                        {item.name}
                      </span>
                      <span className="text-xs text-slate-400">
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Settings Button - Fixed at Bottom */}
        <div className={cn(
          "border-t border-slate-700 bg-slate-950",
          isCollapsed ? "p-2" : "p-3"
        )}>
          {isCollapsed ? (
            <Link to={settingsItem.path} className="block">
              <Button
                variant="ghost"
                className={cn(
                  "w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 relative group mx-auto",
                  location.pathname === settingsItem.path
                    ? "bg-primary/20 text-primary shadow-lg hover:bg-primary/30" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Settings className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                {location.pathname === settingsItem.path && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </Button>
            </Link>
          ) : (
            <Link to={settingsItem.path} className="block">
              <div
                className={cn(
                  "flex items-center px-3 py-3 rounded-lg transition-all duration-200 group relative",
                  location.pathname === settingsItem.path
                    ? "bg-primary/20 text-primary shadow-sm" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <div className={cn(
                  "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200",
                  location.pathname === settingsItem.path ? "bg-primary/30" : "group-hover:bg-slate-700"
                )}>
                  <Settings className="h-5 w-5" />
                </div>
                <div className="ml-3 flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-semibold text-white">
                    {settingsItem.name}
                  </span>
                  <span className="text-xs text-slate-400">
                    {settingsItem.description}
                  </span>
                </div>
                {location.pathname === settingsItem.path && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
