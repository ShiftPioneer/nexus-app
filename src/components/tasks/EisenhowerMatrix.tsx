
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GTDTask } from '@/types/gtd';

interface EisenhowerMatrixProps {
  tasks: GTDTask[];
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks }) => {
  const getQuadrantTasks = (urgent: boolean, important: boolean) => {
    return tasks.filter(task => {
      const isUrgent = task.priority === "urgent";
      const isImportant = task.priority === "urgent" || task.priority === "high";
      
      if (urgent && important) return isUrgent && isImportant;
      if (urgent && !important) return isUrgent && !isImportant;
      if (!urgent && important) return !isUrgent && isImportant;
      return !isUrgent && !isImportant;
    });
  };

  const quadrants = [
    {
      title: "Do First",
      subtitle: "Urgent & Important",
      tasks: getQuadrantTasks(true, true),
      color: "border-red-500 bg-red-50",
      headerColor: "text-red-700"
    },
    {
      title: "Schedule",
      subtitle: "Important, Not Urgent",
      tasks: getQuadrantTasks(false, true),
      color: "border-yellow-500 bg-yellow-50",
      headerColor: "text-yellow-700"
    },
    {
      title: "Delegate",
      subtitle: "Urgent, Not Important",
      tasks: getQuadrantTasks(true, false),
      color: "border-blue-500 bg-blue-50",
      headerColor: "text-blue-700"
    },
    {
      title: "Eliminate",
      subtitle: "Neither Urgent nor Important",
      tasks: getQuadrantTasks(false, false),
      color: "border-gray-500 bg-gray-50",
      headerColor: "text-gray-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
      {quadrants.map((quadrant, index) => (
        <Card key={index} className={`${quadrant.color} border-2`}>
          <CardHeader className="pb-3">
            <CardTitle className={`text-lg ${quadrant.headerColor}`}>
              {quadrant.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{quadrant.subtitle}</p>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
            {quadrant.tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No tasks in this quadrant</p>
            ) : (
              quadrant.tasks.map(task => (
                <div key={task.id} className="p-2 bg-white rounded border">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {task.priority}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EisenhowerMatrix;
