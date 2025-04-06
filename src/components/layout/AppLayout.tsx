
import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-0 md:ml-64 relative">
          <TopBar 
            toggleSidebar={toggleMobileMenu}
          />
          <main className="flex-1 pt-16">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
