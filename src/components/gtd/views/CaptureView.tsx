
import React from "react";
import { useGTD } from "../GTDContext";
import { useToast } from "@/hooks/use-toast";
import TasksList from "../TasksList";
import GTDPrinciple from "../GTDPrinciple";
import QuickCaptureForm from "./capture/QuickCaptureForm";
import { cn } from "@/lib/utils";

const CaptureView: React.FC = () => {
  const { tasks, addTask } = useGTD();
  const { toast } = useToast();
  
  const handleAddTask = (title: string, description: string, attachment?: File) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would handle file uploads to a storage service
    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority: "Medium" as const,
      status: "inbox" as const,
      attachment: attachment ? {
        name: attachment.name,
        type: attachment.type,
        // In a real app, you would add a URL to the uploaded file
      } : undefined
    };
    
    addTask(newTask);
    
    toast({
      title: "Task added",
      description: "Task has been added to your inbox",
    });
  };
  
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <QuickCaptureForm onAddTask={handleAddTask} />
      <GTDPrinciple />
      
      <div className="md:col-span-2">
        <h3 className="text-xl font-medium mb-4">Inbox</h3>
        <TasksList tasks={inboxTasks} />
      </div>
    </div>
  );
};

export default CaptureView;
