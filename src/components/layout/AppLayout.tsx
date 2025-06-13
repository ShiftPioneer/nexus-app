import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { GTDProvider } from "@/components/gtd/GTDContext";
interface AppLayoutProps {
  children: React.ReactNode;
}
const AppLayout = ({
  children
}: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const {
    user
  } = useAuth();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  return <div className="flex h-screen overflow-hidden bg-background w-full">
      <SidebarProvider>
        <GTDProvider>
          {/* Desktop Sidebar */}
          {!isMobile && <Sidebar onCollapsedChange={setSidebarCollapsed} />}
          
          {/* Mobile Sidebar - conditionally rendered */}
          {isMobile && mobileMenuOpen && <div className="fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity" onClick={() => setMobileMenuOpen(false)}>
              <div className="fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] text-white overflow-auto transform transition-transform duration-300 ease-in-out" onClick={e => e.stopPropagation()}>
                <Sidebar />
              </div>
            </div>}
          
          <div className="h-full w-full p-6">
            <TopBar showMobileMenu={isMobile} toggleMobileMenu={toggleMobileMenu} />
            <main className={`flex-1 overflow-auto scrollbar-none transition-all duration-300 ${!isMobile && sidebarCollapsed ? 'ml-16' : !isMobile ? 'ml-56' : 'ml-0'}`}>
              <div className={`container mx-auto transition-all duration-300 max-w-full ${isMobile ? 'p-3' : 'p-5'} ${isMobile ? 'mt-3 mb-3' : 'mt-5 mb-5'}`}>
                {children}
              </div>
            </main>
          </div>
        </GTDProvider>
      </SidebarProvider>
    </div>;
};
export default AppLayout;