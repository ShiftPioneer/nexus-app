
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import TasksTabView from "@/components/tasks/TasksTabView";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import EisenhowerMatrix from "@/components/tasks/EisenhowerMatrix";
import { CheckCircle, XCircle, Kanban, Grid3X3 } from "lucide-react";

const Actions = () => {
  const [activeTab, setActiveTab] = React.useState("todo");
  const [viewMode, setViewMode] = React.useState<"list" | "kanban" | "matrix">("list");
  
  return (
    <ModernAppLayout>
      <div className="animate-fade-in p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Actions</h1>
          <p className="text-muted-foreground mt-2">Manage your to-do list and track what not to do</p>
        </div>

        <Tabs defaultValue="todo" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "kanban" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Kanban className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "matrix" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                Matrix
              </button>
            </div>
          </div>
          
          <TabsContent value="todo" className="mt-6">
            {viewMode === "list" && <TasksTabView isToDoNot={false} />}
            {viewMode === "kanban" && <KanbanBoard isToDoNot={false} />}
            {viewMode === "matrix" && <EisenhowerMatrix isToDoNot={false} />}
          </TabsContent>
          
          <TabsContent value="not-todo" className="mt-6">
            {viewMode === "list" && <TasksTabView isToDoNot={true} />}
            {viewMode === "kanban" && <KanbanBoard isToDoNot={true} />}
            {viewMode === "matrix" && <EisenhowerMatrix isToDoNot={true} />}
          </TabsContent>
        </Tabs>
      </div>
    </ModernAppLayout>
  );
};

export default Actions;
