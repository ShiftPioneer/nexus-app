
import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
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
    <header className="h-20 border-b border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 flex items-center justify-between px-6 z-30 flex-shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Enhanced logo when sidebar is collapsed */}
        {isCollapsed && (
          <Button
            variant="ghost"
            onClick={onToggleSidebar}
            className="flex items-center gap-3 hover:bg-primary/10 px-3 py-2 rounded-xl transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
              <img 
                src={LOGO_URL} 
                alt="NEXUS" 
                className="w-7 h-7 object-contain group-hover:drop-shadow-glow transition-all duration-200" 
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              NEXUS
            </span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Enhanced search button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-11 w-11 rounded-xl hover:bg-background-secondary transition-all duration-200",
            "text-text-secondary hover:text-text-primary"
          )}
        >
          <Search className="h-5 w-5" />
        </Button>
        
        {/* Enhanced theme toggle */}
        <ThemeToggle />
        
        {/* Enhanced notification button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-11 w-11 rounded-xl hover:bg-background-secondary transition-all duration-200 relative",
            "text-text-secondary hover:text-text-primary"
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary-500 rounded-full text-xs flex items-center justify-center text-white shadow-glow">
            3
          </span>
        </Button>
        
        {/* Enhanced user avatar */}
        <div className="flex items-center gap-3 pl-2">
          <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md hover:border-primary/40 transition-all duration-200">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary/10 text-primary-600 font-semibold text-sm">
              {user?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </span>
              <span className="text-xs text-text-tertiary">
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
