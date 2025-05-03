
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { GTDTask } from "@/components/gtd/GTDContext";
import { Card } from "@/components/ui/card";

interface TaskItemProps {
  task: GTDTask;
  index: number;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card 
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 cursor-grab ${snapshot.isDragging ? "shadow-lg" : ""}`}
        >
          <div className="text-sm font-medium">{task.title}</div>
          {task.description && (
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </div>
          )}
        </Card>
      )}
    </Draggable>
  );
};

export default TaskItem;
