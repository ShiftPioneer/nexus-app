
import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Target,
  ListTodo,
  Clock,
  Zap,
  Brain,
  BookText,
  BookOpen,
  Settings,
  Timer
} from "lucide-react";

const NavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Goals & Planning",
      icon: Target,
      path: "/planning",
    },
    {
      title: "Tasks",
      icon: ListTodo,
      path: "/tasks",
    },
    {
      title: "Time Design",
      icon: Clock,
      path: "/time-design",
    },
    {
      title: "Focus",
      icon: Timer,
      path: "/focus",
    },
    {
      title: "Energy",
      icon: Zap,
      path: "/energy",
    },
    {
      title: "Mindset OS",
      icon: Brain,
      path: "/mindset",
    },
    {
      title: "Journal",
      icon: BookText,
      path: "/journal",
    },
    {
      title: "Knowledge",
      icon: BookOpen,
      path: "/knowledge",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive(item.path)}
                  tooltip={item.title}
                >
                  <Link to={item.path} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive("/settings")}
                tooltip="Settings"
              >
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default NavigationMenu;
