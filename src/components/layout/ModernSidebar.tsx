import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, CheckCircle, Clock, Target, RefreshCw, Brain, Zap, BookOpen, FileText, BarChartHorizontal, Settings, CheckSquare, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const {
    user
  } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }
    const handleProfileUpdate = (e: any) => {
      setProfileData(e.detail);
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);
  const menuItems = [{
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  }, {
    title: "GTD",
    path: "/gtd",
    icon: CheckSquare
  }, {
    title: "Actions",
    path: "/actions",
    icon: CheckCircle
  }, {
    title: "Time Design",
    path: "/time-design",
    icon: Clock
  }, {
    title: "Plans",
    path: "/planning",
    icon: Target
  }, {
    title: "Habits",
    path: "/habits",
    icon: RefreshCw
  }, {
    title: "Focus",
    path: "/focus",
    icon: Brain
  }, {
    title: "Mindset",
    path: "/mindset",
    icon: Zap
  }, {
    title: "Knowledge",
    path: "/knowledge",
    icon: BookOpen
  }, {
    title: "Journal",
    path: "/journal",
    icon: FileText
  }, {
    title: "Energy",
    path: "/energy",
    icon: Zap
  }, {
    title: "Stats",
    path: "/stats",
    icon: BarChartHorizontal
  }, {
    title: "Settings",
    path: "/settings",
    icon: Settings
  }];
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle();
    }
  };
  const getUserName = () => {
    if (profileData?.name) return profileData.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return user?.email?.split('@')[0] || "User";
  };
  const getUserAvatar = () => {
    return profileData?.avatar || user?.user_metadata?.avatar_url || "";
  };
  return <aside className={cn("bg-card border-r border-border transition-all duration-500 ease-in-out z-50 flex flex-col sidebar-transition", isMobile ? cn("fixed left-0 top-0 h-full", isCollapsed ? "-translate-x-full" : "translate-x-0 w-64") : cn("relative h-full", isCollapsed ? "w-16" : "w-64"))}>
      {/* Logo */}
      <div className={cn("h-16 border-b border-border flex items-center transition-all duration-500 flex-shrink-0", isCollapsed ? "justify-center px-2" : "justify-between px-4")}>
        {!isCollapsed && <>
            <h1 className="text-xl font-bold text-primary">NEXUS</h1>
            <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 hover:bg-accent/50 transition-colors text-primary">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </>}
        {isCollapsed && <Button variant="ghost" size="icon" onClick={onToggle} className="h-8 w-8 hover:bg-accent/50 transition-colors">
            <img alt="Nexus Logo" src="/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png" className="h-6 w-6 object-contain" />
          </Button>}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-none bg-slate-950 px-0">
        <div className="space-y-1 px-[8px]">
          {menuItems.map(item => <Button key={item.path} variant={location.pathname === item.path ? "secondary" : "ghost"} className={cn("w-full justify-start transition-all duration-200 h-10", isCollapsed ? "px-2" : "px-3", location.pathname === item.path ? "bg-primary/10 text-primary hover:bg-primary/15" : "hover:bg-accent/50")} onClick={() => handleNavigation(item.path)}>
              <item.icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-3")} />
              {!isCollapsed && <span className="truncate font-medium font-medium text-center ">{item.title}</span>}
            </Button>)}
        </div>
      </nav>
      
      {/* User Section */}
      <div className={cn("border-t border-border p-4 flex-shrink-0", isCollapsed && "px-2")}>
        <div className={cn("flex items-center cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors", isCollapsed ? "justify-center" : "gap-3")} onClick={() => navigate("/settings")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={getUserAvatar()} />
            <AvatarFallback className="bg-primary/20 text-primary font-medium">
              {getUserName().substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{getUserName()}</p>
              <p className="text-xs text-muted-foreground">Pro Plan</p>
            </div>}
        </div>
      </div>
    </aside>;
};
export default ModernSidebar;