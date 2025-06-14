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

  const bottomItems = [
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      description: "App preferences"
    }
  ];

  const sidebarWidth = isCollapsed ? "w-20" : "w-72";

  return (
    <aside className={cn(
      // Use only Tailwind color classes for backgrounds
      "bg-slate-950 border-r border-slate-800 transition-all duration-300 ease-out flex-shrink-0 relative h-full flex flex-col shadow-lg",
      sidebarWidth,
      isMobile ? (isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50") : "relative"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center border-b border-slate-800 bg-slate-950 backdrop-blur-sm",
        isCollapsed ? "justify-center py-6 px-2" : "py-5 gap-3 px-6 min-h-[80px]"
      )}>
        {isCollapsed ? (
          <Button
            variant="ghost"
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="w-14 h-14 p-0 rounded-xl transition-all duration-200 hover:bg-primary/10 hover:scale-105 group text-slate-300 hover:text-white"
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
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                <img src={LOGO_URL} alt="NEXUS" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                NEXUS
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="ml-auto h-9 w-9 hover:bg-slate-800 transition-all duration-200 text-primary-500 hover:text-primary-400"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {/* Navigation - middle */}
      {isCollapsed ? (
        <nav className="flex flex-col flex-1 justify-between items-center py-4 px-2">
          <div className="flex flex-col flex-1 w-full justify-between items-center space-y-2">
            {navigationItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className="w-full flex justify-center group">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 relative group",
                      isActive 
                        ? "bg-primary/20 text-primary-500 shadow-glow hover:bg-primary/30" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-glow" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          <div className="w-full pt-4 border-t border-slate-800">
            {bottomItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className="w-full flex justify-center">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 relative group",
                      isActive 
                        ? "bg-primary/20 text-primary-500 shadow-glow hover:bg-primary/30" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-glow" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      ) : (
        <div className="flex flex-1 flex-col h-full">
          <ScrollArea className="flex-1 bg-slate-950 px-3">
            <nav className="space-y-2 py-4">
              {navigationItems.map(item => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link key={item.path} to={item.path} className="w-full" tabIndex={0}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full transition-all duration-200 group relative flex items-center h-16 px-4 justify-start rounded-xl",
                        isActive 
                          ? "bg-primary/20 text-primary-500 shadow-lg hover:bg-primary/30" 
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <div className="flex items-center w-full gap-4">
                        <div className={cn(
                          "flex-shrink-0 p-2 rounded-lg transition-all duration-200",
                          isActive ? "bg-primary/30" : "group-hover:bg-slate-800"
                        )}>
                          <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                        </div>
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-sm font-semibold truncate w-full text-left">
                            {item.name}
                          </span>
                          <span className="text-xs text-slate-400 truncate w-full text-left">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-500 rounded-r-full shadow-glow" />
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
          
          {/* Enhanced Settings Section */}
          <div className={cn(
            "w-full px-3 py-4 border-t border-slate-800 bg-slate-950", // slate-950
            isCollapsed ? "flex flex-col items-center" : ""
          )}>
            {bottomItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path} className={cn(
                  "w-full flex", 
                  isCollapsed ? "items-center justify-center" : "items-center"
                )}>
                  <Button
                    variant="ghost"
                    className={cn(
                      // Use proper contrast colors (not brown, not custom)
                      "w-full transition-all duration-200 group relative flex items-center rounded-xl",
                      isCollapsed ? "w-14 h-14 justify-center" : "h-14 px-4",
                      isActive 
                        ? "bg-primary/20 text-primary-500 shadow-glow hover:bg-primary/30" 
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
                    {!isCollapsed && (
                      <span className="ml-3 text-sm font-semibold">{item.name}</span>
                    )}
                    {isActive && (
                      <div className={cn(
                        "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary-500 rounded-r-full shadow-glow",
                        isCollapsed ? "h-8" : ""
                      )} />
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
};

export default ModernSidebar;
