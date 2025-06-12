
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9"
        >
          <Menu className="h-4 w-4" />
        </Button>
        
        {!isMobile && !isCollapsed && (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Search...</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user?.email?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default ModernTopBar;
