
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar 
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  CheckCircle, 
  BookOpen, 
  Calendar, 
  Target, 
  LayoutGrid, 
  Settings, 
  FileText, 
  Brain, 
  Zap, 
  Repeat, 
  LineChart, 
  TimerReset,
  ChevronLeft,
  User,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavigationMenuProps {
  isCollapsed?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isCollapsed = false
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, signOut } = useAuth();
  
  const menuItems = [{
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard
  }, {
    title: "GTD",
    path: "/gtd",
    icon: CheckCircle
  }, {
    title: "Tasks",
    path: "/tasks",
    icon: CheckCircle
  }, {
    title: "Time Design",
    path: "/time-design",
    icon: TimerReset
  }, {
    title: "Goals",
    path: "/planning",
    icon: Target
  }, {
    title: "Habits",
    path: "/habits",
    icon: Repeat
  }, {
    title: "Focus",
    path: "/focus",
    icon: Zap
  }, {
    title: "Mindset",
    path: "/mindset",
    icon: Brain
  }, {
    title: "Knowledge",
    path: "/knowledge",
    icon: FileText
  }, {
    title: "Journal",
    path: "/journal",
    icon: BookOpen
  }, {
    title: "Energy",
    path: "/energy",
    icon: Calendar
  }, {
    title: "Stats",
    path: "/stats",
    icon: LineChart
  }, {
    title: "Settings",
    path: "/settings",
    icon: Settings
  }];
  
  const goBack = () => {
    window.history.back();
  };
  
  return (
    <div className="flex flex-col h-full justify-between">
      <SidebarMenu className="space-y-1 scrollbar-none">
        <SidebarMenuItem>
          <button onClick={goBack} className="w-full flex items-center justify-center p-2 text-[#B0B5BD] hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
            {!isCollapsed && <span className="ml-2">Back</span>}
          </button>
        </SidebarMenuItem>
        
        <div className="border-b border-[#2A2F3C] my-2"></div>
        
        {menuItems.map(item => (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton asChild isActive={currentPath === item.path} tooltip={isCollapsed ? item.title : undefined} className={cn("hover:bg-[#2A2F3C] transition-all duration-300 group", currentPath === item.path ? "bg-[#2A2F3C] text-[#0FA0CE]" : "text-[#B0B5BD]", isCollapsed ? "justify-center" : "px-2")}>
              <motion.div className="w-full" whileHover={{
                scale: 1.05
              }} whileTap={{
                scale: 0.95
              }}>
                <Link to={item.path} className="w-full flex items-center gap-3">
                  <motion.div whileHover={{
                    scale: 1.2
                  }} transition={{
                    duration: 0.3
                  }}>
                    <item.icon className={cn("h-5 w-5 transition-transform transform duration-300", currentPath === item.path ? "text-[#0FA0CE]" : "text-[#B0B5BD]")} />
                  </motion.div>
                  
                  {!isCollapsed && (
                    <span className="text-sm font-medium transition-transform duration-300 group-hover:translate-x-1">
                      {item.title}
                    </span>
                  )}
                </Link>
              </motion.div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      {/* Profile Section */}
      <div className="mt-auto pt-4 border-t border-[#2A2F3C]">
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={isCollapsed ? "Profile" : undefined} className="hover:bg-[#2A2F3C] transition-all duration-300 group text-[#B0B5BD]">
            <Link to="/settings" className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-[#0FA0CE]/30">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback className="bg-[#0FA0CE]/20 text-[#0FA0CE]">
                  {user?.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              
              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white truncate max-w-[120px]">
                    {user?.displayName || "User"}
                  </span>
                  <span className="text-xs text-[#B0B5BD] truncate max-w-[120px]">
                    {user?.email || "user@example.com"}
                  </span>
                </div>
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip={isCollapsed ? "Logout" : undefined} className="hover:bg-[#2A2F3C] transition-all duration-300 group text-[#B0B5BD]">
            <button 
              onClick={() => signOut && signOut()} 
              className="w-full flex items-center gap-3"
            >
              <LogOut className="h-5 w-5" />
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  Logout
                </span>
              )}
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </div>
    </div>
  );
};

export default NavigationMenu;
