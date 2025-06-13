
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDWaitingFor = () => {
  const { tasks } = useGTD();
  const waitingTasks = tasks.filter(task => task.status === "waiting-for");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Waiting For
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Pending Items</CardTitle>
        </CardHeader>
        <CardContent>
          {waitingTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nothing waiting for others. You're in full control!
            </p>
          ) : (
            <div className="space-y-2">
              {waitingTasks.map(task => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{task.title}</h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  {task.delegatedTo && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Waiting for: {task.delegatedTo}
                    </p>
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

export default GTDWaitingFor;
