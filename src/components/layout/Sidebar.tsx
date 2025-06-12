
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import NavigationMenu from "./NavigationMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapsedChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error("Failed to load profile data:", error);
    }

    const handleProfileUpdate = (e: any) => {
      setProfileData(e.detail);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleToggleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const handleProfileClick = () => {
    navigate("/settings");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getUserName = () => {
    if (profileData?.name) return profileData.name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    return user?.email?.split('@')[0] || "User";
  };

  const getUserAvatar = () => {
    return profileData?.avatar || user?.user_metadata?.avatar_url || "";
  };

  return (
    <div className="relative h-screen">
      <ShadcnSidebar 
        variant="sidebar" 
        className={cn(
          "transition-all duration-300 ease-in-out bg-[#1A1F2C] text-white border-r border-[#2A2F3C]",
          isCollapsed ? 'collapsed w-16' : 'w-56',
          "[&_[data-sidebar=content]]:scrollbar-none"
        )} 
        style={{
          '--sidebar-width': '14rem',
          '--sidebar-width-collapsed': '4rem'
        } as React.CSSProperties} 
        data-collapsed={isCollapsed}
      >
        <SidebarContent className="px-2 py-4 scrollbar-none bg-slate-950">
          <div className={cn(
            "flex items-center justify-between mb-6 px-2 transition-all duration-300",
            isCollapsed ? "justify-center" : ""
          )}>
            <AnimatePresence initial={false} mode="sync">
              {!isCollapsed ? (
                <motion.div 
                  key="expanded" 
                  className="flex items-center justify-between w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <h1 className="text-xl font-bold text-[#FF5722]">NEXUS</h1>
                  <motion.span 
                    className="p-1 cursor-pointer hover:bg-[#2A2F3C] rounded-md transition-colors"
                    onClick={handleToggleCollapse}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="h-5 w-5 text-[#FF6500] bg-transparent" />
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div 
                  key="collapsed"
                  className="cursor-pointer hover:bg-[#2A2F3C] rounded-md transition-colors p-1"
                  onClick={handleToggleCollapse}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img 
                    alt="Nexus Logo" 
                    src="/lovable-uploads/e401f047-a5a0-455c-8e42-9a9d9249d4fb.png" 
                    className="h-8 w-8 object-fill" 
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <NavigationMenu isCollapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-[#2A2F3C] p-3 bg-slate-950">
          <div 
            className={cn(
              "flex items-center mb-2",
              isCollapsed ? "justify-center" : "gap-3"
            )} 
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          >
            <Avatar className="h-8 w-8 bg-[#FF5722]/20 text-[#FF5722]">
              <AvatarImage src={getUserAvatar()} alt="User Profile" />
              <AvatarFallback>{getUserName().substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div 
                  className="flex flex-col flex-1 min-w-0"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <span className="text-sm font-medium truncate">{getUserName()}</span>
                  <span className="text-xs text-[#0FA0CE]">Pro Plan</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SidebarFooter>
      </ShadcnSidebar>

      {isCollapsed && (
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 left-[3.8rem] h-12 w-1 bg-[#2A2F3C] rounded-r cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          onClick={handleToggleCollapse}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          whileHover={{ opacity: 1 }}
        />
      )}
    </div>
  );
};

export default Sidebar;
