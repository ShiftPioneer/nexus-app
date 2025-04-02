import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GTDTask } from "../../GTDContext";
import { Clock, CheckCircle, Play, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TasksPanelProps {
  tasks: GTDTask[];
  onStartFocus: (taskTitle: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const TasksPanel: React.FC<TasksPanelProps> = ({ tasks, onStartFocus, onCompleteTask }) => {
  // Sort tasks by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder = {
      "Very High": 1,
      "High": 2,
      "Medium": 3,
      "Low": 4,
      "Very Low": 5
    };
    
    return (priorityOrder[a.priority] || 3) - (priorityOrder[b.priority] || 3);
  });
  
  // Group tasks by today and other
  const todayTasks = sortedTasks.filter(task => task.tags?.includes("today"));
  const otherTasks = sortedTasks.filter(task => !task.tags?.includes("today"));

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
    <div className="space-y-6">
      {/* Today's Tasks Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Today's Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No tasks planned for today
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  priorityColor={getPriorityColor(task.priority)}
                  onStartFocus={onStartFocus}
                  onCompleteTask={onCompleteTask}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Next Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Next Actions</CardTitle>
        </CardHeader>
        <CardContent>
          {otherTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No next actions available
            </div>
          ) : (
            <div className="space-y-3">
              {otherTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  priorityColor={getPriorityColor(task.priority)}
                  onStartFocus={onStartFocus}
                  onCompleteTask={onCompleteTask}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface TaskItemProps {
  task: GTDTask;
  priorityColor: string;
  onStartFocus: (taskTitle: string) => void;
  onCompleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, priorityColor, onStartFocus, onCompleteTask }) => {
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
            {task.context && (
              <Badge variant="outline" className="text-xs py-0">
                @{task.context}
              </Badge>
            )}
            {task.timeEstimate && (
              <Badge variant="outline" className="text-xs py-0 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {task.timeEstimate} min
              </Badge>
            )}
            <Badge className={cn("text-xs py-0", priorityColor)}>
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

export default TasksPanel;
