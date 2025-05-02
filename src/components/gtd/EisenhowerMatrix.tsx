
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GTDTask } from "./GTDContext";
import { CheckSquare } from "lucide-react";

interface EisenhowerMatrixProps {
  matrix: {
    [key: string]: GTDTask[];
  };
  onTaskClick: (task: GTDTask) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  getPriorityColor: (priority: string) => string;
  isToDoNot?: boolean;
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  matrix,
  onTaskClick,
  onTaskMove,
  getPriorityColor,
  isToDoNot = false
}) => {
  const quadrants = [{
    id: "urgent-important",
    title: isToDoNot ? "Strictly Avoid" : "Do First",
    description: "Urgent & Important",
    className: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    headerClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
  }, {
    id: "not-urgent-important",
    title: isToDoNot ? "Plan to Eliminate" : "Schedule",
    description: "Important, Not Urgent",
    className: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    headerClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
  }, {
    id: "urgent-not-important",
    title: isToDoNot ? "Find Alternatives" : "Delegate",
    description: "Urgent, Not Important",
    className: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    headerClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
  }, {
    id: "not-urgent-not-important",
    title: isToDoNot ? "Gradually Reduce" : "Eliminate",
    description: "Not Urgent, Not Important",
    className: "bg-gray-50 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700",
    headerClass: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200"
  }];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Eisenhower Matrix {isToDoNot && " - Things to Avoid"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {isToDoNot ? "Prioritize habits and actions to avoid based on urgency and importance." : "Prioritize tasks based on urgency and importance. Drag tasks between quadrants to change their priority."}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quadrants.map(quadrant => (
          <Card key={quadrant.id} className={`border ${quadrant.className} h-auto`}>
            <CardHeader className={`pb-2 ${quadrant.headerClass}`}>
              <CardTitle className="text-lg">{quadrant.title}</CardTitle>
              <p className="text-xs">{quadrant.description}</p>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto p-3 gap-2 grid">
              {matrix[quadrant.id]?.length > 0 ? (
                <>
                  {matrix[quadrant.id].map(task => (
                    <Card 
                      key={task.id}
                      className="cursor-pointer border hover:shadow-sm transition-shadow"
                      onClick={() => onTaskClick(task)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No {isToDoNot ? "items" : "tasks"} in this quadrant</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
