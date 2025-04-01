
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { GTDProvider } from "@/components/gtd/GTDContext";
import GTDNavigation from "@/components/gtd/GTDNavigation";
import GTDView from "@/components/gtd/GTDView";

const GTDPage = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <GTDProvider>
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Getting Things Done (GTD)</h1>
            <p className="text-muted-foreground">
              Organize your tasks and projects with the GTD methodology
            </p>
          </div>
          
          <GTDNavigation />
          <GTDView />
        </GTDProvider>
      </div>
    </AppLayout>
  );
};

export default GTDPage;
