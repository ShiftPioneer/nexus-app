
import React, { useState } from "react";
import { useGTD, GTDTask } from "../GTDContext";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Search, Edit, Check, Trash, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OrganizeView: React.FC = () => {
  const { tasks, moveTask, updateTask, deleteTask } = useGTD();
  const { toast } = useToast();
  const [editingTask, setEditingTask] = useState<GTDTask | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPriority, setEditedPriority] = useState<string>("Medium");
  
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

  const openEditDialog = (task: GTDTask) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
    setEditedPriority(task.priority);
  };

  const closeEditDialog = () => {
    setEditingTask(null);
  };

  const saveTaskChanges = () => {
    if (!editingTask || !editedTitle.trim()) return;

    updateTask(editingTask.id, {
      title: editedTitle,
      description: editedDescription,
      priority: editedPriority as GTDTask["priority"]
    });

    toast({
      title: "Task updated",
      description: "Task details have been updated successfully",
    });
    
    closeEditDialog();
  };

  const handleCompleteTask = (taskId: string) => {
    moveTask(taskId, "completed");
    
    toast({
      title: "Task completed",
      description: "Task has been marked as completed",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    
    toast({
      title: "Task deleted",
      description: "Task has been deleted",
    });
  };
  
  const TaskItem = ({ task, index }: { task: GTDTask; index: number }) => (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-slate-800 border border-slate-700 p-3 rounded-md mb-2 hover:border-slate-600 transition-all cursor-grab active:cursor-grabbing",
            snapshot.isDragging && "shadow-lg"
          )}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-slate-200">{task.title}</h4>
              {task.description && (
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex space-x-1 ml-2">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(task);
                }} 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 text-slate-400 hover:text-slate-100"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleCompleteTask(task.id);
                }} 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 text-green-500 hover:text-green-400"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }} 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7 text-red-500 hover:text-red-400"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-slate-700 text-xs rounded-md text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
  
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
              <TaskItem key={task.id} task={task} index={index} />
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

      <Dialog open={!!editingTask} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details and save changes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)} 
                placeholder="Task title" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={editedDescription} 
                onChange={(e) => setEditedDescription(e.target.value)} 
                placeholder="Task description (optional)" 
                rows={3} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={editedPriority} onValueChange={setEditedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Very Low">Very Low</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Very High">Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
              <Button onClick={saveTaskChanges}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DragDropContext>
  );
};

export default OrganizeView;
