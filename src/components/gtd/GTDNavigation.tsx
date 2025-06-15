
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Inbox, CheckCircle2, LayoutGrid, RefreshCw, Play } from "lucide-react";

const GTDNavigation = () => {
  const navItems = [
    {
      title: "Capture",
      icon: Inbox,
      view: "capture" as const,
      description: "Collect what has your attention"
    },
    {
      title: "Clarify",
      icon: CheckCircle2,
      view: "clarify" as const,
      description: "Process what it means"
    },
    {
      title: "Organize",
      icon: LayoutGrid,
      view: "organize" as const,
      description: "Put it where it belongs"
    },
    {
      title: "Reflect",
      icon: RefreshCw,
      view: "reflect" as const,
      description: "Review and update your system"
    },
    {
      title: "Engage",
      icon: Play,
      view: "engage" as const,
      description: "Simply do"
    }
  ];
  
  return (
    <TabsList>
      {navItems.map(item => (
        <TabsTrigger key={item.view} value={item.view} className="flex items-center gap-2">
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default GTDNavigation;
