import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu, X, Bot, Sparkles } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";
interface ModernTopBarProps {
  onToggleSidebar: () => void;
  isCollapsed: boolean;
  isMobile: boolean;
  aiAssistant: {
    isOpen: boolean;
    toggle: () => void;
  };
}
const LOGO_URL = "/lovable-uploads/nexus-logo-orange.png";
const ModernTopBar: React.FC<ModernTopBarProps> = ({
  onToggleSidebar,
  isCollapsed,
  isMobile,
  aiAssistant
}) => {
  const { user } = useUser();
  return <header className="h-14 sm:h-16 border-b border-slate-300 backdrop-blur-xl flex items-center justify-between px-3 sm:px-4 md:px-6 z-30 flex-shrink-0 shadow-sm bg-slate-950/95">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        {/* Mobile Menu Button */}
        {isMobile && <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-9 w-9 rounded-lg hover:bg-slate-800 transition-colors flex-shrink-0 border border-slate-300" aria-label={isCollapsed ? "Open sidebar" : "Close sidebar"}>
            {isCollapsed ? <Menu className="h-5 w-5 text-slate-300" /> : <X className="h-5 w-5 text-slate-300" />}
          </Button>}

        {/* Logo and Brand - Responsive */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/10 backdrop-blur-sm border border-slate-300 flex-shrink-0">
            <img src={LOGO_URL} alt="NEXUS" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
          </div>
          <span className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent truncate">
            NEXUS
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
        {/* Search - Hidden on small mobile */}
        <Button variant="ghost" size="icon" className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 transition-all duration-200 border border-slate-300", "text-slate-400 hover:text-slate-200", "hidden xs:flex")} aria-label="Search">
          <Search className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        
        {/* Theme Toggle - Hidden on very small screens */}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
        
        {/* AI Assistant */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={aiAssistant.toggle}
          className={cn(
            "h-9 w-9 sm:h-10 sm:w-10 rounded-xl transition-all duration-200 border border-slate-300 relative group overflow-hidden",
            aiAssistant.isOpen 
              ? "bg-gradient-to-br from-primary/30 to-orange-500/30 text-white border-primary/50 shadow-lg shadow-primary/25" 
              : "hover:bg-gradient-to-br hover:from-primary/10 hover:to-orange-500/10 text-slate-400 hover:text-white hover:border-primary/30"
          )} 
          aria-label="AI Assistant"
        >
          <div className="relative">
            <Bot className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
            <div className={cn(
              "absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-300",
              aiAssistant.isOpen 
                ? "bg-green-400 animate-pulse shadow-glow" 
                : "bg-primary/60 animate-pulse"
            )} />
          </div>
          <Sparkles className="h-2 w-2 absolute -top-0.5 -right-0.5 text-primary animate-pulse opacity-75" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl hover:bg-slate-800 transition-all duration-200 relative border border-slate-300", "text-slate-400 hover:text-slate-200")} aria-label="Notifications">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-primary rounded-full text-[10px] sm:text-xs flex items-center justify-center text-white shadow-glow font-medium border border-slate-300">
            3
          </span>
        </Button>
        
        {/* User Profile with Display Name */}
        <div className="flex items-center gap-2 pl-1 sm:pl-2 bg-slate-950 border border-slate-300 rounded-lg px-2 py-1">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 border-2 border-slate-300 shadow-md hover:border-primary/40 transition-all duration-200 flex-shrink-0">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs sm:text-sm border border-slate-300">
              {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info - Always show display name */}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-white truncate">
              {user?.displayName || 'User'}
            </span>
            <span className="text-xs text-primary truncate">
              Pro Account
            </span>
          </div>
        </div>
      </div>
    </header>;
};
export default ModernTopBar;