import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}
const LOGO_URL = "/lovable-uploads/nexus-app-logo.png";
const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isCollapsed,
  onToggle
}) => {
  const isMobile = useIsMobile();
  return <div className={cn("flex items-center bg-slate-950 flex-shrink-0 h-14 sm:h-16 overflow-hidden border-b border-slate-700/30", isCollapsed && !isMobile ? "justify-center px-2" : "gap-3 px-4")}>
      {isCollapsed && !isMobile ? <Button variant="ghost" onClick={onToggle} aria-label="Expand sidebar" className="w-10 h-10 p-0 rounded-lg transition-all duration-200 hover:bg-primary/20 hover:scale-105 group text-slate-300 hover:text-white border-0">
          <img src={LOGO_URL} alt="NEXUS" className="w-6 h-6 object-contain group-hover:drop-shadow-glow transition-all duration-200" />
        </Button> : <>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm bg-primary/20 border border-primary/20 flex-shrink-0">
              <img src={LOGO_URL} alt="NEXUS" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary-600 bg-clip-text text-transparent truncate">
              NEXUS
            </span>
          </div>
          
          {/* Close button - different icons for mobile vs desktop */}
          <Button variant="ghost" size="icon" onClick={onToggle} aria-label={isMobile ? "Close sidebar" : "Collapse sidebar"} className="ml-auto h-8 w-8 sm:h-9 sm:w-9 hover:bg-slate-800 transition-all duration-200 border-0 flex-shrink-0 text-status-pending">
            {isMobile ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </>}
    </div>;
};
export default SidebarHeader;