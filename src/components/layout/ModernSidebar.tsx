
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CheckCircle, Target, Calendar, BookOpen, Zap, Brain, Settings, BarChart3, Clock, NotebookPen, Crosshair, ChevronLeft, SquareCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  const {
    user
  } = useAuth();

  // NOTE: Only GTD uses SquareCheck now
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
  const sidebarWidth = isCollapsed ? "w-16" : "w-64";
  return <>
      {/* Sidebar */}
      <aside className={cn(
          "bg-slate-950 border-r border-[#1e293b] transition-all duration-300 ease-in-out flex-shrink-0 relative h-full flex flex-col",
          sidebarWidth,
          isMobile
            ? isCollapsed
              ? "-translate-x-full"
              : "fixed inset-y-0 left-0 z-50"
            : "relative"
        )}>
        {/* Header */}
        <div className={cn("flex items-center border-b border-[#1e293b] py-4 relative min-h-[64px]", isCollapsed ? "justify-center px-3" : "gap-3 px-4")}>
          {!isCollapsed && <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-transparent">
                  <img src={LOGO_URL} alt="NEXUS" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-xl font-bold text-[#FF6500]">
                  NEXUS
                </span>
              </div>
              {/* Collapse Arrow Button */}
              <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto h-8 w-8 hover:bg-[#1e293b] transition-colors text-orange-600">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>}

          {isCollapsed &&
            <Button
              variant="ghost"
              onClick={onToggle}
              className="w-10 h-10 p-0 rounded-xl transition-all flex items-center justify-center bg-transparent"
              aria-label="Expand sidebar"
            >
              <img src={LOGO_URL} alt="NEXUS" className="w-8 h-8 object-contain" />
            </Button>
          }
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-2 bg-slate-950">
          <nav className="space-y-1 px-2">
            {navigationItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return <Link key={item.path} to={item.path}>
                  <Button variant="ghost" className={cn("w-full transition-all duration-200 group relative", isCollapsed ? "h-12 px-0 justify-center" : "h-14 px-3 justify-start", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")}>
                    <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "w-full")}>
                      <Icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
                      {!isCollapsed && <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-sm font-medium truncate w-full text-left">
                            {item.name}
                          </span>
                          <span className="text-xs text-gray-400 truncate w-full text-left">
                            {item.description}
                          </span>
                        </div>}
                    </div>
                    {/* Active indicator */}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                  </Button>
                </Link>;
          })}
          </nav>
        </ScrollArea>
        {/* Bottom section */}
        <div className="border-t border-[#1e293b] p-2 bg-slate-950">
          {bottomItems.map(item => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return <Link key={item.path} to={item.path}>
                <Button variant="ghost" className={cn("w-full transition-all duration-200 group relative", isCollapsed ? "h-12 px-0 justify-center" : "h-14 px-3 justify-start", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")}>
                  <div className={cn("flex items-center", isCollapsed ? "justify-center w-full" : "w-full")}>
                    <Icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
                    {!isCollapsed && <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-medium truncate w-full text-left">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate w-full text-left">
                          {item.description}
                        </span>
                      </div>}
                  </div>
                  {/* Active indicator */}
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                </Button>
              </Link>;
        })}
        </div>
      </aside>
    </>;
};
export default ModernSidebar;
