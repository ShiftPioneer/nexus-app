
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import TasksTabView from "@/components/tasks/TasksTabView";
import DragDropKanban from "@/components/tasks/DragDropKanban";
import DragDropMatrix from "@/components/tasks/DragDropMatrix";
import NotToDoMatrix from "@/components/tasks/NotToDoMatrix";
import TaskDialog from "@/components/tasks/TaskDialog";
import { CheckCircle, XCircle, Kanban, Grid3X3 } from "lucide-react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

const Actions = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "matrix">("list");
  const [tasks, setTasks] = useLocalStorage("actionTasks", []);
  const [notToDoTasks, setNotToDoTasks] = useLocalStorage("notToDoTasks", []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const { toast } = useToast();

  const currentTasks = activeTab === "todo" ? tasks : notToDoTasks;
  const setCurrentTasks = activeTab === "todo" ? setTasks : setNotToDoTasks;

  const handleTaskUpdate = (taskId: string, updates: any) => {
    setCurrentTasks((prevTasks: any[]) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    
    toast({
      title: "Task Updated",
      description: "Task has been updated successfully",
    });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowTaskDialog(true);
  };

  const handleAddTask = (taskData: any) => {
    const newTask = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      type: activeTab === "todo" ? "todo" : "not-todo",
    };

    setCurrentTasks((prevTasks: any[]) => [...prevTasks, newTask]);
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    handleTaskUpdate(taskId, updates);
    setShowTaskDialog(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setCurrentTasks((prevTasks: any[]) =>
      prevTasks.filter((task) => task.id !== taskId)
    );
    setShowTaskDialog(false);
    setSelectedTask(null);
  };
  
  return (
    <ModernAppLayout>
      <div className="animate-fade-in p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Actions</h1>
          <p className="text-muted-foreground mt-2">Manage your to-do list and track what not to do</p>
        </div>

        <Tabs defaultValue="todo" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <TabsList>
              <TabsTrigger value="todo" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                To Do ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="not-todo" className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Not To Do ({notToDoTasks.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "list" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "kanban" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Kanban className="h-4 w-4" />
                Kanban
              </button>
              <button
                onClick={() => setViewMode("matrix")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  viewMode === "matrix" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
                Matrix
              </button>
            </div>
          </div>
          
          <TabsContent value="todo" className="mt-6">
            {viewMode === "list" && (
              <TasksTabView isToDoNot={false} />
            )}
            {viewMode === "kanban" && (
              <DragDropKanban 
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
                isToDoNot={false}
              />
            )}
            {viewMode === "matrix" && (
              <DragDropMatrix 
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
              />
            )}
          </TabsContent>
          
          <TabsContent value="not-todo" className="mt-6">
            {viewMode === "list" && (
              <TasksTabView isToDoNot={true} />
            )}
            {viewMode === "kanban" && (
              <DragDropKanban 
                tasks={notToDoTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
                isToDoNot={true}
              />
            )}
            {viewMode === "matrix" && (
              <NotToDoMatrix 
                tasks={notToDoTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
              />
            )}
          </TabsContent>
        </Tabs>

        <TaskDialog
          open={showTaskDialog}
          onOpenChange={setShowTaskDialog}
          task={selectedTask}
          onAddTask={handleAddTask}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          isToDoNot={activeTab === "not-todo"}
        />
      </div>
    </ModernAppLayout>
  );
};

export default Actions;
