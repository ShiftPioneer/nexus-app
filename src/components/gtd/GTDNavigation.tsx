
import React from "react";
import { useGTD } from "./GTDContext";
import { Inbox, CheckCircle2, LayoutGrid, RefreshCw, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const GTDNavigation = () => {
  const { activeView, setActiveView } = useGTD();
  
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
    <div className="flex flex-wrap gap-2 mb-8">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => setActiveView(item.view)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300",
            activeView === item.view 
              ? "bg-blue-600 text-white" 
              : "bg-slate-800 text-slate-200 hover:bg-slate-700"
          )}
        >
          <item.icon className="h-5 w-5" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
};

export default GTDNavigation;
