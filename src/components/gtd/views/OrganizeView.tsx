
import React from "react";
import { useGTD, GTDTask } from "../GTDContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";

const OrganizeView: React.FC = () => {
  const { tasks, moveTask, updateTask } = useGTD();
  const { toast } = useToast();
  
  const tasksByCategory = {
    inbox: tasks.filter((t) => t.status === "inbox"),
    nextActions: tasks.filter((t) => t.status === "next-action"),
    projects: tasks.filter((t) => t.status === "project"),
    waitingFor: tasks.filter((t) => t.status === "waiting-for"),
    someday: tasks.filter((t) => t.status === "someday"),
    reference: tasks.filter((t) => t.status === "reference"),
  };
  
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    let newStatus: GTDTask["status"] = "inbox";
    
    switch (destination.droppableId) {
      case "inbox":
        newStatus = "inbox";
        break;
      case "nextActions":
        newStatus = "next-action";
        break;
      case "projects":
        newStatus = "project";
        break;
      case "waitingFor":
        newStatus = "waiting-for";
        break;
      case "someday":
        newStatus = "someday";
        break;
      case "reference":
        newStatus = "reference";
        break;
      default:
        return;
    }
    
    moveTask(draggableId, newStatus);
    
    toast({
      title: "Task moved",
      description: `Task moved to ${destination.droppableId}`,
    });
  };
  
  const TaskList = ({ tasks, droppableId }: { tasks: GTDTask[]; droppableId: string }) => (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "min-h-[150px] p-2 rounded-md",
            snapshot.isDraggingOver && "bg-slate-800/50"
          )}
        >
          {tasks.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">
              {snapshot.isDraggingOver ? "Drop here..." : "Drop tasks here..."}
            </p>
          ) : (
            tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="bg-slate-800 border border-slate-700 p-3 rounded-md mb-2 hover:border-slate-600 transition-all cursor-grab active:cursor-grabbing"
                  >
                    <h4 className="font-medium text-slate-200">{task.title}</h4>
                    {task.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                )}
              </Draggable>
            ))
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
  
  const OrganizeCard = ({
    title,
    tasks,
    droppableId,
  }: {
    title: string;
    tasks: GTDTask[];
    droppableId: string;
  }) => (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 text-[#FF5722]"
          >
            +
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Input 
            placeholder="Search tasks..." 
            className="h-8 bg-slate-800 border-slate-700 text-slate-200"
          />
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <TaskList tasks={tasks} droppableId={droppableId} />
      </CardContent>
    </Card>
  );
  
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <OrganizeCard
          title="Inbox"
          tasks={tasksByCategory.inbox}
          droppableId="inbox"
        />
        <OrganizeCard
          title="Next Actions"
          tasks={tasksByCategory.nextActions}
          droppableId="nextActions"
        />
        <OrganizeCard
          title="Projects"
          tasks={tasksByCategory.projects}
          droppableId="projects"
        />
        <OrganizeCard
          title="Waiting For"
          tasks={tasksByCategory.waitingFor}
          droppableId="waitingFor"
        />
        <OrganizeCard
          title="Someday/Maybe"
          tasks={tasksByCategory.someday}
          droppableId="someday"
        />
        <OrganizeCard
          title="Reference"
          tasks={tasksByCategory.reference}
          droppableId="reference"
        />
      </div>
    </DragDropContext>
  );
};

export default OrganizeView;
