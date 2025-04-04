
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  Home,
  Layers,
  BookOpen,
  Settings,
  Brain,
  Dumbbell,
  Zap,
  LogOut,
  MenuIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarNavProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const SidebarNav: React.FC<SidebarNavProps> = ({ isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="h-5 w-5" /> },
    { path: "/tasks", label: "Tasks", icon: <CheckCircle className="h-5 w-5" /> },
    { path: "/time-design", label: "Time Design", icon: <Clock className="h-5 w-5" /> },
    { path: "/habits", label: "Habits", icon: <Calendar className="h-5 w-5" /> },
    { path: "/planning", label: "Planning", icon: <Layers className="h-5 w-5" /> },
    { path: "/knowledge", label: "Knowledge", icon: <BookOpen className="h-5 w-5" /> },
    { path: "/mindset", label: "Mindset", icon: <Brain className="h-5 w-5" /> },
    { path: "/energy", label: "Energy", icon: <Dumbbell className="h-5 w-5" /> },
    { path: "/focus", label: "Focus", icon: <Zap className="h-5 w-5" /> },
    { path: "/gtd", label: "GTD", icon: <Layers className="h-5 w-5" /> },
  ];

  // Use safe access to user properties
  const userDisplayName = user?.displayName || "User";
  const userFirstName = userDisplayName.split(' ')[0]; // Get first name for compact display
  const userInitial = userDisplayName.charAt(0) || 'U';
  const userPhotoURL = user?.photoURL || undefined;

  return (
    <div className={cn(
      "h-full flex flex-col border-r border-border bg-muted/30 transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-56"
    )}>
      <div className="flex justify-between items-center p-4">
        {!isCollapsed && (
          <h2 className="font-semibold text-lg text-primary">Nexus</h2>
        )}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-1 px-3 py-2">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
            >
              {item.icon}
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="border-t border-border p-3">
        <div className="space-y-1">
          <Link
            to="/settings"
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
              location.pathname === "/settings"
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
              isCollapsed && "justify-center"
            )}
          >
            <Settings className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Settings</span>}
          </Link>
          
          <Link
            to="/profile"
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
              "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
              isCollapsed && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src={user?.photoURL} />
              <AvatarFallback className="bg-primary-600/10 text-primary">{userInitial}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="font-medium truncate">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            )}
          </Link>
          
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center py-2 px-3 rounded-md text-sm transition-colors",
              "text-foreground hover:bg-accent/50 hover:text-accent-foreground",
              isCollapsed && "justify-center"
            )}
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SidebarNav;
