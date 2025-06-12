
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { format } from "date-fns";

interface DragDropKanbanProps {
  tasks: any[];
  onTaskUpdate: (taskId: string, updates: any) => void;
  onTaskClick: (task: any) => void;
  isToDoNot?: boolean;
}

const DragDropKanban: React.FC<DragDropKanbanProps> = ({
  tasks,
  onTaskUpdate,
  onTaskClick,
  isToDoNot = false,
}) => {
  const columns = isToDoNot
    ? [
        { id: "todo", title: "To Avoid", icon: AlertCircle, color: "text-red-500" },
        { id: "in-progress", title: "Reducing", icon: Circle, color: "text-yellow-500" },
        { id: "completed", title: "Eliminated", icon: CheckCircle2, color: "text-green-500" },
      ]
    : [
        { id: "today", title: "Today", icon: Clock, color: "text-blue-500" },
        { id: "todo", title: "To Do", icon: Circle, color: "text-gray-500" },
        { id: "in-progress", title: "In Progress", icon: Circle, color: "text-yellow-500" },
        { id: "completed", title: "Completed", icon: CheckCircle2, color: "text-green-500" },
      ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    onTaskUpdate(draggableId, { status: newStatus });
  };

  const renderTask = (task: any, index: number) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 cursor-pointer transition-transform ${
            snapshot.isDragging ? "rotate-2 scale-105" : ""
          }`}
          onClick={() => onTaskClick(task)}
        >
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <h4 className="font-medium text-sm mb-2">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  <Badge variant="outline" className="capitalize">
                    {task.priority || "Medium"}
                  </Badge>
                  {task.dueDate && (
                    <Badge variant="secondary">
                      {format(new Date(task.dueDate), "MMM d")}
                    </Badge>
                  )}
                </div>
              </div>
              
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {task.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{task.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                <column.icon className={`h-5 w-5 ${column.color}`} />
                <h3 className="font-semibold">{column.title}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {columnTasks.length}
                </Badge>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    {columnTasks.map((task, index) => renderTask(task, index))}
                    {provided.placeholder}
                    
                    {columnTasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <column.icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          Drop {isToDoNot ? "items to avoid" : "tasks"} here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DragDropKanban;
