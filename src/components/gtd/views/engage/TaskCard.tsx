import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Check, Calendar } from "lucide-react";
import { GTDTask } from "../../GTDContext";
interface TaskCardProps {
  task: GTDTask;
  onStartFocus: (task: GTDTask) => void;
  onComplete: (taskId: string) => void;
  onMoveToToday?: (taskId: string) => void;
}
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStartFocus,
  onComplete,
  onMoveToToday
}) => {
  return <Card className="bg-card/50 border">
      <CardContent className="p-3 bg-slate-900 rounded-lg">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="text-base font-medium">{task.title}</h4>
            {task.description && <p className="text-sm text-muted-foreground line-clamp-2">
                {task.description}
              </p>}
          </div>
          <div className="flex gap-2 ml-4 shrink-0">
            {onMoveToToday && <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onMoveToToday(task.id)}>
                <Calendar className="h-3 w-3" />
                <span className="sr-only">Schedule Today</span>
              </Button>}
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onStartFocus(task)}>
              <Play className="h-3 w-3" />
              <span className="sr-only">Start Focus</span>
            </Button>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => onComplete(task.id)}>
              <Check className="h-3 w-3" />
              <span className="sr-only">Complete</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default TaskCard;