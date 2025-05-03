
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Listen for sidebar state changes
    const handleSidebarStateChange = (e: CustomEvent) => {
      setIsSidebarCollapsed(e.detail.collapsed);
    };
    
    // Add event listener for sidebar state
    window.addEventListener('sidebarStateChanged', handleSidebarStateChange as EventListener);
    
    // Initial check for mobile
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('sidebarStateChanged', handleSidebarStateChange as EventListener);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <main 
        className={cn(
          "flex-1 px-4 md:px-8 py-6 transition-all duration-300 app-layout",
          !isMobile && (isSidebarCollapsed ? "sidebar-collapsed" : "sidebar-expanded")
        )}
      >
        <div className="container mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
