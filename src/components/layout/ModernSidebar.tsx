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
  const {
    user
  } = useAuth();

  // Only GTD uses SquareCheck now
  const navigationItems = [{
    name: "Dashboard",
    path: "/",
    icon: Home,
    description: "Overview & insights"
  }, {
    name: "GTD",
    path: "/gtd",
    icon: SquareCheck,
    description: "Getting Things Done"
  }, {
    name: "Actions",
    path: "/actions",
    icon: CheckCircle,
    description: "Tasks & todos"
  }, {
    name: "Time Design",
    path: "/timedesign",
    icon: Clock,
    description: "Schedule & matrix"
  }, {
    name: "Planning",
    path: "/planning",
    icon: Target,
    description: "Goals & projects"
  }, {
    name: "Habits",
    path: "/habits",
    icon: BarChart3,
    description: "Track habits"
  }, {
    name: "Focus",
    path: "/focus",
    icon: Crosshair,
    description: "Deep work sessions"
  }, {
    name: "Mindset",
    path: "/mindset",
    icon: Brain,
    description: "Values & beliefs"
  }, {
    name: "Knowledge",
    path: "/knowledge",
    icon: BookOpen,
    description: "Learning & notes"
  }, {
    name: "Journal",
    path: "/journal",
    icon: NotebookPen,
    description: "Thoughts & reflections"
  }, {
    name: "Energy",
    path: "/energy",
    icon: Zap,
    description: "Fitness & wellness"
  }];
  const bottomItems = [{
    name: "Settings",
    path: "/settings",
    icon: Settings,
    description: "App preferences"
  }];

  // Layout/size constants
  const SIDEBAR_COLLAPSED_WIDTH = "w-16";
  const SIDEBAR_FULL_WIDTH = "w-64";
  const sidebarWidth = isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_FULL_WIDTH;

  // Adjusted icon size for collapsed: h-7 w-7 (was h-6 w-6)
  const COLLAPSED_ICON_SIZE = "h-7 w-7";
  const COLLAPSED_ICON_HEIGHT = 56; // px per icon button including gap
  const COLLAPSED_ICON_GAP = 0; // we'll use flex utility for even distribution

  // For spacing: group all icons vertically, space-between to distribute them (remove ScrollArea)
  const totalNavIcons = navigationItems.length + bottomItems.length + 1; // main items + 1 settings + 1 logo
  // The +1 logo is for header, icons group fills the remaining vertical space

  return <>
      <aside className={cn("bg-slate-950 border-r border-[#1e293b] transition-all duration-300 ease-in-out flex-shrink-0 relative h-full flex flex-col", sidebarWidth, isMobile ? isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50" : "relative")}>
        {/* Header */}
        <div className={cn("flex items-center border-b border-[#1e293b] bg-slate-950", isCollapsed ? "justify-center py-5 px-1 min-h-0" : "py-4 gap-3 px-4 min-h-[64px]")}>
          {isCollapsed ? <Button variant="ghost" onClick={onToggle} aria-label="Expand sidebar" className="w-12 h-50 p-0 rounded-xl transition-all flex items-center justify-center bg-transparent py-[10px] my-[20px]">
              <img src={LOGO_URL} alt="NEXUS" className="w-7 h-7 object-contain" />
            </Button> : <>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-transparent">
                  <img src={LOGO_URL} alt="NEXUS" className="w-6 h-6 object-contain" />
                </div>
                <span className="text-xl font-bold text-[#FF6500]">NEXUS</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto h-8 w-8 hover:bg-[#1e293b] transition-colors text-orange-600" aria-label="Collapse sidebar">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </>}
        </div>

        {/* NAVIGATION (flex vertically, equally-distributed icons for collapsed) */}
        {isCollapsed ? <nav className="flex flex-col flex-1 justify-between items-center py-2 h-full">
            {/* Main icons */}
            <div className="flex flex-col flex-1 w-full justify-between items-center pt-2">
              {navigationItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} className="flex items-center justify-center w-full">
                    <Button variant="ghost" className={cn(`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 group relative overflow-hidden p-0 m-0`, isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")} style={{
                minWidth: 56,
                maxWidth: 56,
                marginBottom: 2
              }}>
                      <Icon className={cn(COLLAPSED_ICON_SIZE, "flex-shrink-0")} />
                      {/* Active indicator */}
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                    </Button>
                  </Link>;
          })}
            </div>
            {/* Settings button at the bottom */}
            <div className="w-full pb-2">
              {bottomItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} className="w-full flex items-center justify-center">
                    <Button variant="ghost" className={cn(`w-14 h-14 flex items-center justify-center rounded-xl transition-all duration-200 group relative overflow-hidden p-0 m-0`, isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")} style={{
                minWidth: 56,
                maxWidth: 56
              }}>
                      <Icon className={cn(COLLAPSED_ICON_SIZE, "flex-shrink-0")} />
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                    </Button>
                  </Link>;
          })}
            </div>
          </nav> :
      // EXPANDED NAVIGATION: Make sidebar content fill all space, keep settings visible at bottom
      <div className="flex flex-1 flex-col h-full">
            <ScrollArea className={cn("flex-1 bg-slate-950", !isCollapsed && "px-0")} style={!isCollapsed ? {
          overflow: "visible",
          maxHeight: "none"
        } : undefined}>
              <nav className={cn("space-y-1 px-2")}>
                {navigationItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return <Link key={item.path} to={item.path} className="w-full" tabIndex={0}>
                      <Button variant="ghost" className={cn("transition-all duration-200 group relative flex items-center h-14 px-3 justify-start w-full", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")}>
                        <div className="flex items-center w-full gap-3">
                          <Icon className="h-6 w-6 flex-shrink-0" />
                          <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="text-sm font-medium truncate w-full text-left">
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-400 truncate w-full text-left">
                              {item.description}
                            </span>
                          </div>
                        </div>
                        {/* Active indicator */}
                        {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                      </Button>
                    </Link>;
            })}
              </nav>
            </ScrollArea>
            {/* SETTINGS: Always visible at bottom */}
            <div className="w-full px-2 py-3 border-t border-[#1e293b] bg-slate-950">
              {bottomItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return <Link key={item.path} to={item.path} className="w-full flex items-center">
                    <Button variant="ghost" className={cn("transition-all duration-200 group relative flex items-center h-12 px-3 w-full rounded-xl", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#1e293b] hover:text-white")}>
                      <Icon className="h-6 w-6 flex-shrink-0" />
                      <div className="flex flex-col items-start flex-1 min-w-0 ml-2">
                        <span className="text-sm font-medium truncate w-full text-left">
                          {item.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate w-full text-left">
                          {item.description}
                        </span>
                      </div>
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 bg-[#FF6500] rounded-r-full" />}
                    </Button>
                  </Link>;
          })}
            </div>
          </div>}
      </aside>
    </>;
};
export default ModernSidebar;