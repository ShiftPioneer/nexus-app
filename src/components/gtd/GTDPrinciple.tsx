
import React from "react";
import { useGTD } from "./GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Inbox, CheckCircle2, LayoutGrid, RefreshCw, Play } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const GTDPrinciple: React.FC = () => {
  const { activeView } = useGTD();
  
  // Updated principles with visually distinct colors
  const principles = [
    {
      key: "capture",
      title: "1. Capture",
      description: "Collect everything that has your attention in a trusted system outside your mind.",
      icon: Inbox,
      color: "bg-blue-500/20 border-blue-500/50 text-blue-500"
    },
    {
      key: "clarify",
      title: "2. Clarify",
      description: "Process what it means. Is it actionable? What's the next action?",
      icon: CheckCircle2,
      color: "bg-green-500/20 border-green-500/50 text-green-500"
    },
    {
      key: "organize",
      title: "3. Organize",
      description: "Put it where it belongs. Categorize and prioritize.",
      icon: LayoutGrid,
      color: "bg-purple-500/20 border-purple-500/50 text-purple-500"
    },
    {
      key: "reflect",
      title: "4. Reflect",
      description: "Review regularly. Keep your system updated and trustworthy.",
      icon: RefreshCw,
      color: "bg-amber-500/20 border-amber-500/50 text-amber-500"
    },
    {
      key: "engage",
      title: "5. Engage",
      description: "Simply do. Choose the right action at the right time.",
      icon: Play,
      color: "bg-rose-500/20 border-rose-500/50 text-rose-500"
    }
  ];

  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader>
        <CardTitle>GTD Principles</CardTitle>
        <CardDescription className="text-slate-400">Effective task management workflow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {principles.map((principle) => (
          <motion.div 
            key={principle.key}
            className={cn(
              "px-4 py-5 rounded-xl border transition-all duration-300",
              principle.color,
              activeView === principle.key ? "scale-[1.02] shadow-lg" : "opacity-90"
            )}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-slate-800/50">
                <principle.icon className={cn("h-5 w-5", principle.key === activeView ? "text-white" : "")} />
              </div>
              <div>
                <h4 className="font-semibold mb-1 text-slate-50">{principle.title}</h4>
                <p className="text-gray-300 text-sm">
                  {principle.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GTDPrinciple;
