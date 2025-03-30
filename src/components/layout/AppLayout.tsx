
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import NavigationMenu from "./NavigationMenu";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar 
        variant="sidebar"
        collapsible="icon"
        style={{
          '--sidebar-width': '12rem',
          '--sidebar-width-icon': '1.5rem'
        } as React.CSSProperties}
      >
        <SidebarRail />
        <SidebarContent>
          <NavigationMenu />
        </SidebarContent>
      </Sidebar>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
