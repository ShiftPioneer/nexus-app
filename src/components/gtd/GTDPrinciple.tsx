
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox, List, CheckCheck, Rocket, Calendar } from "lucide-react";

const GTDPrinciple: React.FC = () => {
  const principles = [
    {
      icon: <Inbox className="h-8 w-8" />,
      title: "Capture",
      description: "Collect what has your attention",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <List className="h-8 w-8" />,
      title: "Clarify",
      description: "Process what it means",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <CheckCheck className="h-8 w-8" />,
      title: "Organize",
      description: "Put it where it belongs",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Reflect",
      description: "Review frequently",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      iconColor: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Engage",
      description: "Simply do",
      bgColor: "bg-rose-100 dark:bg-rose-900/20",
      iconColor: "text-rose-600 dark:text-rose-400"
    }
  ];
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <h2 className="text-xl font-semibold">GTD Principles</h2>
          <p className="text-muted-foreground text-sm">The five pillars of Getting Things Done</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 divide-x divide-y sm:divide-y-0 divide-border">
          {principles.map((principle) => (
            <div 
              key={principle.title} 
              className="p-4 flex flex-col items-center text-center hover:bg-accent/50 transition-colors"
            >
              <div className={`p-3 rounded-lg mb-2 ${principle.bgColor}`}>
                <div className={principle.iconColor}>
                  {principle.icon}
                </div>
              </div>
              <h3 className="font-medium">{principle.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{principle.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GTDPrinciple;
