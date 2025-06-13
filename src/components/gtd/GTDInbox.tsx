
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDInbox = () => {
  const { tasks } = useGTD();
  const inboxTasks = tasks.filter(task => task.status === "inbox");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Inbox className="h-6 w-6 text-primary" />
          Inbox
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Capture Everything</CardTitle>
        </CardHeader>
        <CardContent>
          {inboxTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Your inbox is empty. Great job processing your tasks!
            </p>
          ) : (
            <div className="space-y-2">
              {inboxTasks.map(task => (
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

export default GTDInbox;
