
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const LOGO_URL = "https://nexus-plaform.lovable.app/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png";

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className={cn(
      "flex items-center border-b border-slate-700 bg-slate-950",
      isCollapsed ? "justify-center py-6 px-2" : "py-5 gap-3 px-6 min-h-[80px]"
    )}>
      {isCollapsed ? (
        <Button
          variant="ghost"
          onClick={onToggle}
          aria-label="Expand sidebar"
          className="w-14 h-14 p-0 rounded-xl transition-all duration-200 hover:bg-primary/20 hover:scale-105 group text-slate-300 hover:text-white"
        >
          <img 
            src={LOGO_URL} 
            alt="NEXUS" 
            className="w-8 h-8 object-contain group-hover:drop-shadow-glow transition-all duration-200" 
          />
        </Button>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-primary/20 border border-primary/30">
              <img src={LOGO_URL} alt="NEXUS" className="w-7 h-7 object-contain" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent">
              NEXUS
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-9 w-9 hover:bg-slate-800 transition-all duration-200 text-primary hover:text-primary-400"
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
