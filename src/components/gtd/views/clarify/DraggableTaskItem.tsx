
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
    <Draggable draggableId={task.id} index={index}>
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
          <div className="inline-flex items-center gap-3 p-3 bg-slate-800 border border-slate-700 rounded-md max-w-fit">
            <div className="min-w-0">
              <h4 className="font-medium text-slate-200 whitespace-nowrap">
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-slate-400 truncate max-w-[200px]">
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
