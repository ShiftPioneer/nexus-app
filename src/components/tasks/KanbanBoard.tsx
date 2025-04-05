
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define component properties
export interface KanbanBoardProps {
  columns: {
    [key: string]: any[]; // The columns object with status keys and task arrays
  };
  onTaskClick: (task: any) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  getPriorityColor: (priority: string) => string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  onTaskClick,
  onTaskMove,
  getPriorityColor
}) => {
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    onTaskMove(draggableId, destination.droppableId);
  };
  
  const statusLabels: Record<string, string> = {
    today: "Today",
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Completed",
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full pb-4 overflow-x-auto">
        {Object.keys(columns).map((status) => (
          <div key={status} className="flex flex-col h-full min-w-[250px]">
            <Card className="flex-1">
              <CardHeader className="p-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>{statusLabels[status]}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {columns[status].length}
                  </span>
                </CardTitle>
              </CardHeader>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <CardContent
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-2 min-h-[400px] ${
                      snapshot.isDraggingOver ? "bg-accent/20" : "bg-accent/5"
                    } rounded-md space-y-2`}
                  >
                    {columns[status].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 bg-card rounded-md border shadow-sm cursor-grab ${
                              snapshot.isDragging ? "shadow-md ring-1 ring-primary" : ""
                            }`}
                            onClick={() => onTaskClick(task)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                <h4 className="text-sm font-medium">{task.title}</h4>
                              </div>
                              {task.dueDate && (
                                <div className="flex items-center text-xs text-muted-foreground ml-2">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            
                            {task.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                            
                            {task.tags && task.tags.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {task.tags.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.5 bg-accent/50 text-accent-foreground text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {columns[status].length === 0 && (
                      <div className="text-center p-4 text-sm text-muted-foreground">
                        Drop tasks here
                      </div>
                    )}
                  </CardContent>
                )}
              </Droppable>
            </Card>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
