
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Calendar, Users, Target, FolderOpen } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import GTDInbox from "@/components/gtd/GTDInbox";
import GTDProjects from "@/components/gtd/GTDProjects";
import GTDContexts from "@/components/gtd/GTDContexts";
import GTDNextActions from "@/components/gtd/GTDNextActions";
import GTDWaitingFor from "@/components/gtd/GTDWaitingFor";
import GTDReference from "@/components/gtd/GTDReference";
import GTDReview from "@/components/gtd/GTDReview";

const GTD = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const { state } = useGTD();

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "inbox":
        return state.inboxItems.length;
      case "projects":
        return state.projects.length;
      case "contexts":
        return state.contexts.length;
      case "actions":
        return state.nextActions.length;
      case "waiting":
        return state.waitingFor.length;
      case "reference":
        return state.reference.length;
      default:
        return 0;
    }
  };

  return (
    <ModernAppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" />
              Getting Things Done
            </h1>
            <p className="text-muted-foreground mt-2">
              Capture, clarify, organize, and engage with your tasks and projects
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-muted">
            <TabsTrigger value="inbox" className="flex items-center gap-1">
              <span>Inbox</span>
              {getTabCount("inbox") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("inbox")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1">
              <span>Projects</span>
              {getTabCount("projects") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("projects")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="contexts" className="flex items-center gap-1">
              <span>Contexts</span>
              {getTabCount("contexts") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("contexts")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-1">
              <span>Actions</span>
              {getTabCount("actions") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("actions")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="waiting" className="flex items-center gap-1">
              <span>Waiting</span>
              {getTabCount("waiting") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("waiting")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reference" className="flex items-center gap-1">
              <span>Reference</span>
              {getTabCount("reference") > 0 && (
                <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                  {getTabCount("reference")}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-6">
            <GTDInbox />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <GTDProjects />
          </TabsContent>

          <TabsContent value="contexts" className="mt-6">
            <GTDContexts />
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <GTDNextActions />
          </TabsContent>

          <TabsContent value="waiting" className="mt-6">
            <GTDWaitingFor />
          </TabsContent>

          <TabsContent value="reference" className="mt-6">
            <GTDReference />
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <GTDReview />
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default GTD;
