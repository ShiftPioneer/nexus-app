
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDProjects = () => {
  const { tasks } = useGTD();
  const projectTasks = tasks.filter(task => task.status === "project");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FolderOpen className="h-6 w-6 text-primary" />
          Projects
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Active Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projectTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet. Create your first project to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {projectTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GTDProjects;
