
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { motion } from "framer-motion";
import { DragDropContext } from "react-beautiful-dnd";
import { useGTD } from "@/components/gtd/GTDContext";
import { useToast } from "@/hooks/use-toast";

const GTDPage = () => {
  const { moveTask } = useGTD();
  const { toast } = useToast();
  
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    // Exit if no destination or if dropped in the same place
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
    
    console.log("Drag ended:", result);
    console.log("Drag source:", source);
    console.log("Drag destination:", destination);
    
    // Move the task to the new status based on the destination droppableId
    moveTask(draggableId, destination.droppableId);
    
    // Show toast notification
    toast({
      title: "Task moved",
      description: `Task moved to ${destination.droppableId.replace(/-/g, " ")}`,
    });
  };

  return (
    <AppLayout>
      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div 
          className="animate-fade-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Getting Things Done (GTD)</h1>
            <p className="text-muted-foreground">
              Organize your tasks and projects with the GTD methodology
            </p>
          </div>
          
          <GTDNavigation />
          <GTDView />
        </motion.div>
      </DragDropContext>
    </AppLayout>
  );
};

export default GTDPage;
