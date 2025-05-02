
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Search, Bell, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "../theme/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGTD } from "@/components/gtd/GTDContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  showMobileMenu?: boolean;
  toggleMobileMenu?: () => void;
}

const TopBar = ({ showMobileMenu, toggleMobileMenu }: TopBarProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { hasUnreadNotifications, markNotificationsAsRead } = useGTD();
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    // Load user profile data
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }

    // Listen for profile updates
    const handleProfileUpdate = (e: any) => {
      setProfileData(e.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);
  
  const getUserName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    return user?.email?.split('@')[0] || "User";
  };
  
  const handleNotificationClick = () => {
    markNotificationsAsRead();
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="bg-background border-b border-border h-16 flex items-center px-4 lg:px-6">
      {showMobileMenu && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMobileMenu}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      <div className="hidden sm:flex mx-4 flex-1 max-w-md relative">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-full bg-muted/40 pl-10 pr-4 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        {!isMobile && <ThemeToggle />}

        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={handleNotificationClick}
        >
          <Bell className="h-5 w-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-1.5 h-auto">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profileData?.avatar || ""} alt={getUserName()} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:block">{getUserName()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.email || 'My Account'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigate('/settings')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500" onSelect={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
