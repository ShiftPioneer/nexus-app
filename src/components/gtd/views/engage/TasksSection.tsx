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
  return <Card className="bg-slate-950 border-slate-700 text-white">
      <CardHeader className="pb-2 bg-slate-950 rounded-lg">
        <CardTitle className="flex items-center gap-2 text-orange-600">
          {icon}
          {title}
        </CardTitle>
        <CardDescription className="text-slate-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-950 rounded-lg">
        {tasks.length === 0 ? <div className="py-8 text-center text-slate-400">
            <p>{emptyMessage}</p>
            <Button variant="outline" size="sm" className="mt-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={onEmptyAction}>
              {emptyActionText}
            </Button>
          </div> : <div className="space-y-4">
            {tasks.map(task => <TaskCard key={task.id} task={task} onStartFocus={onStartFocus} onComplete={onCompleteTask} onMoveToToday={onMoveToToday} />)}
          </div>}
      </CardContent>
    </Card>;
};
export default TasksSection;