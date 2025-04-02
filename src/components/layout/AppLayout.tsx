
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        {!isMobile && <Sidebar />}
        
        {/* Mobile Sidebar - conditionally rendered */}
        {isMobile && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
            <div 
              className="fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] text-white overflow-auto transform transition-transform duration-300 ease-in-out" 
              onClick={e => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar 
            showMobileMenu={isMobile} 
            toggleMobileMenu={toggleMobileMenu}
          />
          <main className="flex-1 overflow-auto scrollbar-none">
            <div className="container max-w-7xl mx-auto p-3 md:p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
