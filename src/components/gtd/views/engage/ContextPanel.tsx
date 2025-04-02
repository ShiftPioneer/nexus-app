
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GTDTask } from "../../GTDContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  tasks: GTDTask[];
  contexts: string[];
  onStartFocus: (taskTitle: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const ContextPanel: React.FC<ContextPanelProps> = ({ 
  tasks, 
  contexts, 
  onStartFocus, 
  onCompleteTask 
}) => {
  const [activeContext, setActiveContext] = useState<string>(contexts[0] || "");
  
  // Map of context -> tasks
  const tasksByContext: Record<string, GTDTask[]> = {};
  
  // Initialize with empty arrays
  contexts.forEach(context => {
    tasksByContext[context] = [];
  });
  
  // Fill with tasks
  tasks.forEach(task => {
    if (task.context) {
      if (!tasksByContext[task.context]) {
        tasksByContext[task.context] = [];
      }
      tasksByContext[task.context].push(task);
    }
  });
  
  // Tasks with no context
  const tasksWithoutContext = tasks.filter(task => !task.context);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Tasks by Context</CardTitle>
      </CardHeader>
      <CardContent>
        {contexts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No contexts defined. Try adding contexts to your tasks for better organization.
          </div>
        ) : (
          <Tabs defaultValue={activeContext} onValueChange={setActiveContext}>
            <TabsList className="mb-4 flex-wrap">
              {contexts.map(context => (
                <TabsTrigger key={context} value={context}>
                  @{context}
                </TabsTrigger>
              ))}
              {tasksWithoutContext.length > 0 && (
                <TabsTrigger value="no-context">No Context</TabsTrigger>
              )}
            </TabsList>
            
            {contexts.map(context => (
              <TabsContent key={context} value={context}>
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {tasksByContext[context]?.length || 0} tasks in @{context}
                  </h3>
                  
                  {tasksByContext[context]?.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No tasks with this context
                    </div>
                  ) : (
                    tasksByContext[context]?.map(task => (
                      <TaskItem 
                        key={task.id}
                        task={task}
                        onStartFocus={onStartFocus}
                        onCompleteTask={onCompleteTask}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            ))}
            
            {tasksWithoutContext.length > 0 && (
              <TabsContent value="no-context">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {tasksWithoutContext.length} tasks without context
                  </h3>
                  
                  {tasksWithoutContext.map(task => (
                    <TaskItem 
                      key={task.id}
                      task={task}
                      onStartFocus={onStartFocus}
                      onCompleteTask={onCompleteTask}
                    />
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

interface TaskItemProps {
  task: GTDTask;
  onStartFocus: (taskTitle: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onStartFocus, onCompleteTask }) => {
  // Get color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Very High": return "bg-red-500/20 text-red-500";
      case "High": return "bg-orange-500/20 text-orange-500";
      case "Medium": return "bg-yellow-500/20 text-yellow-500";
      case "Low": return "bg-blue-500/20 text-blue-500";
      default: return "bg-gray-500/20 text-gray-500";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent/5 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full hover:bg-green-100 hover:text-green-700 text-muted-foreground"
          onClick={() => onCompleteTask(task.id)}
        >
          <CheckCircle className="h-5 w-5" />
        </Button>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{task.title}</h4>
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-1">
            {task.timeEstimate && (
              <Badge variant="outline" className="text-xs py-0 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.timeEstimate} min
              </Badge>
            )}
            <Badge className={cn("text-xs py-0", getPriorityColor(task.priority))}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
      
      <Button 
        size="sm" 
        onClick={() => onStartFocus(task.title)}
        className="ml-2 bg-[#FF5722] hover:bg-[#E64A19] text-white"
      >
        <Play className="h-4 w-4 mr-1" />
        Focus
      </Button>
    </div>
  );
};

export default ContextPanel;
