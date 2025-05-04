
import React, { useState } from "react";
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

      <TaskEditDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={saveTaskChanges}
      />
    </div>
  );
};

export default OrganizeView;
