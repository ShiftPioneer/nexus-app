
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useGTD, GTDTask } from "../GTDContext";
import { useToast } from "@/hooks/use-toast";
import OrganizeCard from "./organize/OrganizeCard";
import TaskEditDialog from "./organize/TaskEditDialog";

const OrganizeView: React.FC = () => {
  const { tasks, moveTask, updateTask, deleteTask } = useGTD();
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<GTDTask | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  // Group tasks by category
  const tasksByCategory = {
    inbox: tasks.filter((t) => t.status === "inbox"),
    nextActions: tasks.filter((t) => t.status === "next-action"),
    projects: tasks.filter((t) => t.status === "project"),
    waitingFor: tasks.filter((t) => t.status === "waiting-for"),
    someday: tasks.filter((t) => t.status === "someday"),
    reference: tasks.filter((t) => t.status === "reference"),
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    let newStatus: GTDTask["status"] = "inbox";
    
    switch (destination.droppableId) {
      case "inbox":
        newStatus = "inbox";
        break;
      case "nextActions":
        newStatus = "next-action";
        break;
      case "projects":
        newStatus = "project";
        break;
      case "waitingFor":
        newStatus = "waiting-for";
        break;
      case "someday":
        newStatus = "someday";
        break;
      case "reference":
        newStatus = "reference";
        break;
      default:
        return;
    }
    
    moveTask(draggableId, newStatus);
    
    toast({
      title: "Task moved",
      description: `Task moved to ${destination.droppableId}`,
    });
  };

  const openEditDialog = (task: GTDTask) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const saveTaskChanges = (taskId: string, updates: Partial<GTDTask>) => {
    updateTask(taskId, updates);

    toast({
      title: "Task updated",
      description: "Task details have been updated successfully",
    });
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OrganizeCard
          title="Inbox"
          tasks={tasksByCategory.inbox}
          droppableId="inbox"
        />
        <OrganizeCard
          title="Next Actions"
          tasks={tasksByCategory.nextActions}
          droppableId="nextActions"
        />
        <OrganizeCard
          title="Projects"
          tasks={tasksByCategory.projects}
          droppableId="projects"
        />
        <OrganizeCard
          title="Waiting For"
          tasks={tasksByCategory.waitingFor}
          droppableId="waitingFor"
        />
        <OrganizeCard
          title="Someday/Maybe"
          tasks={tasksByCategory.someday}
          droppableId="someday"
        />
        <OrganizeCard
          title="Reference"
          tasks={tasksByCategory.reference}
          droppableId="reference"
        />
      </div>

      <TaskEditDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={saveTaskChanges}
      />
    </DragDropContext>
  );
};

export default OrganizeView;
