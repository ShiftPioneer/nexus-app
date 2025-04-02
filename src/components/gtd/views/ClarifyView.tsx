
import React, { useState, useEffect } from "react";
import { useGTD } from "../GTDContext";
import { Clock, User, Calendar, FileText, Trash } from "lucide-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useToast } from "@/hooks/use-toast";
import ClarifyCard from "./clarify/ClarifyCard";
import InboxTasksList from "./clarify/InboxTasksList";
import { GTDTask } from "../GTDContext";

const ClarifyView: React.FC = () => {
  const { tasks, moveTask, setActiveView } = useGTD();
  const { toast } = useToast();
  const [inboxTasks, setInboxTasks] = useState<GTDTask[]>(
    tasks.filter(task => task.status === "inbox")
  );
  
  // Update inbox tasks when global tasks change
  useEffect(() => {
    setInboxTasks(tasks.filter(task => task.status === "inbox"));
  }, [tasks]);
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    
    // Handle the drop logic
    const taskId = draggableId;
    
    // New status and priority based on the destination
    let newStatus: "inbox" | "next-action" | "waiting-for" | "someday" | "reference" | "deleted";
    let newPriority: "Very High" | "Medium" | "Very Low" | undefined;
    
    switch (destination.droppableId) {
      case "do-it":
        newStatus = "next-action";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task moved to 'Next Actions' list",
        });
        break;
      case "delegate-it":
        newStatus = "waiting-for";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task delegated",
        });
        break;
      case "defer-it":
        newStatus = "someday";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task deferred to Someday/Maybe list",
        });
        break;
      case "reference":
        newStatus = "reference";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task moved to Reference materials",
        });
        break;
      case "delete-it":
        newStatus = "deleted";
        newPriority = "Very Low";
        moveTask(taskId, newStatus, newPriority);
        toast({
          title: "Task deleted",
          description: "Task has been deleted",
        });
        break;
      default:
        return;
    }
  };
  
  const handleAddTask = () => {
    setActiveView("capture");
  };

  const handleGoToCapture = () => {
    setActiveView("capture");
  };
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ClarifyCard
            icon={<Clock className="h-8 w-8" />}
            title="Do It"
            description="If it takes less than 2 minutes, do it now."
            droppableId="do-it"
            iconBgClass="bg-orange-500/20"
            iconTextClass="text-orange-500"
            activeDropClass="border-orange-500 bg-orange-500/10"
          />
          
          <ClarifyCard
            icon={<User className="h-8 w-8" />}
            title="Delegate It"
            description="If someone else should do it, delegate and track."
            droppableId="delegate-it"
            iconBgClass="bg-blue-500/20"
            iconTextClass="text-blue-500"
            activeDropClass="border-blue-500 bg-blue-500/10"
          />
          
          <ClarifyCard
            icon={<Calendar className="h-8 w-8" />}
            title="Defer It"
            description="Schedule it for later if it requires more time."
            droppableId="defer-it"
            iconBgClass="bg-purple-500/20"
            iconTextClass="text-purple-500"
            activeDropClass="border-purple-500 bg-purple-500/10"
          />
          
          <ClarifyCard
            icon={<FileText className="h-8 w-8" />}
            title="Reference"
            description="Store it if it might be useful later."
            droppableId="reference"
            iconBgClass="bg-green-500/20"
            iconTextClass="text-green-500"
            activeDropClass="border-green-500 bg-green-500/10"
          />
          
          <ClarifyCard
            icon={<Trash className="h-8 w-8" />}
            title="Delete It"
            description="Remove it if it's no longer relevant or needed."
            droppableId="delete-it"
            iconBgClass="bg-red-500/20"
            iconTextClass="text-red-500"
            activeDropClass="border-red-500 bg-red-500/10"
          />
        </div>
        
        <InboxTasksList 
          tasks={inboxTasks}
          onAddTask={handleAddTask}
          onGoToCapture={handleGoToCapture}
        />
      </div>
    </DragDropContext>
  );
};

export default ClarifyView;
