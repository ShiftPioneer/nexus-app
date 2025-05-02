
import React from "react";
import { Inbox, Check, Clock, Book, Calendar, Archive } from "lucide-react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useGTD } from "../GTDContext";
import { useToast } from "@/hooks/use-toast";
import ClarifyCard from "./clarify/ClarifyCard";
import InboxTasksList from "./clarify/InboxTasksList";
import { Card, CardContent } from "@/components/ui/card";

const ClarifyView = () => {
  const { tasks, moveTask, updateTask } = useGTD();
  const { toast } = useToast();
  
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    
    if (!destination) return;
    
    const destinationId = destination.droppableId;
    
    let newStatus = "inbox";
    
    switch (destinationId) {
      case "do-it":
        newStatus = "next-action";
        toast({
          title: "Task moved to Next Actions",
          description: "This task will be done as soon as possible"
        });
        break;
      case "delegate-it":
        newStatus = "waiting-for";
        toast({
          title: "Task moved to Waiting For",
          description: "This task will be delegated to someone else"
        });
        break;
      case "defer-it":
        newStatus = "someday";
        toast({
          title: "Task moved to Someday/Maybe",
          description: "This task will be reviewed later"
        });
        break;
      case "reference":
        newStatus = "reference";
        toast({
          title: "Task moved to Reference",
          description: "This information will be stored for reference"
        });
        break;
      case "trash-it":
        newStatus = "deleted";
        toast({
          title: "Task deleted",
          description: "This task is no longer needed"
        });
        break;
      default:
        return;
    }
    
    // Get task to sync with Actions page
    const task = tasks.find(t => t.id === draggableId);
    if (task) {
      if (task.isToDoNot) {
        // If it's a Not To Do item, handle differently
        if (newStatus === "next-action") {
          updateTask(draggableId, { status: "today" });
        } else {
          moveTask(draggableId, newStatus as any);
        }
      } else {
        // Regular task handling
        if (newStatus === "next-action") {
          updateTask(draggableId, { status: "today" });
        } else {
          moveTask(draggableId, newStatus as any);
        }
      }
    }
  };
  
  return (
    <div>
      <Card className="mb-6">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Clarify Your Tasks</h2>
          <p className="text-muted-foreground">
            Process your inbox by deciding what each item means and what action it requires.
            Drag items to the appropriate category below.
          </p>
        </CardContent>
      </Card>
      
      <div className="grid gap-6">
        <InboxTasksList tasks={inboxTasks} />
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ClarifyCard
              icon={<Check className="h-6 w-6" />}
              title="Do It"
              description="Tasks that take less than 2 minutes"
              droppableId="do-it"
              iconBgClass="bg-green-900"
              iconTextClass="text-green-200"
              activeDropClass="border-green-500 bg-green-900/20"
            />
            
            <ClarifyCard
              icon={<Clock className="h-6 w-6" />}
              title="Delegate It"
              description="Assign to someone else"
              droppableId="delegate-it"
              iconBgClass="bg-blue-900"
              iconTextClass="text-blue-200"
              activeDropClass="border-blue-500 bg-blue-900/20"
            />
            
            <ClarifyCard
              icon={<Calendar className="h-6 w-6" />}
              title="Defer It"
              description="Schedule for later"
              droppableId="defer-it"
              iconBgClass="bg-amber-900"
              iconTextClass="text-amber-200"
              activeDropClass="border-amber-500 bg-amber-900/20"
            />
            
            <ClarifyCard
              icon={<Book className="h-6 w-6" />}
              title="Reference"
              description="Keep for information"
              droppableId="reference"
              iconBgClass="bg-purple-900"
              iconTextClass="text-purple-200"
              activeDropClass="border-purple-500 bg-purple-900/20"
            />
            
            <ClarifyCard
              icon={<Archive className="h-6 w-6" />}
              title="Trash It"
              description="Delete and forget"
              droppableId="trash-it"
              iconBgClass="bg-red-900"
              iconTextClass="text-red-200"
              activeDropClass="border-red-500 bg-red-900/20"
            />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default ClarifyView;
