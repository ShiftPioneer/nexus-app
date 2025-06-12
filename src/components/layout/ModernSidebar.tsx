
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, CheckCircle, Clock, Target, RefreshCw, 
  Brain, Zap, BookOpen, FileText, BarChartHorizontal, 
  Settings, CheckSquare
} from "lucide-react";

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
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { title: "Dashboard", path: "/", icon: LayoutDashboard },
    { title: "GTD", path: "/gtd", icon: CheckSquare },
    { title: "Actions", path: "/actions", icon: CheckCircle },
    { title: "Time Design", path: "/time-design", icon: Clock },
    { title: "Plans", path: "/planning", icon: Target },
    { title: "Habits", path: "/habits", icon: RefreshCw },
    { title: "Focus", path: "/focus", icon: Brain },
    { title: "Mindset", path: "/mindset", icon: Zap },
    { title: "Knowledge", path: "/knowledge", icon: BookOpen },
    { title: "Journal", path: "/journal", icon: FileText },
    { title: "Energy", path: "/energy", icon: Zap },
    { title: "Stats", path: "/stats", icon: BarChartHorizontal },
    { title: "Settings", path: "/settings", icon: Settings }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };

  return (
    <aside
      className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out z-50",
        isMobile 
          ? cn(
              "fixed left-0 top-0 h-full",
              isCollapsed ? "-translate-x-full" : "translate-x-0 w-64"
            )
          : cn(
              "relative h-full",
              isCollapsed ? "w-16" : "w-64"
            )
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "h-14 border-b border-border flex items-center transition-all duration-300",
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        )}>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary">NEXUS</h1>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-2">
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start transition-all duration-200",
                  isCollapsed ? "px-2" : "px-3",
                  location.pathname === item.path && "bg-primary/10 text-primary"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className={cn(
                  "h-4 w-4 flex-shrink-0",
                  !isCollapsed && "mr-3"
                )} />
                {!isCollapsed && (
                  <span className="truncate">{item.title}</span>
                )}
              </Button>
            ))}
          </div>
        </nav>
        
        {/* User Section */}
        <div className={cn(
          "border-t border-border p-4",
          isCollapsed && "px-2"
        )}>
          <div className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}>
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
                <p className="text-xs text-muted-foreground">Pro Plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ModernSidebar;
