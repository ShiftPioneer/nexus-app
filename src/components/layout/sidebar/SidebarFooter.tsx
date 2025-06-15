
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserName = () => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    return user?.email?.split('@')[0] || "User";
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || "";
  };

  if (isCollapsed && !isMobile) {
    return (
      <div className="border-t border-slate-700/50 p-2 bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleProfileClick}
            className="w-10 h-10 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="Settings"
          >
            <Avatar className="h-7 w-7 border border-slate-700">
              <AvatarImage src={getUserAvatar()} />
              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                {getUserName().substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="w-10 h-10 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-700/50 p-3 sm:p-4 bg-slate-950">
      {/* User Profile Section */}
      <div 
        className={cn(
          "flex items-center gap-3 p-2 sm:p-3 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer mb-3",
          // Enhanced mobile touch target
          isMobile && "min-h-[48px] active:bg-slate-800"
        )}
        onClick={handleProfileClick}
      >
        <Avatar className="h-9 w-9 sm:h-10 sm:w-10 border-2 border-slate-700 shadow-md flex-shrink-0">
          <AvatarImage src={getUserAvatar()} alt="User Profile" />
          <AvatarFallback className="bg-primary/20 text-primary font-semibold text-sm">
            {getUserName().substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col flex-1 min-w-0">
          <span className={cn(
            "font-medium truncate text-slate-200",
            isMobile ? "text-base" : "text-sm"
          )}>
            {getUserName()}
          </span>
          <span className={cn(
            "text-primary-400 truncate",
            isMobile ? "text-sm" : "text-xs"
          )}>
            Pro Plan
          </span>
        </div>
        
        <Settings className="h-4 w-4 text-slate-500 group-hover:text-slate-400 flex-shrink-0" />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleProfileClick}
          className={cn(
            "flex-1 justify-start gap-2 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors",
            // Enhanced mobile sizing
            isMobile && "h-10 text-base"
          )}
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Profile</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className={cn(
            "flex-1 justify-start gap-2 hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-colors",
            // Enhanced mobile sizing
            isMobile && "h-10 text-base"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default SidebarFooter;
