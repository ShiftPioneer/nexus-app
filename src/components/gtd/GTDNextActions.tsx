
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDNextActions = () => {
  const { tasks } = useGTD();
  const nextActionTasks = tasks.filter(task => task.status === "next-action");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <CheckCircle className="h-6 w-6 text-primary" />
          Next Actions
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Ready to Execute</CardTitle>
        </CardHeader>
        <CardContent>
          {nextActionTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No next actions defined. Process your inbox to create actionable tasks.
            </p>
          ) : (
            <div className="space-y-2">
              {nextActionTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  {task.context && (
                    <span className="inline-block px-2 py-1 bg-muted rounded text-xs mt-2">
                      @{task.context}
                    </span>
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

export default GTDNextActions;
