
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { motion } from "framer-motion";
import { useGTD } from "@/components/gtd/GTDContext";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext } from "react-beautiful-dnd";

const GTDPageContent = () => {
  const { moveTask, handleDragEnd: contextHandleDragEnd } = useGTD();
  const { toast } = useToast();
  
  const handleDragEnd = (result: any) => {
    // Call the context's drag end handler
    contextHandleDragEnd(result);
    
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
    
    // Show toast notification
    toast({
      title: "Task moved",
      description: `Task moved to ${destination.droppableId.replace(/-/g, " ")}`,
    });
  };

  return (
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
  );
};

// Main page component that doesn't use the GTD context directly
const GTDPage = () => {
  return (
    <AppLayout>
      <GTDPageContent />
    </AppLayout>
  );
};

export default GTDPage;
