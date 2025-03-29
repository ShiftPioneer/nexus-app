
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User, Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import ThemeToggle from "../theme/ThemeToggle";

interface TopBarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleSidebar, sidebarOpen }) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const handleNotificationClick = () => {
    toast({
      title: "No new notifications",
      description: "You're all caught up!",
    });
  };

  return (
    <header className="bg-background border-b border-border h-16 flex items-center px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Sidebar"
          onClick={toggleSidebar}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {isMobile && !sidebarOpen && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-energy flex items-center justify-center">
              <span className="font-bold text-white">L</span>
            </div>
            <span className="ml-2 text-lg font-semibold">Life OS</span>
          </div>
        )}
      </div>
      
      {/* Search bar - hidden on mobile */}
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
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        <Avatar className="h-8 w-8">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default TopBar;
