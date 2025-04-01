
import React, { useState } from "react";
import { useGTD, GTDTask } from "../GTDContext";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, User, Calendar, FileText, Trash } from "lucide-react";
import TasksList from "../TasksList";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const ClarifyView: React.FC = () => {
  const { tasks, moveTask } = useGTD();
  const { toast } = useToast();
  const [inboxTasks, setInboxTasks] = useState<GTDTask[]>(
    tasks.filter(task => task.status === "inbox")
  );
  
  // Update inbox tasks when global tasks change
  React.useEffect(() => {
    setInboxTasks(tasks.filter(task => task.status === "inbox"));
  }, [tasks]);
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    
    // Handle the drop logic
    const taskId = draggableId;
    
    // New status and priority based on the destination
    let newStatus: "inbox" | "next-action" | "waiting-for" | "someday" | "reference" | "deleted";
    let newPriority: "Very High" | "Medium" | "Very Low" | undefined;
    
    switch (destination.droppableId) {
      case "do-it":
        newStatus = "next-action";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task moved to 'Next Actions' list",
        });
        break;
      case "delegate-it":
        newStatus = "waiting-for";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task delegated",
        });
        break;
      case "defer-it":
        newStatus = "someday";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task deferred to Someday/Maybe list",
        });
        break;
      case "reference":
        newStatus = "reference";
        moveTask(taskId, newStatus);
        toast({
          title: "Task updated",
          description: "Task moved to Reference materials",
        });
        break;
      case "delete-it":
        newStatus = "deleted";
        newPriority = "Very Low";
        moveTask(taskId, newStatus, newPriority);
        toast({
          title: "Task deleted",
          description: "Task has been deleted",
        });
        break;
      default:
        return;
    }
  };
  
  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-700 text-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center">
                  <Clock className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">Do It</h3>
              <p className="text-sm text-slate-400 text-center">
                If it takes less than 2 minutes, do it now.
              </p>
              <Droppable droppableId="do-it">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                      snapshot.isDraggingOver ? "border-orange-500 bg-orange-500/10" : "border-slate-700"
                    )}
                  >
                    <p className="text-sm text-center text-slate-500">
                      {snapshot.isDraggingOver ? "Drop here!" : "Drag tasks here to categorize"}
                    </p>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-700 text-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">Delegate It</h3>
              <p className="text-sm text-slate-400 text-center">
                If someone else should do it, delegate and track.
              </p>
              <Droppable droppableId="delegate-it">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                      snapshot.isDraggingOver ? "border-blue-500 bg-blue-500/10" : "border-slate-700"
                    )}
                  >
                    <p className="text-sm text-center text-slate-500">
                      {snapshot.isDraggingOver ? "Drop here!" : "Drag tasks here to categorize"}
                    </p>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-700 text-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                  <Calendar className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">Defer It</h3>
              <p className="text-sm text-slate-400 text-center">
                Schedule it for later if it requires more time.
              </p>
              <Droppable droppableId="defer-it">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                      snapshot.isDraggingOver ? "border-purple-500 bg-purple-500/10" : "border-slate-700"
                    )}
                  >
                    <p className="text-sm text-center text-slate-500">
                      {snapshot.isDraggingOver ? "Drop here!" : "Drag tasks here to categorize"}
                    </p>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-700 text-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                  <FileText className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">Reference</h3>
              <p className="text-sm text-slate-400 text-center">
                Store it if it might be useful later.
              </p>
              <Droppable droppableId="reference">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                      snapshot.isDraggingOver ? "border-green-500 bg-green-500/10" : "border-slate-700"
                    )}
                  >
                    <p className="text-sm text-center text-slate-500">
                      {snapshot.isDraggingOver ? "Drop here!" : "Drag tasks here to categorize"}
                    </p>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-900 border-slate-700 text-slate-200">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                  <Trash className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-center">Delete It</h3>
              <p className="text-sm text-slate-400 text-center">
                Remove it if it's no longer relevant or needed.
              </p>
              <Droppable droppableId="delete-it">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mt-4 p-4 border border-dashed rounded-md min-h-[100px] transition-colors",
                      snapshot.isDraggingOver ? "border-red-500 bg-red-500/10" : "border-slate-700"
                    )}
                  >
                    <p className="text-sm text-center text-slate-500">
                      {snapshot.isDraggingOver ? "Drop here to delete!" : "Drag tasks here to delete"}
                    </p>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 border border-slate-700 rounded-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-medium">Items to Process</h3>
            <Button className="bg-[#FF5722] hover:bg-[#FF6E40] text-white">
              + Add Task
            </Button>
          </div>
          {inboxTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No tasks in your inbox to process.</p>
              <Button variant="outline" className="mt-4">
                Go to Capture
              </Button>
            </div>
          ) : (
            inboxTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={cn(
                      "mb-2 transform transition-all",
                      snapshot.isDragging ? "shadow-lg scale-[1.02]" : ""
                    )}
                  >
                    <div className="flex items-center gap-4 p-4 bg-slate-800 border border-slate-700 rounded-md">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-200">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-slate-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default ClarifyView;
