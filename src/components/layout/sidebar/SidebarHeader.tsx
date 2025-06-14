
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
      "flex items-center border-b border-slate-300 bg-slate-950 flex-shrink-0 h-4 overflow-hidden",
      isCollapsed ? "justify-center px-0.5" : "gap-1 px-1"
    )}>
      {isCollapsed ? (
        <Button
          variant="ghost"
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="w-3 h-3 p-0 rounded transition-all duration-200 hover:bg-primary/20 hover:scale-105 group text-slate-300 hover:text-white"
        >
          <img 
            src={LOGO_URL} 
            alt="NEXUS" 
            className="w-2.5 h-2.5 object-contain group-hover:drop-shadow-glow transition-all duration-200" 
          />
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-0.5">
            <div className="w-3 h-3 rounded flex items-center justify-center shadow-sm bg-primary/20 border border-slate-300">
              <img src={LOGO_URL} alt="NEXUS" className="w-2.5 h-2.5 object-contain" />
            </div>
            <span className="text-[10px] font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent leading-none">
              NEXUS
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-3 w-3 hover:bg-slate-800 transition-all duration-200 text-primary hover:text-primary-400 p-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-2.5 w-2.5" />
          </Button>
        </>
      )}
    </div>
  );
};

export default SidebarHeader;
