
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
  return (
    <div className="mt-8 border border-slate-700 rounded-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-medium">Items to Process</h3>
        <Button 
          className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
          onClick={onAddTask}
        >
          + Add Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-slate-500">No tasks in your inbox to process.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={onGoToCapture}
          >
            Go to Capture
          </Button>
        </div>
      ) : (
        <Droppable droppableId="inbox-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <DraggableTaskItem key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default InboxTasksList;
