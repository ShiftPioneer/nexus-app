
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext } from "react-beautiful-dnd";

const GTDPage = () => {
  const handleDragEnd = (result: any) => {
    // Handle drag end for GTD tasks if needed
    console.log("Drag ended:", result);
    // Implement drag and drop functionality here
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
