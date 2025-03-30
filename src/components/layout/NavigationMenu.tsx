
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
  Settings,
} from "lucide-react";

const NavigationMenu = () => {
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
      title: "Habits",
      path: "/habits",
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
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
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
  );
};

export default NavigationMenu;
