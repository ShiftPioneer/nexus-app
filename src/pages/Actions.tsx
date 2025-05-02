
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { GTDProvider, GTDTask, TaskStatus, useGTD } from "@/components/gtd/GTDContext";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PlusCircle, Check, Clock, Archive, Grid2X2, ListTodo, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import TaskForm from "@/components/tasks/TaskForm";
import TasksList from "@/components/gtd/TasksList";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import EisenhowerMatrix from "@/components/gtd/EisenhowerMatrix";
import { Badge } from "@/components/ui/badge";

type ViewMode = "list" | "kanban" | "eisenhower";

interface ActionContentProps {
  taskType: "todo" | "not-todo";
}

const ActionContent = ({ taskType }: ActionContentProps) => {
  const { tasks, updateTask, addTask, moveTask } = useGTD();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<GTDTask | null>(null);
  
  // Filter tasks based on the current tab
  const filteredTasks = tasks.filter(task => {
    if (taskType === "todo") {
      return !task.isToDoNot;
    } else {
      return task.isToDoNot === true;
    }
  });
  
  // Get tasks for each status
  const getTodayTasks = () => {
    return filteredTasks.filter(task => task.status === "today");
  };
  
  const getPlannedTasks = () => {
    return filteredTasks.filter(task => 
      task.status === "next-action" || 
      task.status === "todo" ||
      task.status === "someday"
    );
  };
  
  const getWaitingForTasks = () => {
    return filteredTasks.filter(task => task.status === "waiting-for" || task.status === "in-progress");
  };
  
  const getCompletedTasks = () => {
    return filteredTasks.filter(task => task.status === "completed");
  };
  
  // Get kanban columns for task board
  const getKanbanColumns = () => {
    return {
      "todo": filteredTasks.filter(task => task.status === "todo" || task.status === "next-action"),
      "today": filteredTasks.filter(task => task.status === "today"),
      "in-progress": filteredTasks.filter(task => task.status === "in-progress" || task.status === "waiting-for"),
      "completed": filteredTasks.filter(task => task.status === "completed"),
    };
  };
  
  // Get eisenhower matrix quadrants
  const getEisenhowerMatrix = () => {
    const urgentImportant = filteredTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        (task.priority === "Very High" || task.priority === "High")
    );
    
    const notUrgentImportant = filteredTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Medium"
    );
    
    const urgentNotImportant = filteredTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Low"
    );
    
    const notUrgentNotImportant = filteredTasks.filter(
      task => (task.status === "today" || task.status === "todo" || task.status === "next-action") && 
        task.priority === "Very Low"
    );
    
    return {
      "urgent-important": urgentImportant,
      "not-urgent-important": notUrgentImportant,
      "urgent-not-important": urgentNotImportant,
      "not-urgent-not-important": notUrgentNotImportant,
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
  
  const handleTaskComplete = (id: string) => {
    updateTask(id, { status: "completed" });
    toast({
      title: taskType === "not-todo" ? "Successfully Avoided" : "Task Completed",
      description: taskType === "not-todo" 
        ? "You've successfully avoided this item!" 
        : "Great job completing this task!"
    });
  };
  
  const handleTaskSubmit = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: "Updated",
        description: taskType === "not-todo" 
          ? "Your item has been updated" 
          : "Your task has been updated",
      });
    } else {
      addTask({
        ...taskData,
        status: "todo",
        isToDoNot: taskType === "not-todo"
      });
      toast({
        title: "Added",
        description: taskType === "not-todo" 
          ? "Your item has been added" 
          : "Your task has been created",
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
  
  function renderContent() {
    // Fix type comparison by checking for strict equality with the string
    if (viewMode === "eisenhower") {
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
            isToDoNot={taskType === "not-todo"}
          />
        </div>
      );
    }
    
    if (viewMode === "kanban") {
      return (
        <KanbanBoard
          columns={getKanbanColumns()}
          onTaskClick={handleEditTask}
          onTaskMove={handleTaskMove}
          getPriorityColor={getPriorityColor}
          isToDoNot={taskType === "not-todo"}
        />
      );
    }
    
    return (
      <Tabs defaultValue="today">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="today">
            <div className="flex items-center gap-1">
              <Check className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
              <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
                {getTodayTasks().length}
              </Badge>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="planned">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Planned</span>
              <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
                {getPlannedTasks().length}
              </Badge>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="waiting">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">
                {taskType === "not-todo" ? "Avoiding" : "Waiting"}
              </span>
              <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
                {getWaitingForTasks().length}
              </Badge>
            </div>
          </TabsTrigger>
          
          <TabsTrigger value="completed">
            <div className="flex items-center gap-1">
              <Archive className="h-4 w-4" />
              <span className="hidden sm:inline">
                {taskType === "not-todo" ? "Avoided" : "Completed"}
              </span>
              <Badge variant="secondary" className="ml-1 hidden sm:inline-flex">
                {getCompletedTasks().length}
              </Badge>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="today" className="mt-0">
          <TasksList 
            tasks={getTodayTasks()} 
            showActions={true}
            onTaskComplete={handleTaskComplete}
            isToDoNot={taskType === "not-todo"}
          />
        </TabsContent>
        
        <TabsContent value="planned" className="mt-0">
          <TasksList 
            tasks={getPlannedTasks()}
            showActions={true}
            onTaskComplete={handleTaskComplete}
            isToDoNot={taskType === "not-todo"}
          />
        </TabsContent>
        
        <TabsContent value="waiting" className="mt-0">
          <TasksList 
            tasks={getWaitingForTasks()}
            showActions={true}
            onTaskComplete={handleTaskComplete}
            isToDoNot={taskType === "not-todo"}
          />
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <TasksList 
            tasks={getCompletedTasks()} 
            showActions={false}
            isToDoNot={taskType === "not-todo"}
          />
        </TabsContent>
      </Tabs>
    );
  }
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {taskType === "todo" ? "To Do" : "Not To Do"}
          </h2>
          <p className="text-muted-foreground">
            {taskType === "todo" 
              ? "Manage your tasks and priorities" 
              : "Track habits and actions to avoid"}
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
              <span className="hidden sm:inline">Matrix</span>
            </Button>
          </div>
          
          <Button onClick={handleAddTask} className="gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>
              {taskType === "todo" ? "Add Task" : "Add Item"}
            </span>
          </Button>
        </div>
      </div>
      
      {renderContent()}
      
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => setShowAddTaskDialog(false)}
            isToDoNot={taskType === "not-todo"}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const Actions = () => {
  return (
    <AppLayout>
      <GTDProvider>
        <motion.div 
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Actions</h1>
            <p className="text-muted-foreground">
              Organize your tasks and avoid unhelpful actions.
            </p>
          </div>
          
          <Tabs defaultValue="todo">
            <TabsList className="w-full border-b mb-6">
              <TabsTrigger value="todo" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                To Do
              </TabsTrigger>
              <TabsTrigger value="not-todo" className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
                Not To Do
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="todo" className="mt-0">
              <ActionContent taskType="todo" />
            </TabsContent>
            
            <TabsContent value="not-todo" className="mt-0">
              <ActionContent taskType="not-todo" />
            </TabsContent>
          </Tabs>
        </motion.div>
      </GTDProvider>
    </AppLayout>
  );
};

export default Actions;
