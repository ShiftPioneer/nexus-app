
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";

interface SidebarFooterProps {
  isCollapsed: boolean;
}

const settingsItem = {
  name: "Settings",
  path: "/settings",
  icon: Settings,
  description: "App preferences"
};

const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const location = useLocation();

  return (
    <div className={cn(
      "border-t border-slate-700 bg-slate-950",
      isCollapsed ? "p-3" : "px-4 py-3"
    )}>
      <Link to={settingsItem.path} className="block">
        <div
          className={cn(
            "flex items-center transition-all duration-200 group relative rounded-xl",
            isCollapsed 
              ? "w-12 h-12 justify-center mx-auto"
              : "gap-3 px-3 py-3",
            location.pathname === settingsItem.path
              ? "bg-primary/20 text-primary shadow-lg" 
              : "text-slate-300 hover:bg-slate-800 hover:text-white"
          )}
        >
          <div className={cn(
            "flex-shrink-0 flex items-center justify-center transition-all duration-200",
            isCollapsed ? "w-5 h-5" : "w-8 h-8 rounded-lg",
            location.pathname === settingsItem.path ? "text-primary" : "group-hover:text-primary"
          )}>
            <Settings className="h-5 w-5" />
          </div>
          
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 flex-1">
              <span className={cn(
                "text-sm font-medium leading-tight",
                location.pathname === settingsItem.path ? "text-white" : "text-slate-200 group-hover:text-white"
              )}>
                {settingsItem.name}
              </span>
              <span className="text-xs text-slate-400 leading-tight">
                {settingsItem.description}
              </span>
            </div>
          )}
          
          {location.pathname === settingsItem.path && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
          )}
        </div>
      </Link>
    </div>
  );
};

export default SidebarFooter;
