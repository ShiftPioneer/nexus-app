
import React from "react";
import { SidebarFooter as BaseSidebarFooter } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const { user } = useUser();

  if (isCollapsed) {
    return (
      <BaseSidebarFooter className="border-t border-slate-300 p-2">
        <div className="flex flex-col items-center gap-2">
          <Avatar className="h-8 w-8 border border-slate-300">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="w-full">
            <ThemeToggle sidebarTheme />
          </div>
        </div>
      </BaseSidebarFooter>
    );
  }

  return (
    <BaseSidebarFooter className="border-t border-slate-300 p-4 space-y-3">
      {/* User Info Section */}
      <div className="user-info">
        <Avatar className="h-10 w-10 border border-slate-300 flex-shrink-0">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {user?.displayName?.substring(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-sm font-semibold text-white truncate">
            {user?.displayName || 'User'}
          </span>
          <span className="text-xs text-slate-400 truncate">
            {user?.email || 'user@example.com'}
          </span>
        </div>
        <div className="text-xs">
          <span className="px-2 py-1 bg-primary/20 text-primary rounded-md border border-slate-300 font-medium">
            Pro
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex-1 justify-start gap-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-300"
        >
          <Link to="/settings">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </Button>
        <ThemeToggle sidebarTheme />
      </div>
    </BaseSidebarFooter>
  );
};

export default SidebarFooter;
