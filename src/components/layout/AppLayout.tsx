
import React, { useState, useEffect } from "react";
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

  // Close mobile menu when clicking outside or resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mobileMenuOpen && !target.closest('.sidebar') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        {/* Desktop Sidebar */}
        {!isMobile && <div className="sidebar"><Sidebar /></div>}
        
        {/* Mobile Sidebar - conditionally rendered */}
        {isMobile && mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          >
            <div 
              className="sidebar fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] text-white overflow-auto transform transition-transform duration-300 ease-in-out" 
              onClick={e => e.stopPropagation()}
            >
              <Sidebar />
            </div>
          </div>
        )}
        
        <div className="flex flex-col flex-1 w-full h-screen overflow-hidden">
          <TopBar 
            showMobileMenu={isMobile} 
            toggleMobileMenu={toggleMobileMenu} 
            className="mobile-menu-button"
          />
          <main className="flex-1 overflow-auto scrollbar-none w-full">
            <div className="mx-auto p-3 md:p-6 min-h-[calc(100vh-4rem)] w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
