import React, { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const isMobile = useMobile();
  
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar 
        className={cn(
          "fixed inset-y-0 z-50 transition-all duration-300",
          showMobileMenu ? "left-0" : "-left-full",
          isMobile ? "w-[85%] sm:w-64" : "w-64 left-0"
        )} 
      />
      <div className="flex-1 flex flex-col ml-0 md:ml-64 relative">
        <TopBar 
          toggleMobileMenu={toggleMobileMenu} 
          className="md:pl-0" 
        />
        <main className="flex-1 pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
