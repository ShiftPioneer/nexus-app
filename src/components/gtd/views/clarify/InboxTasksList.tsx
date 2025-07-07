
import React from "react";
import { GTDTask } from "../../GTDContext";
import { Button } from "@/components/ui/button";
import DraggableTaskItem from "./DraggableTaskItem";
import { Droppable } from "react-beautiful-dnd";

interface InboxTasksListProps {
  tasks: GTDTask[];
  onAddTask: () => void;
  onGoToCapture: () => void;
}

const InboxTasksList: React.FC<InboxTasksListProps> = ({
  tasks,
  onAddTask,
  onGoToCapture
}) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 mb-4">No tasks in your inbox to process.</p>
        <Button 
          variant="outline" 
          className="border-slate-600 text-slate-300 hover:bg-slate-800" 
          onClick={onGoToCapture}
        >
          Go to Capture
        </Button>
      </div>
    );
  }

  return (
    <Droppable droppableId="inbox-list">
      {(provided) => (
        <div 
          ref={provided.innerRef} 
          {...provided.droppableProps} 
          className="space-y-2 max-h-96 overflow-y-auto"
        >
          {tasks.map((task, index) => (
            <DraggableTaskItem 
              key={task.id} 
              task={task} 
              index={index} 
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default InboxTasksList;
