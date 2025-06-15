
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

interface ModernTopBarProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  isMobile: boolean;
}

const LOGO_URL = "https://nexus-plaform.lovable.app/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png";

const ModernTopBar: React.FC<ModernTopBarProps> = ({
  onToggleSidebar,
  isCollapsed,
  isMobile
}) => {
  const { user } = useAuth();

  return (
    <header className="h-14 sm:h-16 border-b border-slate-700/50 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 md:px-6 z-30 flex-shrink-0 shadow-sm bg-slate-950/95">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="h-9 w-9 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0"
            aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5 text-slate-300" />
            ) : (
              <X className="h-5 w-5 text-slate-300" />
            )}
          </Button>
        )}

        {/* Logo and Brand - Responsive */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/10 backdrop-blur-sm border border-slate-700/50 flex-shrink-0">
            <img 
              src={LOGO_URL} 
              alt="NEXUS" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain" 
            />
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent truncate">
            NEXUS
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Search - Hidden on small mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 transition-all duration-200",
            "text-slate-400 hover:text-slate-200",
            "hidden xs:flex"
          )}
          aria-label="Search"
        >
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        {/* Theme Toggle - Hidden on very small screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        
        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 transition-all duration-200 relative",
            "text-slate-400 hover:text-slate-200"
          )}
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-primary-500 rounded-full text-[10px] sm:text-xs flex items-center justify-center text-white shadow-glow font-medium">
            3
          </span>
        </Button>
        
        {/* User Profile */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 border-2 border-slate-700/50 shadow-md hover:border-primary/40 transition-all duration-200 flex-shrink-0">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary-600 font-semibold text-xs sm:text-sm">
              {user?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info - Only show on larger screens */}
          {!isMobile && (
            <div className="hidden md:flex flex-col min-w-0">
              <span className="text-sm font-medium text-slate-200 truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs text-primary-400 truncate">
                Pro Account
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ModernTopBar;
