
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GTDTask } from "@/components/gtd/GTDContext";
import { PlusCircle, Inbox } from "lucide-react";
import { Draggable } from "react-beautiful-dnd";

interface InboxTasksListProps {
  tasks: GTDTask[];
  onAddTask: () => void;
  onGoToCapture: () => void;
}

const InboxTasksList: React.FC<InboxTasksListProps> = ({ tasks, onAddTask, onGoToCapture }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Inbox className="h-5 w-5 text-blue-500" />
          <h3 className="text-base font-medium">Inbox Items</h3>
        </div>
        <Button size="sm" onClick={onAddTask} className="h-8">
          <PlusCircle className="h-4 w-4 mr-1" /> New
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-3 mb-2 border rounded-md cursor-grab ${
                      snapshot.isDragging ? "shadow-lg" : ""
                    }`}
                  >
                    <div className="text-sm font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground mb-4">Your inbox is empty</p>
            <Button variant="outline" onClick={onGoToCapture}>
              Go to Capture
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InboxTasksList;
