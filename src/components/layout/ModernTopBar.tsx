
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface ModernTopBarProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  isMobile: boolean;
}

const ModernTopBar: React.FC<ModernTopBarProps> = ({ 
  onToggleSidebar, 
  isCollapsed, 
  isMobile 
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 z-30 flex-shrink-0">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9 hover:bg-accent/50 transition-colors text-primary"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
        
        {/* Show logo when sidebar is collapsed */}
        {isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-primary">NEXUS</span>
          </div>
        )}
        
        {!isMobile && !isCollapsed && (
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2 min-w-[240px]">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 hover:bg-accent/50 transition-colors relative"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs"></span>
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {user?.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default ModernTopBar;
