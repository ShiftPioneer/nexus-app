
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import NavigationMenu from "./NavigationMenu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.displayName) return "U";
    return user.displayName.split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Get user display name or default
  const displayName = user?.displayName || "User";
  const userInitials = getUserInitials();

  return (
    <div className="relative h-screen">
      <ShadcnSidebar 
        variant="sidebar" 
        className={cn(
          "transition-all duration-300 ease-in-out bg-[#1A1F2C] text-white border-r border-[#2A2F3C]", 
          isCollapsed ? 'collapsed w-[4rem]' : 'w-[14rem]', 
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
            <AnimatePresence initial={false} mode="wait">
              {!isCollapsed ? (
                <motion.div
                  key="expanded"
                  className="flex items-center justify-between w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
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
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <img 
                    src="/lovable-uploads/a004fbed-90d6-44c1-bbf8-96e82ee8c546.png" 
                    alt="Nexus Logo" 
                    className="h-8 w-8 object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <NavigationMenu isCollapsed={isCollapsed} />
        </SidebarContent>
        
        <SidebarFooter className="border-t border-[#2A2F3C] p-3 bg-slate-950">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div 
                className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}
                style={{ cursor: 'pointer' }}
              >
                <Avatar className="h-8 w-8 bg-[#FF5722]/20 text-[#FF5722]">
                  <AvatarImage src={user?.photoURL || ""} alt={displayName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.div 
                      className="flex flex-col"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm font-medium truncate max-w-[120px]">{displayName}</span>
                      <span className="text-xs text-[#0FA0CE]">Pro Plan</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
