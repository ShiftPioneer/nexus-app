
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { motion } from "framer-motion";
import { useGTD } from "@/components/gtd/GTDContext";
import { DragDropContext } from "react-beautiful-dnd";

const GTDPageContent = () => {
  const { handleDragEnd } = useGTD();
  
  return (
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <GTDView />
      </DragDropContext>
    </motion.div>
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
