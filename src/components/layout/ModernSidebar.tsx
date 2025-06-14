import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, CheckSquare, Target, Calendar, BookOpen, Zap, Brain, Settings, BarChart3, Clock, NotebookPen, Focus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
interface ModernSidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
  onToggle: () => void;
}
const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isCollapsed,
  isMobile,
  onToggle
}) => {
  const location = useLocation();
  const {
    user
  } = useAuth();
  const navigationItems = [{
    name: "Dashboard",
    path: "/",
    icon: Home,
    description: "Overview & insights"
  }, {
    name: "GTD",
    path: "/gtd",
    icon: CheckSquare,
    description: "Getting Things Done"
  }, {
    name: "Actions",
    path: "/actions",
    icon: Target,
    description: "Tasks & todos"
  }, {
    name: "Time Design",
    path: "/timedesign",
    icon: Clock,
    description: "Schedule & matrix"
  }, {
    name: "Planning",
    path: "/planning",
    icon: Calendar,
    description: "Goals & projects"
  }, {
    name: "Habits",
    path: "/habits",
    icon: BarChart3,
    description: "Track habits"
  }, {
    name: "Focus",
    path: "/focus",
    icon: Focus,
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
  const sidebarWidth = isCollapsed ? "w-16" : "w-56";
  return <>
      {/* Sidebar */}
      <aside className={cn("bg-[#1A1F2C] border-r border-[#2A2F3C] transition-all duration-300 ease-in-out flex-shrink-0 relative h-full", sidebarWidth, isMobile ? isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50" : "relative")}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn("flex items-center border-b border-[#2A2F3C] py-4", isCollapsed ? "justify-center px-3" : "gap-3 px-4")}>
            {!isCollapsed && <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FF6500] to-[#FF6500]/80 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-base">N</span>
                  </div>
                  <span className="text-xl font-bold text-[#FF6500]">
                    NEXUS
                  </span>
                </div>
              </>}
            {isCollapsed && <div className="w-8 h-8 bg-gradient-to-br from-[#FF6500] to-[#FF6500]/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-base">N</span>
              </div>}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-2 bg-slate-950">
            <nav className="space-y-1 px-2 bg-slate-950">
              {navigationItems.map(item => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return <Link key={item.path} to={item.path}>
                    <Button variant="ghost" className={cn("w-full transition-all duration-200 group relative", isCollapsed ? "h-10 px-2 justify-center" : "h-12 px-3 justify-start", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white")}>
                      <Icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
                      {!isCollapsed && <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-sm font-medium truncate w-full text-left">{item.name}</span>
                          <span className="text-xs text-gray-400 truncate w-full text-left">
                            {item.description}
                          </span>
                        </div>}
                      {/* Active indicator */}
                      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                    </Button>
                  </Link>;
            })}
            </nav>
          </ScrollArea>

          {/* Bottom section */}
          <div className="border-t border-[#2A2F3C] p-2 bg-slate-950">
            {bottomItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return <Link key={item.path} to={item.path}>
                  <Button variant="ghost" className={cn("w-full transition-all duration-200 group relative", isCollapsed ? "h-10 px-2 justify-center" : "h-12 px-3 justify-start", isActive ? "bg-[#FF6500]/20 text-[#FF6500] hover:bg-[#FF6500]/30" : "text-gray-300 hover:bg-[#2A2F3C] hover:text-white")}>
                    <Icon className={cn("flex-shrink-0", isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
                    {!isCollapsed && <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="text-sm font-medium truncate w-full text-left">{item.name}</span>
                        <span className="text-xs text-gray-400 truncate w-full text-left">
                          {item.description}
                        </span>
                      </div>}
                    {/* Active indicator */}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF6500] rounded-r-full" />}
                  </Button>
                </Link>;
          })}
          </div>
        </div>
      </aside>
    </>;
};
export default ModernSidebar;