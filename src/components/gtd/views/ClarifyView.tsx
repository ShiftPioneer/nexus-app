
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import GTDPrinciple from "../GTDPrinciple";
import InboxTasksList from "./clarify/InboxTasksList";
import ClarifyCard from "./clarify/ClarifyCard";
import { motion } from "framer-motion";

const ClarifyView: React.FC = () => {
  const { tasks, moveTask } = useGTD();
  const { toast } = useToast();
  const [showHelp, setShowHelp] = useState(false);
  
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    // If there's no destination or the item was dropped back in the same place, return
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }
    
    // Get the status from the droppableId
    const newStatus = destination.droppableId as "do-it" | "delegate-it" | "defer-it" | "reference" | "deleted";
    
    // Move the task to its new status
    moveTask(draggableId, newStatus);
    
    // Show a toast notification
    toast({
      title: "Task Moved",
      description: `Task moved to ${newStatus.replace("-", " ")}`,
    });
  };

  const handleAddTask = () => {
    // Navigate to the capture view
    // This could be handled through a context method or router
    // For now, let's just show a toast
    toast({
      title: "Capture Task",
      description: "Navigate to the Capture tab to add a new task.",
    });
  };

  const handleGoToCapture = () => {
    // Navigate to capture view
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-xl font-medium mb-4">Inbox</h3>
        <InboxTasksList 
          tasks={inboxTasks} 
          onAddTask={handleAddTask}
          onGoToCapture={handleGoToCapture}
        />
      </div>
      
      <GTDPrinciple />
      
      <div className="md:col-span-2">
        <h3 className="text-xl font-medium mb-4">Clarify Process</h3>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClarifyCard 
              id="do-it" 
              title="Do It" 
              description="Tasks that take less than 2 minutes"
              color="bg-green-600" 
            />
            <ClarifyCard 
              id="delegate-it" 
              title="Delegate It" 
              description="Tasks that can be done by someone else"
              color="bg-orange-500" 
            />
            <ClarifyCard 
              id="defer-it" 
              title="Defer It" 
              description="Tasks to schedule for later"
              color="bg-blue-500" 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <ClarifyCard 
              id="reference" 
              title="Reference" 
              description="Non-actionable information to keep"
              color="bg-purple-500" 
            />
            <ClarifyCard 
              id="deleted" 
              title="Delete" 
              description="Tasks that are no longer relevant"
              color="bg-red-500" 
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ClarifyView;
