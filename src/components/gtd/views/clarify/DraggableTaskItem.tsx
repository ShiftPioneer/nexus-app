
import React from "react";
import { GTDTask } from "../../GTDContext";
import { Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";

interface DraggableTaskItemProps {
  task: GTDTask;
  index: number;
}

const DraggableTaskItem: React.FC<DraggableTaskItemProps> = ({ task, index }) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "mb-2 transform transition-all",
            snapshot.isDragging ? "shadow-lg scale-[1.02]" : ""
          )}
        >
          <div className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-md">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-200">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-slate-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableTaskItem;
