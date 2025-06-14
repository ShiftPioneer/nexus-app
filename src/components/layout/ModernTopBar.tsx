import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "@/components/theme/ThemeToggle";
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
  const {
    user
  } = useAuth();
  return <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 z-30 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Show logo when sidebar is collapsed */}
        {isCollapsed && <Button variant="ghost" onClick={onToggleSidebar} className="flex items-center gap-2 hover:bg-accent/50 px-2 py-1 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-transparent">
              <img src={LOGO_URL} alt="NEXUS" className="w-8 h-8 object-fill" />
            </div>
            <span className="text-xl font-bold text-[#FF6500]">
              NEXUS
            </span>
          </Button>}
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-accent/50 transition-colors relative">
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
    </header>;
};
export default ModernTopBar;