
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'very high' | 'high' | 'medium' | 'low' | 'very low';
  category: string;
  dueDate?: Date;
  importance: number;
  relatedGoals?: string[];
  relatedProjects?: string[];
  status: 'today' | 'todo' | 'in-progress' | 'completed' | 'overdue' | 'deleted';
  createdAt: Date;
}

interface KanbanBoardProps {
  tasks: Task[];
  onUpdateTaskStatus: (taskId: string, newStatus: Task['status'], newPriority?: Task['priority']) => void;
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  color: string;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, tasks, color, onDragOver, onDrop }) => {
  return (
    <div 
      className="bg-muted/50 rounded-lg p-3 w-full min-h-[300px]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-medium">{title}</h3>
          <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
            {tasks.length}
          </span>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-background/80 border border-dashed rounded-lg p-3 text-center text-sm text-muted-foreground">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id}
              className={cn(
                "bg-background rounded-lg p-3 shadow-sm border-l-4 cursor-move",
                task.priority === "very high" ? "border-l-red-600" :
                task.priority === "high" ? "border-l-red-500" : 
                task.priority === "medium" ? "border-l-orange-500" : 
                task.priority === "low" ? "border-l-blue-500" :
                "border-l-blue-300" // very low
              )}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("taskId", task.id)}
            >
              <div className="text-sm font-medium">{task.title}</div>
              {task.description && (
                <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                  {task.category}
                </span>
                
                {task.dueDate && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.dueDate.toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onUpdateTaskStatus }) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onUpdateTaskStatus(taskId, status);
  };
  
  const todoTasks = tasks.filter(task => task.status === "todo" || task.status === "today");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const completedTasks = tasks.filter(task => task.status === "completed");
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return task.dueDate < new Date() && task.status !== "completed";
  });
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KanbanColumn
        title="To Do"
        tasks={todoTasks}
        color="bg-blue-500"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "todo")}
      />
      
      <KanbanColumn
        title="In Progress"
        tasks={inProgressTasks}
        color="bg-orange-500"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "in-progress")}
      />
      
      <KanbanColumn
        title="Completed"
        tasks={completedTasks}
        color="bg-green-500"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "completed")}
      />
      
      <KanbanColumn
        title="Overdue"
        tasks={overdueTasks}
        color="bg-red-500"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, "overdue")}
      />
    </div>
  );
};

export default KanbanBoard;
