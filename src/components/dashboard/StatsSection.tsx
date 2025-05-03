
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Target, Calendar, BarChart2 } from "lucide-react";

const StatsSection = () => {
  // Mock stats data
  const stats = [
    {
      title: "Habit Streak",
      value: "7 days",
      change: "+2 from last week",
      icon: <CheckCircle className="h-8 w-8 text-success" />,
      color: "bg-success/10 border-success/20",
    },
    {
      title: "Goals Progress",
      value: "62%",
      change: "4 active goals",
      icon: <Target className="h-8 w-8 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      title: "Tasks Completed",
      value: "12/15",
      change: "80% completion rate",
      icon: <Calendar className="h-8 w-8 text-secondary" />,
      color: "bg-secondary/10 border-secondary/20",
    },
    {
      title: "Productivity Score",
      value: "85",
      change: "+5 points this week",
      icon: <BarChart2 className="h-8 w-8 text-accent" />,
      color: "bg-accent/10 border-accent/20",
    },
  ];

  return (
    <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={`overflow-hidden card-hover border ${stat.color} h-auto`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </div>
              <div>{stat.icon}</div>
            </div>
            
            {/* Simple progress indicator */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded mt-3">
              <div 
                className="h-full rounded transition-all duration-500"
                style={{ 
                  width: stat.title.includes("Progress") ? stat.value : `${Math.random() * 100}%`,
                  backgroundColor: stat.icon.props.className.includes("success") ? "#39D98A" : 
                                stat.icon.props.className.includes("primary") ? "#FF6500" :
                                stat.icon.props.className.includes("secondary") ? "#024CAA" : "#00D4FF"
                }}
              ></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};

export default StatsSection;
