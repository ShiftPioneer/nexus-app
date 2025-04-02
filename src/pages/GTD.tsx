
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { GTDProvider } from "@/components/gtd/GTDContext";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { AnimatePresence, motion } from "framer-motion";

const GTDPage = () => {
  return (
    <AppLayout>
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
        
        <GTDProvider>
          <GTDNavigation />
          <GTDView />
        </GTDProvider>
      </motion.div>
    </AppLayout>
  );
};

export default GTDPage;
