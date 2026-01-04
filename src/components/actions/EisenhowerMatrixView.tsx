import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Trash2,
  Zap,
  Target,
  AlertTriangle,
  Coffee
} from "lucide-react";
import { motion } from "framer-motion";
import { UnifiedTask } from "@/types/unified-tasks";
import { cn } from "@/lib/utils";

interface EisenhowerMatrixViewProps {
  tasks: UnifiedTask[];
  taskTypeFilter: "all" | "todo" | "not-todo";
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const EisenhowerMatrixView: React.FC<EisenhowerMatrixViewProps> = ({
  tasks,
  taskTypeFilter,
  onComplete,
  onDelete,
}) => {
  const quadrants = [
    {
      id: "doFirst",
      title: "Do First",
      subtitle: "Urgent & Important",
      icon: Zap,
      gradient: "from-red-500 to-orange-500",
      bgClass: "bg-red-500/10",
      borderClass: "border-red-500/30",
      filter: (t: UnifiedTask) => t.urgent && t.important,
    },
    {
      id: "schedule",
      title: "Schedule",
      subtitle: "Important, Not Urgent",
      icon: Target,
      gradient: "from-blue-500 to-indigo-500",
      bgClass: "bg-blue-500/10",
      borderClass: "border-blue-500/30",
      filter: (t: UnifiedTask) => !t.urgent && t.important,
    },
    {
      id: "delegate",
      title: "Delegate",
      subtitle: "Urgent, Not Important",
      icon: AlertTriangle,
      gradient: "from-yellow-500 to-orange-400",
      bgClass: "bg-yellow-500/10",
      borderClass: "border-yellow-500/30",
      filter: (t: UnifiedTask) => t.urgent && !t.important,
    },
    {
      id: "consider",
      title: "Consider",
      subtitle: "Neither Urgent Nor Important",
      icon: Coffee,
      gradient: "from-slate-500 to-slate-600",
      bgClass: "bg-slate-500/10",
      borderClass: "border-slate-500/30",
      filter: (t: UnifiedTask) => !t.urgent && !t.important,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map((quadrant, index) => {
          const quadrantTasks = tasks.filter(quadrant.filter);
          const todoTasks = quadrantTasks.filter(t => t.type === "todo");
          const notTodoTasks = quadrantTasks.filter(t => t.type === "not-todo");
          
          const Icon = quadrant.icon;

          return (
            <motion.div
              key={quadrant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={cn("h-full", quadrant.bgClass, quadrant.borderClass)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl bg-gradient-to-r flex items-center justify-center",
                        quadrant.gradient
                      )}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{quadrant.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{quadrant.subtitle}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{quadrantTasks.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* To Do Section */}
                  {(taskTypeFilter === "all" || taskTypeFilter === "todo") && todoTasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">To Do</span>
                        <Badge variant="outline" className="text-xs ml-auto">{todoTasks.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {todoTasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onComplete={onComplete} 
                            onDelete={onDelete} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Not To Do Section */}
                  {(taskTypeFilter === "all" || taskTypeFilter === "not-todo") && notTodoTasks.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium text-red-500">Not To Do</span>
                        <Badge variant="outline" className="text-xs ml-auto">{notTodoTasks.length}</Badge>
                      </div>
                      <div className="space-y-2">
                        {notTodoTasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onComplete={onComplete} 
                            onDelete={onDelete} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {quadrantTasks.length === 0 && (
                    <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
                      No tasks in this quadrant
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-muted/50 rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>To Do: Actions to take</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <XCircle className="h-4 w-4 text-red-500" />
          <span>Not To Do: Behaviors to avoid</span>
        </div>
      </div>
    </div>
  );
};

interface TaskItemProps {
  task: UnifiedTask;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  return (
    <div className={cn(
      "group flex items-center gap-3 p-2 rounded-lg bg-background/50 hover:bg-background transition-colors",
      task.type === "not-todo" && "border-l-2 border-l-red-500"
    )}>
      <button
        onClick={() => onComplete(task.id)}
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
          task.type === "todo" 
            ? "border-green-500 hover:bg-green-500/20"
            : "border-red-500 hover:bg-red-500/20"
        )}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && (
          task.type === "todo" 
            ? <CheckCircle className="h-3 w-3 text-green-500" />
            : <XCircle className="h-3 w-3 text-red-500" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          task.completed && "line-through text-muted-foreground"
        )}>
          {task.title}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => onDelete(task.id)}
      >
        <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
      </Button>
    </div>
  );
};

export default EisenhowerMatrixView;
