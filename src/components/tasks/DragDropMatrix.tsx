
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DragDropMatrixProps {
  tasks: any[];
  onTaskUpdate: (taskId: string, updates: any) => void;
  onTaskClick: (task: any) => void;
}

const DragDropMatrix: React.FC<DragDropMatrixProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
}) => {
  const quadrants = [
    { urgency: "High", importance: "High", title: "Do First", color: "border-red-500 bg-red-50 dark:bg-red-950/20" },
    { urgency: "Low", importance: "High", title: "Schedule", color: "border-blue-500 bg-blue-50 dark:bg-blue-950/20" },
    { urgency: "High", importance: "Low", title: "Delegate", color: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" },
    { urgency: "Low", importance: "Low", title: "Eliminate", color: "border-gray-500 bg-gray-50 dark:bg-gray-950/20" },
  ];

  const getTasksByQuadrant = (urgency: string, importance: string) => {
    return tasks.filter(
      (task) => task.urgency === urgency && task.importance === importance
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const [destUrgency, destImportance] = destination.droppableId.split("-");
    onTaskUpdate(draggableId, { 
      urgency: destUrgency, 
      importance: destImportance 
    });
  };

  const renderTask = (task: any, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-2 cursor-pointer transition-transform ${
            snapshot.isDragging ? "rotate-1 scale-105" : ""
          }`}
          onClick={() => onTaskClick(task)}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <h4 className="font-medium text-sm mb-1">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <Badge variant="outline" className="capitalize">
                  {task.priority || "Medium"}
                </Badge>
                {task.dueDate && (
                  <span className="text-muted-foreground">
                    {format(new Date(task.dueDate), "MMM d")}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Eisenhower Matrix</h2>
          <p className="text-muted-foreground">
            Drag tasks between quadrants to prioritize based on urgency and importance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px]">
          {quadrants.map((quadrant) => {
            const quadrantTasks = getTasksByQuadrant(quadrant.urgency, quadrant.importance);
            const droppableId = `${quadrant.urgency}-${quadrant.importance}`;
            
            return (
              <Card key={droppableId} className={`border-2 ${quadrant.color}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {quadrant.title}
                    <Badge variant="secondary" className="ml-2">
                      {quadrant.urgency === "High" ? "Urgent" : "Not Urgent"} & {quadrant.importance === "High" ? "Important" : "Not Important"}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <Droppable droppableId={droppableId}>
                  {(provided, snapshot) => (
                    <CardContent
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`h-full overflow-y-auto transition-colors ${
                        snapshot.isDraggingOver ? "bg-primary/5" : ""
                      }`}
                    >
                      {quadrantTasks.map((task, index) => renderTask(task, index))}
                      {provided.placeholder}
                      
                      {quadrantTasks.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p className="text-sm">Drop tasks here</p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Droppable>
              </Card>
            );
          })}
        </div>
      </div>
    </DragDropContext>
  );
};

export default DragDropMatrix;
