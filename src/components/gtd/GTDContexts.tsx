
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MapPin } from "lucide-react";
import { useGTD } from "./GTDContext";

const GTDContexts = () => {
  const { tasks } = useGTD();
  const contexts = [...new Set(tasks.map(task => task.context).filter(Boolean))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Contexts
        </h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Context
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Available Contexts</CardTitle>
        </CardHeader>
        <CardContent>
          {contexts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No contexts defined yet. Add contexts to organize your tasks better.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {contexts.map(context => (
                <div key={context} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{context}</h4>
                  <p className="text-sm text-muted-foreground">
                    {tasks.filter(task => task.context === context).length} tasks
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GTDContexts;
