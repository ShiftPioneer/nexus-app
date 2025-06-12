
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, AlertTriangle, Clock, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotToDoMatrixProps {
  tasks: any[];
  onTaskUpdate: (taskId: string, updates: any) => void;
  onTaskClick: (task: any) => void;
}

const NotToDoMatrix: React.FC<NotToDoMatrixProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
}) => {
  const getTasksByQuadrant = (urgency: string, importance: string) => {
    return tasks.filter(
      (task) => task.urgency === urgency && task.importance === importance
    );
  };

  const strictlyAvoid = getTasksByQuadrant("High", "High"); // Urgent & Important to avoid
  const planToEliminate = getTasksByQuadrant("Low", "High"); // Important, Not Urgent to eliminate
  const findAlternatives = getTasksByQuadrant("High", "Low"); // Urgent, Not Important to replace
  const graduallyReduce = getTasksByQuadrant("Low", "Low"); // Not Urgent, Not Important to reduce

  const renderTask = (task: any) => (
    <div
      key={task.id}
      className="p-3 bg-card rounded-lg border border-border hover:shadow-sm transition-shadow cursor-pointer"
      onClick={() => onTaskClick(task)}
    >
      <h4 className="font-medium text-sm mb-1">{task.title}</h4>
      {task.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {task.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <XCircle className="h-4 w-4 text-destructive" />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Eisenhower Matrix - Things to Avoid</h2>
        <p className="text-muted-foreground">
          Prioritize habits and actions to avoid based on urgency and importance.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
        {/* Strictly Avoid - Urgent & Important */}
        <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Strictly Avoid
              <Badge variant="destructive" className="ml-auto">
                Urgent & Important
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 h-full overflow-y-auto">
            {strictlyAvoid.length > 0 ? (
              strictlyAvoid.map(renderTask)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items in this quadrant</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan to Eliminate - Important, Not Urgent */}
        <Card className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <Clock className="h-5 w-5" />
              Plan to Eliminate
              <Badge variant="secondary" className="ml-auto bg-orange-200 text-orange-800">
                Important, Not Urgent
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 h-full overflow-y-auto">
            {planToEliminate.length > 0 ? (
              planToEliminate.map(renderTask)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items in this quadrant</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Find Alternatives - Urgent, Not Important */}
        <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Lightbulb className="h-5 w-5" />
              Find Alternatives
              <Badge variant="secondary" className="ml-auto bg-blue-200 text-blue-800">
                Urgent, Not Important
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 h-full overflow-y-auto">
            {findAlternatives.length > 0 ? (
              findAlternatives.map(renderTask)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items in this quadrant</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gradually Reduce - Not Urgent, Not Important */}
        <Card className="border-2 border-gray-500 bg-gray-50 dark:bg-gray-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-gray-700 dark:text-gray-400">
              <XCircle className="h-5 w-5" />
              Gradually Reduce
              <Badge variant="outline" className="ml-auto">
                Not Urgent, Not Important
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 h-full overflow-y-auto">
            {graduallyReduce.length > 0 ? (
              graduallyReduce.map(renderTask)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <XCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No items in this quadrant</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotToDoMatrix;
