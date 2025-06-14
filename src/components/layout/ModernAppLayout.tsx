
import React from "react";
import { useSidebar } from "@/hooks/use-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ModernTopBar from "./ModernTopBar";
import ModernSidebar from "./ModernSidebar";
import { GTDProvider } from "@/components/gtd/GTDContext";

interface ModernAppLayoutProps {
  children: React.ReactNode;
}

const ModernAppLayout = ({ children }: ModernAppLayoutProps) => {
  const { isCollapsed, isMobile, toggleSidebar } = useSidebar();
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarProvider>
        <GTDProvider>
          {/* Sidebar */}
          <ModernSidebar 
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onToggle={toggleSidebar}
          />
          
          {/* Main Content Area */}
          <div className="flex flex-col flex-1 overflow-hidden transition-all duration-500 ease-in-out">
            <ModernTopBar 
              onToggleSidebar={toggleSidebar}
              isCollapsed={isCollapsed}
              isMobile={isMobile}
            />
            
            <main className="flex-1 overflow-y-auto bg-background scrollbar-none">
              <div className="h-full w-full p-4">
                {children}
              </div>
            </main>
          </div>
          
          {/* Mobile Overlay */}
          {isMobile && !isCollapsed && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
              onClick={toggleSidebar}
            />
          )}
        </GTDProvider>
      </SidebarProvider>
    </div>
  );
};

export default ModernAppLayout;
