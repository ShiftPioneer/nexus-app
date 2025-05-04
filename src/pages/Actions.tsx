
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AppLayout from "@/components/layout/AppLayout";
import TasksTabView from "@/components/tasks/TasksTabView";
import { CheckCircle, XCircle } from "lucide-react";

const Actions = () => {
  const [activeTab, setActiveTab] = React.useState("todo");
  
  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-4xl font-bold">Actions</h1>
          <p className="text-muted-foreground mt-2">Manage your to-do list and track what not to do</p>
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
            <TasksTabView isToDoNot={false} />
          </TabsContent>
          
          <TabsContent value="not-todo" className="mt-6">
            <TasksTabView isToDoNot={true} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Actions;
