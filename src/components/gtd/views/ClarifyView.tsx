
import React, { useState, useEffect } from "react";
import { useGTD } from "../GTDContext";
import { 
  Clock, User, Calendar, FileText, Trash, 
  ArrowRight, AlertCircle, Check, X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ClarifyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconTextClass: string;
  onDrop: (taskId: string) => void;
}

const ClarifyCard: React.FC<ClarifyCardProps> = ({
  title,
  description,
  icon,
  iconBgClass,
  iconTextClass,
  onDrop
}) => {
  const [isDropTarget, setIsDropTarget] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(true);
  };
  
  const handleDragLeave = () => {
    setIsDropTarget(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropTarget(false);
    const taskId = e.dataTransfer.getData("text/plain");
    onDrop(taskId);
  };
  
  return (
    <Card
      className={cn(
        "border-2 transition-all duration-300",
        isDropTarget 
          ? `bg-opacity-10 border-${iconTextClass} shadow-lg` 
          : "bg-card border-border"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("p-2 rounded-lg", iconBgClass)}>
            <div className={cn("h-8 w-8", iconTextClass)}>
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        {isDropTarget && (
          <div className="mt-2 p-2 bg-accent/10 rounded-md border border-dashed border-accent">
            <p className="text-sm text-center">Drop task here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface TaskCardProps {
  task: any;
  onTaskClick: (task: any) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", task.id);
    e.dataTransfer.effectAllowed = "move";
  };
  
  return (
    <Card 
      className="cursor-grab border bg-card mb-3"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onTaskClick(task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-medium mb-1">{task.title}</h4>
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2">
              {task.tags?.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              
              {task.dueDate && (
                <Badge variant="outline" className="text-xs flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
          
          <div className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`} />
        </div>
      </CardContent>
    </Card>
  );
};

const ClarifyView: React.FC = () => {
  const { tasks, moveTask, updateTask, getTaskById } = useGTD();
  const { toast } = useToast();
  const [inboxTasks, setInboxTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Update inbox tasks when global tasks change
  useEffect(() => {
    setInboxTasks(tasks.filter(task => task.status === "inbox"));
  }, [tasks]);
  
  const handleDoIt = (taskId: string) => {
    moveTask(taskId, "next-action");
    toast({
      title: "Task moved",
      description: "Task moved to Next Actions list",
    });
  };
  
  const handleDelegateIt = (taskId: string) => {
    moveTask(taskId, "waiting-for");
    toast({
      title: "Task delegated",
      description: "Task moved to Waiting For list",
    });
  };
  
  const handleDeferIt = (taskId: string) => {
    moveTask(taskId, "someday");
    toast({
      title: "Task deferred",
      description: "Task moved to Someday/Maybe list",
    });
  };
  
  const handleReferenceIt = (taskId: string) => {
    moveTask(taskId, "reference");
    toast({
      title: "Task moved to reference",
      description: "Task moved to Reference materials",
    });
  };
  
  const handleDeleteIt = (taskId: string) => {
    moveTask(taskId, "deleted");
    toast({
      title: "Task deleted",
      description: "Task has been deleted",
    });
  };
  
  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
  };
  
  const handleAddTask = () => {
    // Navigate to capture view
  };
  
  return (
    <div className="space-y-6">
      <Card className="bg-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-xl">Clarify Your Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClarifyCard
              icon={<Clock className="h-8 w-8" />}
              title="Do It"
              description="If it takes less than 2 minutes, do it now."
              iconBgClass="bg-orange-500/20"
              iconTextClass="text-orange-500"
              onDrop={handleDoIt}
            />
            
            <ClarifyCard
              icon={<User className="h-8 w-8" />}
              title="Delegate It"
              description="If someone else should do it, delegate and track."
              iconBgClass="bg-blue-500/20"
              iconTextClass="text-blue-500"
              onDrop={handleDelegateIt}
            />
            
            <ClarifyCard
              icon={<Calendar className="h-8 w-8" />}
              title="Defer It"
              description="Schedule it for later if it requires more time."
              iconBgClass="bg-purple-500/20"
              iconTextClass="text-purple-500"
              onDrop={handleDeferIt}
            />
            
            <ClarifyCard
              icon={<FileText className="h-8 w-8" />}
              title="Reference"
              description="Store it if it might be useful later."
              iconBgClass="bg-green-500/20"
              iconTextClass="text-green-500"
              onDrop={handleReferenceIt}
            />
            
            <ClarifyCard
              icon={<Trash className="h-8 w-8" />}
              title="Delete It"
              description="Remove it if it's no longer relevant or needed."
              iconBgClass="bg-red-500/20"
              iconTextClass="text-red-500"
              onDrop={handleDeleteIt}
            />
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Inbox Tasks</h3>
              <Button onClick={handleAddTask} size="sm" variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                Capture More
              </Button>
            </div>
            
            {inboxTasks.length === 0 ? (
              <Card className="bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Check className="h-12 w-12 text-muted-foreground mb-2" />
                  <h4 className="text-lg font-medium">All Clear!</h4>
                  <p className="text-muted-foreground text-center max-w-md">
                    Your inbox is empty. Head to the Capture section to add new items.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {inboxTasks.map(task => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskCard task={task} onTaskClick={handleTaskClick} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Task detail dialog could be added here */}
    </div>
  );
};

// Utility function to get priority color
const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Very High":
      return "bg-red-500";
    case "High":
      return "bg-orange-500";
    case "Medium":
      return "bg-yellow-500";
    case "Low":
      return "bg-blue-500";
    case "Very Low":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export default ClarifyView;
