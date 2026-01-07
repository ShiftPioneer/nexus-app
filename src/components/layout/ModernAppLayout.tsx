import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModernTopBar from "./ModernTopBar";
import ModernSidebar from "./ModernSidebar";
import { GTDProvider } from "@/components/gtd/GTDContext";
import AIAssistant from "@/components/ai-assistant/AIAssistant";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
import { cn } from "@/lib/utils";

interface ModernAppLayoutProps {
  children: React.ReactNode;
}

const ModernAppLayout = ({
  children
}: ModernAppLayoutProps) => {
  const {
    isCollapsed,
    isMobile,
    toggleSidebar,
    setIsCollapsed
  } = useSidebar();
  const aiAssistant = useAIAssistant();
  
  // Auto-hide header on scroll (mobile only)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const mainRef = useRef<HTMLDivElement>(null);
  
  const handleScroll = useCallback(() => {
    if (!isMobile || !mainRef.current) return;
    
    const currentScrollY = mainRef.current.scrollTop;
    const scrollDelta = currentScrollY - lastScrollY.current;
    
    // Show header when scrolling up or at top
    if (scrollDelta < -5 || currentScrollY < 10) {
      setIsHeaderVisible(true);
    }
    // Hide header when scrolling down past threshold
    else if (scrollDelta > 5 && currentScrollY > 50) {
      setIsHeaderVisible(false);
      // Also close sidebar if open
      if (!isCollapsed) {
        setIsCollapsed(true);
      }
    }
    
    lastScrollY.current = currentScrollY;
  }, [isMobile, isCollapsed, setIsCollapsed]);
  
  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    
    mainElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => mainElement.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarProvider>
        <GTDProvider>
          {/* Mobile Overlay */}
          {isMobile && !isCollapsed && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300" 
              onClick={toggleSidebar} 
              aria-label="Close sidebar" 
            />
          )}
          
          {/* Sidebar */}
          <ModernSidebar isCollapsed={isCollapsed} isMobile={isMobile} onToggle={toggleSidebar} />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out min-w-0 h-full">
            {/* Auto-hiding header on mobile */}
            <div 
              className={cn(
                "transition-all duration-300 ease-out flex-shrink-0",
                isMobile && !isHeaderVisible && "h-0 opacity-0 overflow-hidden -translate-y-full"
              )}
            >
              <ModernTopBar 
                onToggleSidebar={toggleSidebar} 
                isCollapsed={isCollapsed} 
                isMobile={isMobile} 
                aiAssistant={aiAssistant} 
              />
            </div>
            
            <main 
              ref={mainRef}
              className="flex-1 overflow-y-auto scrollbar-none bg-background h-full"
            >
              <div className="h-full w-full p-3 sm:p-4 md:p-6 text-foreground min-h-full bg-background px-0 py-0">
                {children}
              </div>
            </main>
          </div>
          
          {/* AI Assistant */}
          <AIAssistant isOpen={aiAssistant.isOpen} onToggle={aiAssistant.toggle} />
        </GTDProvider>
      </SidebarProvider>
    </div>
  );
};

export default ModernAppLayout;