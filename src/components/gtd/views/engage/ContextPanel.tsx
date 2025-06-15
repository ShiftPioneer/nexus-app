
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, AlertCircle } from "lucide-react";
import { GTDTask } from "../../GTDContext";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  tasks: GTDTask[];
  selectedContext: string | null;
  onContextSelect: (context: string | null) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({
  tasks,
  selectedContext,
  onContextSelect,
}) => {
  // Get unique contexts from tasks
  const contexts = [...new Set(tasks.map(task => task.context).filter(Boolean))];
  
  // Get tasks count for each context
  const getContextTaskCount = (context: string) => {
    return tasks.filter(task => task.context === context && task.status !== "completed" && task.status !== "deleted").length;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Very High": return "bg-red-500/20 text-red-500";
      case "High": return "bg-orange-500/20 text-orange-500";
      case "Medium": return "bg-lime-500/20 text-lime-600";
      case "Low": return "bg-blue-500/20 text-blue-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Contexts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button
            variant={selectedContext === null ? "default" : "outline"}
            className="w-full justify-start"
            onClick={() => onContextSelect(null)}
          >
            <span>All Contexts</span>
            <Badge variant="secondary" className="ml-auto">
              {tasks.filter(task => task.status !== "completed" && task.status !== "deleted").length}
            </Badge>
          </Button>
          
          {contexts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No contexts defined yet</p>
            </div>
          ) : (
            contexts.map(context => {
              const taskCount = getContextTaskCount(context);
              const contextTasks = tasks.filter(task => task.context === context);
              const urgentCount = contextTasks.filter(task => 
                task.priority === "Very High" && task.status !== "completed" && task.status !== "deleted"
              ).length;
              
              return (
                <Button
                  key={context}
                  variant={selectedContext === context ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => onContextSelect(context)}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">@{context}</span>
                      <div className="flex items-center gap-1">
                        {urgentCount > 0 && (
                          <Badge className="bg-red-500/20 text-red-500 text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {urgentCount}
                          </Badge>
                        )}
                        <Badge variant="secondary">
                          {taskCount}
                        </Badge>
                      </div>
                    </div>
                    
                    {taskCount > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["Very High", "High", "Medium", "Low"].map(priority => {
                          const count = contextTasks.filter(task => 
                            task.priority === priority && task.status !== "completed" && task.status !== "deleted"
                          ).length;
                          
                          if (count === 0) return null;
                          
                          return (
                            <Badge 
                              key={priority}
                              className={cn("text-xs py-0", getPriorityColor(priority))}
                            >
                              {count} {priority}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContextPanel;
