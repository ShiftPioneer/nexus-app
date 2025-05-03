
import React, { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { GTDProvider } from "@/components/gtd/GTDContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({
  children
}: AppLayoutProps) => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    try {
      // Load profile data from localStorage
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }

    // Listen for profile updates
    const handleProfileUpdate = (e: any) => {
      setProfileData(e.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const getUserName = () => {
    if (profileData?.name) {
      return profileData.name;
    }
    
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    return user?.email?.split('@')[0] || "User";
  };
  
  const getUserAvatar = () => {
    return profileData?.avatar || user?.user_metadata?.avatar_url || "";
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background w-full">
      <SidebarProvider>
        <GTDProvider>
          {/* Desktop Sidebar */}
          {!isMobile && <Sidebar />}
          
          {/* Mobile Sidebar - conditionally rendered */}
          {isMobile && mobileMenuOpen && (
            <div 
              className="fixed inset-0 z-50 bg-black bg-opacity-75 transition-opacity" 
              onClick={() => setMobileMenuOpen(false)}
            >
              <div 
                className="fixed inset-y-0 left-0 w-64 bg-[#1A1F2C] text-white overflow-auto transform transition-transform duration-300 ease-in-out" 
                onClick={e => e.stopPropagation()}
              >
                <Sidebar />
              </div>
            </div>
          )}
          
          <div className="flex flex-col flex-1 overflow-hidden w-full">
            <TopBar showMobileMenu={isMobile} toggleMobileMenu={toggleMobileMenu} />
            <main className="flex-1 overflow-auto scrollbar-none transition-all duration-300">
              <div className="container mx-auto p-3 md:p-6 transition-all duration-300 max-w-full">
                {children}
              </div>
            </main>
          </div>
        </GTDProvider>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;
