
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TaskCard from "./TaskCard";
import { GTDTask } from "../../GTDContext";

interface TasksSectionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: GTDTask[];
  emptyMessage: string;
  emptyActionText: string;
  onEmptyAction: () => void;
  onStartFocus: (task: GTDTask) => void;
  onCompleteTask: (taskId: string) => void;
  onMoveToToday?: (taskId: string) => void;
}

const TasksSection: React.FC<TasksSectionProps> = ({
  title,
  description,
  icon,
  tasks,
  emptyMessage,
  emptyActionText,
  onEmptyAction,
  onStartFocus,
  onCompleteTask,
  onMoveToToday
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>{emptyMessage}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onEmptyAction}
            >
              {emptyActionText}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStartFocus={onStartFocus} 
                onComplete={onCompleteTask}
                onMoveToToday={onMoveToToday}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
