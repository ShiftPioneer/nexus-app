
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  Target, 
  FileText, 
  Heart,
  Brain,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import ThemeToggle from "../theme/ThemeToggle";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { toast } = useToast();

  const navItems = [
    { 
      name: "Home", 
      icon: <Home className="h-5 w-5" />, 
      path: "/" 
    },
    { 
      name: "Planning", 
      icon: <Calendar className="h-5 w-5" />, 
      path: "/planning" 
    },
    { 
      name: "Habits", 
      icon: <CheckSquare className="h-5 w-5" />, 
      path: "/habits" 
    },
    { 
      name: "Goals", 
      icon: <Target className="h-5 w-5" />, 
      path: "/goals" 
    },
    { 
      name: "Journal", 
      icon: <FileText className="h-5 w-5" />, 
      path: "/journal" 
    },
    { 
      name: "Wellbeing", 
      icon: <Heart className="h-5 w-5" />, 
      path: "/wellbeing" 
    },
    { 
      name: "Mindset", 
      icon: <Brain className="h-5 w-5" />, 
      path: "/mindset" 
    },
  ];

  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is under development and will be available soon!",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-0 md:w-20",
        "h-screen sticky top-0"
      )}
    >
      {/* Logo and brand */}
      <div className={cn(
        "flex items-center justify-center h-16 border-b border-border",
        !isOpen && "md:justify-center"
      )}>
        {isOpen ? (
          <div className="px-4 flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-energy flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
            <span className="ml-2 text-lg font-semibold">Life OS</span>
          </div>
        ) : (
          <div className="px-2 flex items-center justify-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-energy flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                onClick={item.path === "/" ? undefined : handleComingSoon}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
                    !isOpen && "md:justify-center"
                  )
                }
              >
                {item.icon}
                {isOpen && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom actions */}
      <div className={cn(
        "p-4 border-t border-border space-y-3",
        !isOpen && "md:flex md:justify-center"
      )}>
        {isOpen ? (
          <div className="space-y-3">
            <ThemeToggle sidebarTheme={true} />
            <NavLink
              to="/settings"
              onClick={handleComingSoon}
              className="flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <ThemeToggle sidebarTheme={true} />
            <NavLink
              to="/settings"
              onClick={handleComingSoon}
              className="p-2 rounded-md hover:bg-sidebar-accent/50 text-sidebar-foreground transition-colors"
            >
              <Settings className="h-5 w-5" />
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
