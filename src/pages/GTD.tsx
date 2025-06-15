
import React from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { GTDProvider, useGTD } from "@/components/gtd/GTDContext";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import { DragDropContext } from "react-beautiful-dnd";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import CaptureView from "@/components/gtd/views/CaptureView";
import ClarifyView from "@/components/gtd/views/ClarifyView";
import OrganizeView from "@/components/gtd/views/OrganizeView";
import ReflectView from "@/components/gtd/views/ReflectView";
import EngageView from "@/components/gtd/views/EngageView";
import { GTDView as GTDViewType } from "@/types/gtd";

const GTDContent = () => {
  const { activeView, setActiveView, handleDragEnd } = useGTD();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Getting Things Done</h1>
          <p className="text-slate-400 mt-2">
            Organize your tasks and projects with the GTD methodology
          </p>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as GTDViewType)} className="w-full">
            <GTDNavigation />
            <TabsContent value="capture"><CaptureView /></TabsContent>
            <TabsContent value="clarify"><ClarifyView /></TabsContent>
            <TabsContent value="organize"><OrganizeView /></TabsContent>
            <TabsContent value="reflect"><ReflectView /></TabsContent>
            <TabsContent value="engage"><EngageView /></TabsContent>
        </Tabs>
      </DragDropContext>
    </div>
  );
};

const GTD = () => {
  return (
    <ModernAppLayout>
      <GTDProvider>
        <GTDContent />
      </GTDProvider>
    </ModernAppLayout>
  );
};
export default GTD;
