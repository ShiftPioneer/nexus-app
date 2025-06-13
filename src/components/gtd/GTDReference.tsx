
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDReference = () => {
  const { tasks } = useGTD();
  const referenceTasks = tasks.filter(task => task.status === "reference");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Reference
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Reference
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reference Materials</CardTitle>
        </CardHeader>
        <CardContent>
          {referenceTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No reference materials yet. Store important information here.
            </p>
          ) : (
            <div className="space-y-2">
              {referenceTasks.map(task => (
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

export default GTDReference;
