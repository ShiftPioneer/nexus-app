
import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { GTDTask } from "../../GTDContext";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: GTDTask[];
  droppableId: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, droppableId }) => (
  <Droppable droppableId={droppableId}>
    {(provided, snapshot) => (
      <div
        ref={provided.innerRef}
        {...provided.droppableProps}
        className={cn(
          "min-h-[150px] p-2 rounded-md",
          snapshot.isDraggingOver && "bg-slate-800/50"
        )}
      >
        {tasks.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-4">
            {snapshot.isDraggingOver ? "Drop here..." : "Drop tasks here..."}
          </p>
        ) : (
          tasks.map((task, index) => (
            <TaskItem key={task.id} task={task} index={index} />
          ))
        )}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default TaskList;
