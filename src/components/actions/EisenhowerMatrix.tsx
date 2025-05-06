
import React, { useState, useEffect } from "react";
import { useGTD } from "@/components/gtd/GTDContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Clock, LayoutGrid, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TaskDialog from "@/components/tasks/TaskDialog";

interface EisenhowerMatrixProps {
  isToDoNot: boolean;
}

interface EisenhowerQuadrant {
  id: string;
  title: string;
  description: string;
  color: string;
  tasks: any[];
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ isToDoNot }) => {
  const { tasks, updateTask, addTask } = useGTD();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  
  // Define matrix quadrants
  const [quadrants, setQuadrants] = useState<EisenhowerQuadrant[]>([
    {
      id: "urgent-important", 
      title: isToDoNot ? "Strictly Avoid" : "Do First", 
      description: "Urgent & Important",
      color: "bg-red-900/40 border-red-900/30",
      tasks: []
    },
    {
      id: "important-not-urgent", 
      title: isToDoNot ? "Plan to Eliminate" : "Schedule", 
      description: "Important, Not Urgent",
      color: "bg-amber-900/40 border-amber-900/30",
      tasks: []
    },
    {
      id: "urgent-not-important", 
      title: isToDoNot ? "Find Alternatives" : "Delegate", 
      description: "Urgent, Not Important",
      color: "bg-blue-900/40 border-blue-900/30",
      tasks: []
    },
    {
      id: "not-urgent-not-important", 
      title: isToDoNot ? "Gradually Reduce" : "Eliminate", 
      description: "Not Urgent, Not Important",
      color: "bg-gray-900/40 border-gray-900/30",
      tasks: []
    }
  ]);

  // Filter tasks and organize into quadrants
  useEffect(() => {
    const filteredTasks = tasks.filter(task => 
      task.isToDoNot === isToDoNot && 
      task.status !== "deleted"
    );
    
    // Temporarily store tasks by quadrant
    const urgentImportantTasks: any[] = [];
    const importantNotUrgentTasks: any[] = [];
    const urgentNotImportantTasks: any[] = [];
    const notUrgentNotImportantTasks: any[] = [];
    
    filteredTasks.forEach(task => {
      const isUrgent = task.priority === "Very High" || task.priority === "High";
      const isImportant = task.tags?.includes("important") || 
                         task.priority === "Very High" || 
                         task.priority === "High" ||
                         task.status === "today";
      
      if (isUrgent && isImportant) {
        urgentImportantTasks.push(task);
      } else if (isImportant && !isUrgent) {
        importantNotUrgentTasks.push(task);
      } else if (isUrgent && !isImportant) {
        urgentNotImportantTasks.push(task);
      } else {
        notUrgentNotImportantTasks.push(task);
      }
    });
    
    // Update quadrants with categorized tasks
    setQuadrants(prev => 
      prev.map(q => {
        switch (q.id) {
          case "urgent-important":
            return { ...q, tasks: urgentImportantTasks };
          case "important-not-urgent":
            return { ...q, tasks: importantNotUrgentTasks };
          case "urgent-not-important":
            return { ...q, tasks: urgentNotImportantTasks };
          case "not-urgent-not-important":
            return { ...q, tasks: notUrgentNotImportantTasks };
          default:
            return q;
        }
      })
    );
  }, [tasks, isToDoNot]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    
    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;
    
    // Determine new priority and tags based on destination quadrant
    let newPriority = task.priority;
    let newTags = [...(task.tags || [])];
    
    switch (destination.droppableId) {
      case "urgent-important":
        newPriority = "Very High";
        if (!newTags.includes("important")) {
          newTags.push("important");
        }
        break;
      case "important-not-urgent":
        newPriority = "Medium";
        if (!newTags.includes("important")) {
          newTags.push("important");
        }
        break;
      case "urgent-not-important":
        newPriority = "High";
        newTags = newTags.filter(tag => tag !== "important");
        break;
      case "not-urgent-not-important":
        newPriority = "Low";
        newTags = newTags.filter(tag => tag !== "important");
        break;
    }
    
    updateTask(task.id, { 
      priority: newPriority, 
      tags: newTags
    });
  };

  const handleAddTask = (task: any) => {
    addTask({
      ...task,
      isToDoNot,
      status: "todo",
    });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Eisenhower Matrix {isToDoNot ? "- Things to Avoid" : ""}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Prioritize {isToDoNot ? "habits and actions to avoid" : "tasks"} based on urgency and importance. 
            Drag {isToDoNot ? "items" : "tasks"} between quadrants to change their priority.
          </p>
        </CardHeader>
      </Card>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quadrants.map(quadrant => (
            <Droppable key={quadrant.id} droppableId={quadrant.id}>
              {(provided, snapshot) => (
                <Card 
                  className={`${quadrant.color} border border-1`}
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{quadrant.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">{quadrant.description}</p>
                  </CardHeader>
                  <CardContent className="min-h-[150px]">
                    {quadrant.tasks.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        No {isToDoNot ? "items" : "tasks"} in this quadrant
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {quadrant.tasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-md bg-background shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                  snapshot.isDragging ? "opacity-70" : ""
                                }`}
                                onClick={() => handleTaskClick(task)}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="font-medium">{task.title}</div>
                                  {task.dueDate && (
                                    <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {new Date(task.dueDate).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                                {task.tags && task.tags.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {task.tags.map((tag: string, i: number) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                    {provided.placeholder}
                  </CardContent>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => {
            setSelectedTask(null);
            setShowTaskDialog(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {isToDoNot ? "To-Do-Not" : "Task"}
        </Button>
      </div>
      
      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={selectedTask}
        onAddTask={handleAddTask}
        onUpdateTask={updateTask}
        isToDoNot={isToDoNot}
      />
    </div>
  );
};

export default EisenhowerMatrix;
