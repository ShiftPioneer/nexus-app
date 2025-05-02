import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Calendar, ArrowRight, ArrowLeft, CalendarDays, CheckSquare, Grid2X2, ListTodo, Filter } from "lucide-react";
import { format, startOfToday, addDays } from "date-fns";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { GTDProvider, useGTD, GTDTask, TaskPriority, TaskStatus } from "@/components/gtd/GTDContext";
import TaskForm from "@/components/tasks/TaskForm";
import TasksList from "@/components/gtd/TasksList";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
type ViewMode = "list" | "kanban" | "eisenhower";
const ActionsContent = () => {
  const {
    toast
  } = useToast();
  const {
    tasks: allTasks,
    updateTask,
    moveTask,
    addTask
  } = useGTD();
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Default to list view
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<GTDTask | null>(null);
  const [activeTab, setActiveTab] = useState<"todo" | "not-to-do">("todo");

  // Get tasks based on the selected view
  const getTodayTasks = (isToDoNot: boolean = false) => {
    return allTasks.filter(task => task.status === "today" && task.isToDoNot === isToDoNot);
  };
  const getIncompleteTasks = (isToDoNot: boolean = false) => {
    return allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && !isCompleted(task) && task.isToDoNot === isToDoNot);
  };
  const getCompletedTasks = (isToDoNot: boolean = false) => {
    return allTasks.filter(task => task.status === "completed" && task.isToDoNot === isToDoNot);
  };

  // Helper to check if a task is completed
  const isCompleted = (task: GTDTask) => {
    return task.status === "completed";
  };

  // Get kanban columns for task board
  const getKanbanColumns = (isToDoNot: boolean = false) => {
    return {
      "todo": allTasks.filter(task => (task.status === "todo" || task.status === "next-action") && task.isToDoNot === isToDoNot),
      "today": allTasks.filter(task => task.status === "today" && task.isToDoNot === isToDoNot),
      "in-progress": allTasks.filter(task => task.status === "in-progress" && task.isToDoNot === isToDoNot),
      "completed": allTasks.filter(task => task.status === "completed" && task.isToDoNot === isToDoNot)
    };
  };

  // Get eisenhower matrix quadrants
  const getEisenhowerMatrix = (isToDoNot: boolean = false) => {
    const urgentImportant = allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && (task.priority === "Very High" || task.priority === "High") && task.isToDoNot === isToDoNot);
    const notUrgentImportant = allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && task.priority === "Medium" && task.isToDoNot === isToDoNot);
    const urgentNotImportant = allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && task.priority === "Low" && task.isToDoNot === isToDoNot);
    const notUrgentNotImportant = allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && task.priority === "Very Low" && task.isToDoNot === isToDoNot);
    return {
      "urgent-important": urgentImportant,
      "not-urgent-important": notUrgentImportant,
      "urgent-not-important": urgentNotImportant,
      "not-urgent-not-important": notUrgentNotImportant
    };
  };

  // Get stats for dashboard
  const getTasksStats = (isToDoNot: boolean = false) => {
    const todayTasks = getTodayTasks(isToDoNot);
    const completedTodayTasks = todayTasks.filter(task => isCompleted(task));
    const completionPercentage = todayTasks.length > 0 ? Math.round(completedTodayTasks.length / todayTasks.length * 100) : 0;
    return {
      total: todayTasks.length,
      completed: completedTodayTasks.length,
      pending: todayTasks.length - completedTodayTasks.length,
      completionPercentage
    };
  };

  // Handle task operations
  const handleAddTask = () => {
    setEditingTask(null);
    setShowAddTaskDialog(true);
  };
  const handleEditTask = (task: GTDTask) => {
    setEditingTask(task);
    setShowAddTaskDialog(true);
  };
  const handleTaskMove = (taskId: string, newStatus: string) => {
    moveTask(taskId, newStatus as TaskStatus);
    toast({
      title: "Task Updated",
      description: `Task moved to ${newStatus.replace("-", " ")}`
    });
  };
  const handleTaskSubmit = (taskData: any) => {
    const isToDoNot = activeTab === "not-to-do";
    if (editingTask) {
      updateTask(editingTask.id, {
        ...taskData,
        isToDoNot
      });
      toast({
        title: "Task Updated",
        description: activeTab === "todo" ? "Your task has been updated" : "Your to-do-not item has been updated"
      });
    } else {
      addTask({
        ...taskData,
        status: "todo",
        isToDoNot
      });
      toast({
        title: "Task Added",
        description: activeTab === "todo" ? "Your task has been created" : "Your to-do-not item has been created"
      });
    }
    setShowAddTaskDialog(false);
  };

  // Priority color helper
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "Very High":
        return "bg-red-500";
      case "High":
        return "bg-orange-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-blue-500";
      case "Very Low":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Navigation helpers
  const goToNextDay = () => {
    setSelectedDay(addDays(selectedDay, 1));
  };
  const goToPrevDay = () => {
    setSelectedDay(addDays(selectedDay, -1));
  };

  // Stats for the dashboard
  const stats = getTasksStats(activeTab === "not-to-do");
  return <motion.div className="space-y-6" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{activeTab === "todo" ? "Actions" : "Actions to Avoid"}</h1>
          <p className="text-muted-foreground">
            {activeTab === "todo" ? "Manage your daily tasks and priorities" : "Track habits and actions to avoid"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Always show view toggle buttons */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")} className="gap-1">
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button variant={viewMode === "kanban" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("kanban")} className="gap-1">
              <Grid2X2 className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button variant={viewMode === "eisenhower" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("eisenhower")} className="gap-1">
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Eisenhower</span>
            </Button>
          </div>
          
          <Button onClick={handleAddTask} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>{activeTab === "todo" ? "Add Task" : "Add To-Do-Not"}</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="todo" value={activeTab} onValueChange={value => setActiveTab(value as "todo" | "not-to-do")} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="todo" className="flex-1">To Do</TabsTrigger>
          <TabsTrigger value="not-to-do" className="flex-1">Not To Do </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todo">
          {renderTasksContent(false)}
        </TabsContent>
        
        <TabsContent value="not-to-do">
          {renderTasksContent(true)}
        </TabsContent>
      </Tabs>

      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <TaskForm task={editingTask} onSubmit={handleTaskSubmit} onCancel={() => setShowAddTaskDialog(false)} isToDoNot={activeTab === "not-to-do"} />
        </DialogContent>
      </Dialog>
    </motion.div>;
  function renderTasksContent(isToDoNot: boolean) {
    if (viewMode === "eisenhower") {
      return <div>
          <EisenhowerMatrix matrix={getEisenhowerMatrix(isToDoNot)} onTaskClick={handleEditTask} onTaskMove={handleTaskMove} getPriorityColor={getPriorityColor} isToDoNot={isToDoNot} />
        </div>;
    }
    return <>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{isToDoNot ? "Today's Avoidance Progress" : "Today's Progress"}</CardTitle>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="font-normal">
                  {stats.completed} / {stats.total} {isToDoNot ? "items" : "tasks"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">
                    {stats.completed === stats.total && stats.total > 0 ? "Completed!" : `${stats.completionPercentage}% Complete`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stats.pending} remaining
                  </span>
                </div>
                <Progress value={stats.completionPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "kanban" && <KanbanBoard columns={getKanbanColumns(isToDoNot)} onTaskClick={handleEditTask} onTaskMove={handleTaskMove} getPriorityColor={getPriorityColor} isToDoNot={isToDoNot} />}

        {viewMode === "list" && <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">{isToDoNot ? "Today's To Avoid" : "Today"}</TabsTrigger>
              <TabsTrigger value="upcoming">{isToDoNot ? "All To Avoid" : "Upcoming"}</TabsTrigger>
              <TabsTrigger value="completed">{isToDoNot ? "Successfully Avoided" : "Completed"}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              <TasksList tasks={getTodayTasks(isToDoNot)} showActions={true} isToDoNot={isToDoNot} />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              <TasksList tasks={getIncompleteTasks(isToDoNot).filter(t => t.status !== "today")} showActions={true} isToDoNot={isToDoNot} />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <TasksList tasks={getCompletedTasks(isToDoNot)} showActions={false} isToDoNot={isToDoNot} />
            </TabsContent>
          </Tabs>}
      </>;
  }
};

// Wrapper component that provides the GTD context
const Actions = () => {
  return <AppLayout>
      <GTDProvider>
        <ActionsContent />
      </GTDProvider>
    </AppLayout>;
};
interface EisenhowerMatrixProps {
  matrix: {
    [key: string]: GTDTask[];
  };
  onTaskClick: (task: GTDTask) => void;
  onTaskMove: (taskId: string, newStatus: string) => void;
  getPriorityColor: (priority: string) => string;
  isToDoNot?: boolean;
}
const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  matrix,
  onTaskClick,
  onTaskMove,
  getPriorityColor,
  isToDoNot = false
}) => {
  const quadrants = [{
    id: "urgent-important",
    title: isToDoNot ? "Strictly Avoid" : "Do First",
    description: "Urgent & Important",
    className: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
    headerClass: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
  }, {
    id: "not-urgent-important",
    title: isToDoNot ? "Plan to Eliminate" : "Schedule",
    description: "Important, Not Urgent",
    className: "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800",
    headerClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200"
  }, {
    id: "urgent-not-important",
    title: isToDoNot ? "Find Alternatives" : "Delegate",
    description: "Urgent, Not Important",
    className: "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
    headerClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
  }, {
    id: "not-urgent-not-important",
    title: isToDoNot ? "Gradually Reduce" : "Eliminate",
    description: "Not Urgent, Not Important",
    className: "bg-gray-50 border-gray-200 dark:bg-gray-800/20 dark:border-gray-700",
    headerClass: "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200"
  }];
  return <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Eisenhower Matrix {isToDoNot && " - Things to Avoid"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {isToDoNot ? "Prioritize habits and actions to avoid based on urgency and importance." : "Prioritize tasks based on urgency and importance. Drag tasks between quadrants to change their priority."}
          </p>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quadrants.map(quadrant => <Card key={quadrant.id} className={`border ${quadrant.className}`}>
            <CardHeader className={`pb-2 ${quadrant.headerClass}`}>
              <CardTitle className="text-lg">{quadrant.title}</CardTitle>
              <p className="text-xs">{quadrant.description}</p>
            </CardHeader>
            <CardContent className="max-h-[300px] overflow-y-auto">
              {matrix[quadrant.id]?.length > 0 ? <div className="space-y-2">
                  {matrix[quadrant.id].map(task => <Card key={task.id} className="cursor-pointer border hover:shadow-sm transition-shadow" onClick={() => onTaskClick(task)}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-2">
                            <h4 className="text-sm font-medium">{task.title}</h4>
                            {task.description && <p className="text-xs text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>}
                          </div>
                          <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)} flex-shrink-0`} />
                        </div>
                      </CardContent>
                    </Card>)}
                </div> : <div className="py-8 text-center text-muted-foreground">
                  <p className="text-sm">No {isToDoNot ? "items" : "tasks"} in this quadrant</p>
                </div>}
            </CardContent>
          </Card>)}
      </div>
    </div>;
};
export default Actions;
