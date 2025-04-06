
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.keys(columns).map((status) => (
          <div key={status} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2 px-2">
              <h3 className="font-semibold text-sm">{statusLabels[status]}</h3>
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {columns[status].length}
              </span>
            </div>
            
            <Droppable droppableId={status}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-2 min-h-[200px] bg-accent/10 rounded-lg ${
                    snapshot.isDraggingOver ? "bg-accent/20" : ""
                  }`}
                >
                  {columns[status].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-3 mb-2 bg-card rounded-md border shadow-sm cursor-grab ${
                            snapshot.isDragging ? "shadow-md" : ""
                          }`}
                          onClick={() => onTaskClick(task)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`} />
                              <h4 className="text-sm font-medium">{task.title}</h4>
                            </div>
                            {task.dueDate && (
                              <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(task.dueDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
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
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
