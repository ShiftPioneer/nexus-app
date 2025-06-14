
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  CheckSquare, 
  Target, 
  Calendar, 
  BookOpen, 
  Zap, 
  Brain, 
  Settings,
  BarChart3,
  Clock,
  NotebookPen,
  Timer,
  Users
} from "lucide-react";
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
  const { user } = useAuth();

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
      description: "Tasks & todos"
    },
    { 
      name: "Habits", 
      path: "/habits", 
      icon: Target,
      description: "Track habits"
    },
    { 
      name: "Planning", 
      path: "/planning", 
      icon: Calendar,
      description: "Goals & projects"
    },
    { 
      name: "GTD", 
      path: "/gtd", 
      icon: BarChart3,
      description: "Getting Things Done"
    },
    { 
      name: "Time Design", 
      path: "/timedesign", 
      icon: Clock,
      description: "Schedule & matrix"
    },
    { 
      name: "Focus", 
      path: "/focus", 
      icon: Timer,
      description: "Deep work sessions"
    },
    { 
      name: "Journal", 
      path: "/journal", 
      icon: NotebookPen,
      description: "Thoughts & reflections"
    },
    { 
      name: "Knowledge", 
      path: "/knowledge", 
      icon: BookOpen,
      description: "Learning & notes"
    },
    { 
      name: "Energy", 
      path: "/energy", 
      icon: Zap,
      description: "Fitness & wellness"
    },
    { 
      name: "Mindset", 
      path: "/mindset", 
      icon: Brain,
      description: "Values & beliefs"
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

  const sidebarWidth = isCollapsed ? "w-16" : "w-56"; // Reduced from w-72 to w-56 (about 80% of original)

  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border transition-all duration-500 ease-in-out flex-shrink-0",
        sidebarWidth,
        isMobile ? (isCollapsed ? "-translate-x-full" : "fixed inset-y-0 left-0 z-50") : "relative"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-4 border-b border-border",
            isCollapsed && "justify-center px-2"
          )}>
            {!isCollapsed && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">N</span>
                  </div>
                  <span className="text-lg font-bold text-primary">NEXUS</span>
                </div>
              </>
            )}
            {isCollapsed && (
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">N</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 h-10 transition-all duration-200",
                        isCollapsed ? "px-2" : "px-3",
                        isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                        !isActive && "hover:bg-accent/50"
                      )}
                    >
                      <Icon className={cn(
                        "flex-shrink-0",
                        isCollapsed ? "h-5 w-5" : "h-4 w-4"
                      )} />
                      {!isCollapsed && (
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="text-sm font-medium truncate">{item.name}</span>
                          <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                        </div>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Bottom section */}
          <div className="px-2 py-4 border-t border-border">
            {bottomItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 h-10 transition-all duration-200",
                      isCollapsed ? "px-2" : "px-3",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                      !isActive && "hover:bg-accent/50"
                    )}
                  >
                    <Icon className={cn(
                      "flex-shrink-0",
                      isCollapsed ? "h-5 w-5" : "h-4 w-4"
                    )} />
                    {!isCollapsed && (
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium truncate">{item.name}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                      </div>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default ModernSidebar;
