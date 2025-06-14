
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const LOGO_URL = "https://nexus-plaform.lovable.app/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png";

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={cn(
      "flex items-center bg-slate-950 flex-shrink-0 h-16 overflow-hidden",
      isCollapsed ? "justify-center px-2" : "gap-3 px-4"
    )}>
      {isCollapsed ? (
        <Button
          variant="ghost"
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="w-10 h-10 p-0 rounded transition-all duration-200 hover:bg-primary/20 hover:scale-105 group text-slate-300 hover:text-white"
        >
          <img 
            src={LOGO_URL} 
            alt="NEXUS" 
            className="w-6 h-6 object-contain group-hover:drop-shadow-glow transition-all duration-200" 
          />
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded flex items-center justify-center shadow-sm bg-primary/20 border border-slate-300">
              <img src={LOGO_URL} alt="NEXUS" className="w-6 h-6 object-contain" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              NEXUS
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-8 w-8 hover:bg-slate-800 transition-all duration-200 text-primary hover:text-primary-400"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default SidebarHeader;
