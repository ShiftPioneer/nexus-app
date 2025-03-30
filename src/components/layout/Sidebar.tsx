
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Target,
  CheckCircle,
  Clock,
  Zap,
  Sparkles,
  BookOpen,
  Brain,
  LayoutGrid,
  BarChart3,
  Settings,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Planning",
      path: "/planning",
      icon: Target,
    },
    {
      title: "Tasks",
      path: "/tasks",
      icon: CheckCircle,
    },
    {
      title: "Time Design",
      path: "/time-design",
      icon: Clock,
    },
    {
      title: "Energy",
      path: "/energy",
      icon: Zap,
    },
    {
      title: "Focus",
      path: "/focus",
      icon: Sparkles,
    },
    {
      title: "Journal",
      path: "/journal",
      icon: BookOpen,
    },
    {
      title: "Mindset",
      path: "/mindset",
      icon: Brain,
    },
    {
      title: "Knowledge",
      path: "/knowledge",
      icon: LayoutGrid,
    },
    {
      title: "Stats",
      path: "/stats",
      icon: BarChart3,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <ShadcnSidebar
      variant="sidebar"
      collapsible="icon"
      style={{
        '--sidebar-width': '10rem', // narrower width
        '--sidebar-width-icon': '1.5rem'
      } as React.CSSProperties}
    >
      <SidebarRail />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton 
                asChild 
                isActive={currentPath === item.path}
                tooltip={item.title}
              >
                <Link to={item.path} className="w-full">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </ShadcnSidebar>
  );
};

export default Sidebar;
