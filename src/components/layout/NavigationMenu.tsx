
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, CheckCircle, Clock, Zap, FileText, Brain, 
  BookOpen, Settings, BarChartHorizontal, Target, RefreshCw, CheckSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavigationMenuProps {
  isCollapsed?: boolean;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({
  isCollapsed = false
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard
    },
    {
      title: "GTD",
      path: "/gtd",
      icon: CheckSquare
    },
    {
      title: "Actions",
      path: "/actions",
      icon: CheckCircle
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock
    },
    {
      title: "Plans",
      path: "/planning",
      icon: Target
    },
    {
      title: "Habits",
      path: "/habits",
      icon: RefreshCw
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Brain
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Zap
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: BookOpen
    },
    {
      title: "Journal",
      path: "/journal",
      icon: FileText
    },
    {
      title: "Energy",
      path: "/energy",
      icon: Zap
    },
    {
      title: "Stats",
      path: "/stats",
      icon: BarChartHorizontal
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings
    }
  ];

  return (
    <SidebarMenu className="space-y-1 scrollbar-none">
      {menuItems.map(item => (
        <SidebarMenuItem key={item.path}>
          <SidebarMenuButton 
            asChild 
            isActive={currentPath === item.path} 
            tooltip={isCollapsed ? item.title : undefined} 
            className={cn(
              "hover:bg-slate-800 transition-all duration-300 group", 
              currentPath === item.path ? "bg-slate-800 text-secondary" : "text-slate-300",
              isCollapsed ? "justify-center" : "px-2"
            )}
          >
            <motion.div 
              className="w-full" 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link to={item.path} className="w-full flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.2 }} 
                  transition={{ duration: 0.3 }}
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 transition-transform transform duration-300", 
                      currentPath === item.path ? "text-secondary" : "text-slate-300"
                    )} 
                  />
                </motion.div>
                
                {!isCollapsed && (
                  <span className="transition-transform duration-300 group-hover:translate-x-1 text-base font-bold">
                    {item.title}
                  </span>
                )}
              </Link>
            </motion.div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavigationMenu;
