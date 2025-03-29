
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Tasks = () => {
  const { toast } = useToast();
  
  const handleComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "The Tasks management feature is under development and will be available soon!",
    });
  };

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-primary" />
              Tasks
            </h1>
            <p className="text-muted-foreground">Manage your tasks, projects and priorities</p>
          </div>
          <Button onClick={handleComingSoon} className="gap-2">
            <Plus size={18} />
            New Task
          </Button>
        </div>
        
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>Organize your projects and tasks with our powerful task manager</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ListTodo className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Task Manager Coming Soon</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              We're working hard to bring you a powerful task management system with projects, kanban boards, 
              priority settings, and more.
            </p>
            <Button onClick={handleComingSoon}>Get Notified When Ready</Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Tasks;
