
import React, { useState, useEffect } from "react";
import { useGTD } from "@/components/gtd/GTDContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { 
  CheckCircle, Calendar, Clock, CircleSlash, CheckCircle2, 
  ClipboardCheck, CheckCheck, ArrowRight, Plus 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TaskDialog from "@/components/tasks/TaskDialog";

interface KanbanViewProps {
  isToDoNot: boolean;
}

const KanbanView: React.FC<KanbanViewProps> = ({ isToDoNot }) => {
  const { tasks, updateTask, addTask } = useGTD();
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [columns, setColumns] = useState({
    "to-avoid": [] as any[],
    "avoid-today": [] as any[],
    "in-progress": [] as any[],
    "successfully-avoided": [] as any[],
  });
  const [completionRate, setCompletionRate] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);

  // Filter and organize tasks into columns
  useEffect(() => {
    const filteredTasks = tasks.filter(task => 
      task.isToDoNot === isToDoNot && task.status !== "deleted"
    );

    // For "To Do" tasks
    const todoColumns = {
      "todo": filteredTasks.filter(task => task.status === "todo"),
      "today": filteredTasks.filter(task => task.status === "today"),
      "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
      "completed": filteredTasks.filter(task => task.status === "completed"),
    };

    // For "Not To Do" tasks
    const notTodoColumns = {
      "to-avoid": filteredTasks.filter(task => task.status === "todo"),
      "avoid-today": filteredTasks.filter(task => task.status === "today"),
      "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
      "successfully-avoided": filteredTasks.filter(task => task.status === "completed"),
    };

    if (isToDoNot) {
      setColumns(notTodoColumns);
    } else {
      setColumns(todoColumns);
    }

    // Calculate completion stats
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.status === "completed").length;
    setTotalTasks(total);
    setCompletedTasks(completed);
    setCompletionRate(total > 0 ? (completed / total) * 100 : 0);
  }, [tasks, isToDoNot]);

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const task = tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Map droppableId to task status
    let newStatus: any;
    if (isToDoNot) {
      switch (destination.droppableId) {
        case "to-avoid": newStatus = "todo"; break;
        case "avoid-today": newStatus = "today"; break;
        case "in-progress": newStatus = "in-progress"; break;
        case "successfully-avoided": newStatus = "completed"; break;
        default: newStatus = task.status;
      }
    } else {
      switch (destination.droppableId) {
        case "todo": newStatus = "todo"; break;
        case "today": newStatus = "today"; break;
        case "in-progress": newStatus = "in-progress"; break;
        case "completed": newStatus = "completed"; break;
        default: newStatus = task.status;
      }
    }

    updateTask(draggableId, { status: newStatus });
  };

  const handleAddTask = (task: any) => {
    addTask({
      ...task,
      isToDoNot,
      status: isToDoNot ? "todo" : "todo",
    });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  const getColumnTitle = (columnId: string): string => {
    if (isToDoNot) {
      switch (columnId) {
        case "to-avoid": return "To Avoid";
        case "avoid-today": return "Avoid Today";
        case "in-progress": return "In Progress";
        case "successfully-avoided": return "Successfully Avoided";
        default: return columnId;
      }
    } else {
      switch (columnId) {
        case "todo": return "To Do";
        case "today": return "Today";
        case "in-progress": return "In Progress";
        case "completed": return "Completed";
        default: return columnId;
      }
    }
  };

  const getColumnIcon = (columnId: string) => {
    if (isToDoNot) {
      switch (columnId) {
        case "to-avoid": return <CircleSlash className="h-5 w-5 text-orange-500" />;
        case "avoid-today": return <Calendar className="h-5 w-5 text-red-500" />;
        case "in-progress": return <Clock className="h-5 w-5 text-blue-500" />;
        case "successfully-avoided": return <CheckCheck className="h-5 w-5 text-green-500" />;
        default: return null;
      }
    } else {
      switch (columnId) {
        case "todo": return <ClipboardCheck className="h-5 w-5 text-orange-500" />;
        case "today": return <Calendar className="h-5 w-5 text-red-500" />;
        case "in-progress": return <Clock className="h-5 w-5 text-blue-500" />;
        case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        default: return null;
      }
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "Very High": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      case "Very Low": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">
              {isToDoNot ? "Today's Avoidance Progress" : "Today's Progress"}
            </h2>
            <div className="text-sm text-muted-foreground">
              {completedTasks} / {totalTasks} {isToDoNot ? 'items' : 'tasks'}
            </div>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span>{Math.round(completionRate)}% Complete</span>
            <span>{totalTasks - completedTasks} remaining</span>
          </div>
          <Progress value={completionRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Kanban board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.keys(columns).map(columnId => (
            <div key={columnId} className="flex flex-col">
              <Card className="h-full flex flex-col">
                <CardHeader className="pb-2 flex-shrink-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {getColumnIcon(columnId)}
                      <CardTitle className="text-base">
                        {getColumnTitle(columnId)}
                      </CardTitle>
                    </div>
                    <Badge variant="outline">
                      {columns[columnId].length}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {isToDoNot ? (
                      columnId === "to-avoid" ? "Actions and habits to avoid" :
                      columnId === "avoid-today" ? "Things to avoid today" :
                      columnId === "in-progress" ? "Currently avoiding" :
                      "Things you've successfully avoided"
                    ) : (
                      columnId === "todo" ? "Tasks that need to be completed" :
                      columnId === "today" ? "Tasks scheduled for today" :
                      columnId === "in-progress" ? "Tasks currently being worked on" :
                      "Tasks that have been completed"
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 flex-grow overflow-auto">
                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`min-h-[200px] rounded-md p-2 transition-colors ${
                          snapshot.isDraggingOver ? "bg-muted/50" : ""
                        }`}
                      >
                        {columns[columnId].length === 0 ? (
                          <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground border border-dashed rounded-md p-4">
                            No {isToDoNot ? 'items' : 'tasks'}
                          </div>
                        ) : (
                          columns[columnId].map((task: any, index: number) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-3 mb-2 rounded-md bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                                    snapshot.isDragging ? "opacity-70" : ""
                                  }`}
                                  onClick={() => handleTaskClick(task)}
                                >
                                  <div className="flex flex-col gap-2">
                                    <div className="font-medium">{task.title}</div>
                                    {task.description && (
                                      <p className="text-xs text-muted-foreground line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                      <Badge
                                        className={`${getPriorityColor(task.priority)} text-white`}
                                      >
                                        {task.priority}
                                      </Badge>
                                      {task.timeEstimate && (
                                        <div className="text-xs flex items-center gap-1 text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {task.timeEstimate} min
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
                {columnId === (isToDoNot ? "to-avoid" : "todo") && (
                  <div className="p-3 border-t">
                    <Button
                      onClick={() => {
                        setSelectedTask(null);
                        setShowTaskDialog(true);
                      }}
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      Add {isToDoNot ? "Item" : "Task"}
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>

      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        task={selectedTask}
        onAddTask={handleAddTask}
        onUpdateTask={updateTask}
      />
    </div>
  );
};

export default KanbanView;
