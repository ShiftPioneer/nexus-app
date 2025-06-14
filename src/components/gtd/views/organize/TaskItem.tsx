import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Check, Trash } from "lucide-react";
import { useGTD, GTDTask } from "../../GTDContext";
interface TaskItemProps {
  task: GTDTask;
  index: number;
}
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index
}) => {
  const {
    updateTask,
    moveTask,
    deleteTask
  } = useGTD();
  const handleCompleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    moveTask(task.id, "completed");
  };
  const handleDeleteTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTask(task.id);
  };
  return <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => <div ref={provided.innerRef} className="bg-slate-900 rounded-lg border py-[10px] px-[10px]">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-200">{task.title}</h4>
              {task.description && <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {task.description}
                </p>}
            </div>
            <div className="flex space-x-1 ml-2">
              <Button onClick={e => {
            e.stopPropagation();
            // This would be handled by a parent component's openEditDialog
            // We'll pass the task up to that component
          }} size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-slate-100">
                <Edit className="h-4 w-4" />
              </Button>
              <Button onClick={handleCompleteTask} size="icon" variant="ghost" className="h-7 w-7 text-green-500 hover:text-green-400">
                <Check className="h-4 w-4" />
              </Button>
              <Button onClick={handleDeleteTask} size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:text-red-400">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {task.tags && task.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 bg-slate-700 text-xs rounded-md text-slate-300">
                  {tag}
                </span>)}
            </div>}
        </div>}
    </Draggable>;
};
export default TaskItem;