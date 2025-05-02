
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  BookOpen,
  Brain,
  Zap,
  Target,
  Clock,
  LogOut,
  ListTodo,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  collapsed: boolean; 
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    avatar: "/lovable-uploads/711b54f0-9fd8-47e2-b63e-704304865ed3.png"
  });

  useEffect(() => {
    // Load profile data from localStorage
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        setProfileData(prev => ({
          ...prev,
          name: parsedProfile.name || (user?.email?.split('@')[0] || ''),
          avatar: parsedProfile.avatar || prev.avatar
        }));
      } else if (user) {
        setProfileData(prev => ({
          ...prev,
          name: user.email?.split('@')[0] || '',
          email: user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }

    // Listen for profile data updates
    const handleProfileUpdate = (event: any) => {
      if (event.detail) {
        setProfileData(prev => ({
          ...prev,
          name: event.detail.name || prev.name,
          avatar: event.detail.avatar || prev.avatar
        }));
      }
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);
  
  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/",
    },
    {
      title: "Tasks",
      icon: <CheckSquare className="h-4 w-4" />,
      href: "/tasks",
    },
    {
      title: "Actions",
      icon: <ListTodo className="h-4 w-4" />,
      href: "/actions",
    },
    {
      title: "GTD System",
      icon: <CheckSquare className="h-4 w-4" />,
      href: "/gtd",
    },
    {
      title: "Calendar",
      icon: <Calendar className="h-4 w-4" />,
      href: "/calendar",
    },
    {
      title: "Planning",
      icon: <Target className="h-4 w-4" />,
      href: "/planning",
    },
    {
      title: "Time Design",
      icon: <Clock className="h-4 w-4" />,
      href: "/time-design",
    },
    {
      title: "Focus",
      icon: <Zap className="h-4 w-4" />,
      href: "/focus",
    },
    {
      title: "Energy",
      icon: <Zap className="h-4 w-4" />,
      href: "/energy",
    },
    {
      title: "Mindset",
      icon: <Brain className="h-4 w-4" />,
      href: "/mindset",
    },
    {
      title: "Knowledge",
      icon: <BookOpen className="h-4 w-4" />,
      href: "/knowledge",
    },
    {
      title: "Journal",
      icon: <BookOpen className="h-4 w-4" />,
      href: "/journal",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen fixed transition-all duration-300 z-30",
        collapsed ? "w-[70px]" : "w-[250px]"
      )}
    >
      <div className="p-4 pb-2 flex justify-between items-center">
        <h1 className={cn("font-semibold text-xl flex-1", collapsed && "hidden")}>
          Flowquest
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronRight
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                item.href === location.pathname
                  ? "bg-accent text-accent-foreground hover:bg-accent/80"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span className={cn("flex-1", collapsed && "hidden")}>
                {item.title}
              </span>
            </Link>
          ))}
        </nav>
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className={cn("flex flex-col flex-1 overflow-hidden", collapsed && "hidden")}>
            <p className="text-sm font-medium truncate">{profileData.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">
              {profileData.email || ''}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto", !collapsed && "hidden")}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
        
        <div className={cn("mt-3 space-y-3", collapsed && "hidden")}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
