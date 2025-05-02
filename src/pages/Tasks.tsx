
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusCircle, Calendar, ArrowRight, ArrowLeft, 
  CalendarDays, CheckSquare, Grid2X2, ListTodo 
} from "lucide-react";
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
import EisenhowerMatrix from "@/components/gtd/EisenhowerMatrix";

type ViewMode = "list" | "kanban" | "eisenhower"; 

const TasksContent = () => {
  const { toast } = useToast();
  const { tasks: allTasks, updateTask, moveTask, addTask } = useGTD();
  const [viewMode, setViewMode] = useState<ViewMode>("list"); // Changed default to list view
  const [selectedDay, setSelectedDay] = useState(startOfToday());
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<GTDTask | null>(null);
  
  // Get tasks based on the selected view
  const getTodayTasks = () => {
    return allTasks.filter(task => task.status === "today" && !task.isToDoNot);
  };
  
  const getIncompleteTasks = () => {
    return allTasks.filter(task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && !isCompleted(task) && !task.isToDoNot);
  };
  
  const getCompletedTasks = () => {
    return allTasks.filter(task => task.status === "completed" && !task.isToDoNot);
  };
  
  // Helper to check if a task is completed
  const isCompleted = (task: GTDTask) => {
    return task.status === "completed";
  };
  
  // Get kanban columns for task board
  const getKanbanColumns = () => {
    return {
      "todo": allTasks.filter(task => (task.status === "todo" || task.status === "next-action") && !task.isToDoNot),
      "today": allTasks.filter(task => task.status === "today" && !task.isToDoNot),
      "in-progress": allTasks.filter(task => task.status === "in-progress" && !task.isToDoNot),
      "completed": allTasks.filter(task => task.status === "completed" && !task.isToDoNot),
    };
  };
  
  // Get eisenhower matrix quadrants
  const getEisenhowerMatrix = () => {
    const urgentImportant = allTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        (task.priority === "Very High" || task.priority === "High") && !task.isToDoNot
    );
    
    const notUrgentImportant = allTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Medium" && !task.isToDoNot
    );
    
    const urgentNotImportant = allTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Low" && !task.isToDoNot
    );
    
    const notUrgentNotImportant = allTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Very Low" && !task.isToDoNot
    );
    
    return {
      "urgent-important": urgentImportant,
      "not-urgent-important": notUrgentImportant,
      "urgent-not-important": urgentNotImportant,
      "not-urgent-not-important": notUrgentNotImportant,
    };
  };
  
  // Get stats for dashboard
  const getTasksStats = () => {
    const todayTasks = getTodayTasks();
    const completedTodayTasks = todayTasks.filter(task => isCompleted(task));
    const completionPercentage = todayTasks.length > 0 
      ? Math.round((completedTodayTasks.length / todayTasks.length) * 100) 
      : 0;
    
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
      description: `Task moved to ${newStatus.replace("-", " ")}`,
    });
  };
  
  const handleTaskSubmit = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: "Task Updated",
        description: "Your task has been updated",
      });
    } else {
      addTask({
        ...taskData,
        status: "todo",
        isToDoNot: false // Ensure we're creating a regular task, not a not-to-do
      });
      toast({
        title: "Task Added",
        description: "Your task has been created",
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
  const stats = getTasksStats();
  
  function renderTasksContent() {
    // Fix the type comparison by casting the viewMode to a string for comparison
    if (viewMode === "eisenhower") {
      // When in Eisenhower mode, show navigation buttons to go back to list/kanban view
      return (
        <div>
          <div className="mb-4 flex justify-end">
            <div className="flex bg-muted rounded-lg p-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="gap-1"
              >
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">List View</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode("kanban")}
                className="gap-1"
              >
                <Grid2X2 className="h-4 w-4" />
                <span className="hidden sm:inline">Kanban View</span>
              </Button>
            </div>
          </div>
          <EisenhowerMatrix 
            matrix={getEisenhowerMatrix()} 
            onTaskClick={handleEditTask}
            onTaskMove={handleTaskMove}
            getPriorityColor={getPriorityColor}
          />
        </div>
      );
    } 
    
    return (
      <>
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Today's Progress</CardTitle>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="font-normal">
                  {stats.completed} / {stats.total} tasks
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">
                    {stats.completed === stats.total && stats.total > 0 
                      ? "Completed!" 
                      : `${stats.completionPercentage}% Complete`}
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

        {viewMode === "kanban" && (
          <KanbanBoard
            columns={getKanbanColumns()}
            onTaskClick={handleEditTask}
            onTaskMove={handleTaskMove}
            getPriorityColor={getPriorityColor}
          />
        )}

        {viewMode === "list" && (
          <Tabs defaultValue="today">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="today" className="mt-4">
              <TasksList 
                tasks={getTodayTasks()} 
                showActions={true}
              />
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-4">
              <TasksList 
                tasks={getIncompleteTasks().filter(t => t.status !== "today")} 
                showActions={true}
              />
            </TabsContent>
            
            <TabsContent value="completed" className="mt-4">
              <TasksList 
                tasks={getCompletedTasks()} 
                showActions={false}
              />
            </TabsContent>
          </Tabs>
        )}
      </>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Manage your daily tasks and priorities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <Button 
              variant={viewMode === "list" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("list")}
              className="gap-1"
            >
              <ListTodo className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </Button>
            <Button 
              variant={viewMode === "kanban" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("kanban")}
              className="gap-1"
            >
              <Grid2X2 className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </Button>
            <Button 
              variant={viewMode === "eisenhower" ? "default" : "ghost"} 
              size="sm" 
              onClick={() => setViewMode("eisenhower")}
              className="gap-1"
            >
              <CheckSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Eisenhower</span>
            </Button>
          </div>
          
          <Button onClick={handleAddTask} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Add Task</span>
          </Button>
        </div>
      </div>
      
      {renderTasksContent()}
      
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => setShowAddTaskDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Wrapper component that provides the GTD context
const Tasks = () => {
  return (
    <AppLayout>
      <GTDProvider>
        <TasksContent />
      </GTDProvider>
    </AppLayout>
  );
};

export default Tasks;
