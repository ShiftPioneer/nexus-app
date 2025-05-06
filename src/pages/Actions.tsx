
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import TasksTabView from "@/components/tasks/TasksTabView";
import { CheckCircle, XCircle, List, KanbanSquare, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import KanbanView from "@/components/actions/KanbanView";
import EisenhowerMatrix from "@/components/actions/EisenhowerMatrix";

const Actions = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "eisenhower">("list");
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">Actions</h1>
            <p className="text-muted-foreground mt-2">Manage your to-do list and track what not to do</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="flex items-center gap-1"
            >
              <List className="h-4 w-4" />
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="flex items-center gap-1"
            >
              <KanbanSquare className="h-4 w-4" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "eisenhower" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("eisenhower")}
              className="flex items-center gap-1"
            >
              <LayoutGrid className="h-4 w-4" />
              Eisenhower
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todo" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="todo" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              To Do
            </TabsTrigger>
            <TabsTrigger value="not-todo" className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Not To Do
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="todo" className="mt-6">
            {viewMode === "list" && <TasksTabView isToDoNot={false} />}
            {viewMode === "kanban" && <KanbanView isToDoNot={false} />}
            {viewMode === "eisenhower" && <EisenhowerMatrix isToDoNot={false} />}
          </TabsContent>
          
          <TabsContent value="not-todo" className="mt-6">
            {viewMode === "list" && <TasksTabView isToDoNot={true} />}
            {viewMode === "kanban" && <KanbanView isToDoNot={true} />}
            {viewMode === "eisenhower" && <EisenhowerMatrix isToDoNot={true} />}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Actions;
