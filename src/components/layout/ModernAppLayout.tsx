import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModernTopBar from "./ModernTopBar";
import ModernSidebar from "./ModernSidebar";
import { GTDProvider } from "@/components/gtd/GTDContext";
import AIAssistant from "@/components/ai-assistant/AIAssistant";
import { useAIAssistant } from "@/hooks/use-ai-assistant";
interface ModernAppLayoutProps {
  children: React.ReactNode;
}
const ModernAppLayout = ({
  children
}: ModernAppLayoutProps) => {
  const {
    isCollapsed,
    isMobile,
    toggleSidebar
  } = useSidebar();
  const aiAssistant = useAIAssistant();
  return <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarProvider>
        <GTDProvider>
          {/* Mobile Overlay */}
          {isMobile && !isCollapsed && <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity duration-300" onClick={toggleSidebar} aria-label="Close sidebar" />}
          
          {/* Sidebar */}
          <ModernSidebar isCollapsed={isCollapsed} isMobile={isMobile} onToggle={toggleSidebar} />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out min-w-0 h-full">
            <ModernTopBar onToggleSidebar={toggleSidebar} isCollapsed={isCollapsed} isMobile={isMobile} aiAssistant={aiAssistant} />
            
            <main className="flex-1 overflow-y-auto scrollbar-none bg-background h-full">
              <div className="h-full w-full p-3 sm:p-4 md:p-6 text-foreground min-h-full bg-background">
                {children}
              </div>
            </main>
          </div>
          
          {/* AI Assistant - Now positioned from header */}
          <AIAssistant isOpen={aiAssistant.isOpen} onToggle={aiAssistant.toggle} />
        </GTDProvider>
      </SidebarProvider>
    </div>;
};
export default ModernAppLayout;