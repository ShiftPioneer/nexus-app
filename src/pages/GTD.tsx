import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { GTDProvider } from "@/components/gtd/GTDContext";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";
import { DragDropContext } from "react-beautiful-dnd";
const GTDContent = () => {
  return <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Getting Things Done</h1>
          <p className="text-slate-400 mt-2">
            Organize your tasks and projects with the GTD methodology
          </p>
        </div>
      </div>

      <GTDNavigation />
      <GTDView />
    </div>;
};
const GTD = () => {
  const handleDragEnd = (result: any) => {
    console.log("Drag ended:", result);
  };
  return <ModernAppLayout>
      <GTDProvider>
        <DragDropContext onDragEnd={handleDragEnd}>
          <GTDContent />
        </DragDropContext>
      </GTDProvider>
    </ModernAppLayout>;
};
export default GTD;