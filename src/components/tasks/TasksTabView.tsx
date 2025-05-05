
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import TasksList from "@/components/gtd/TasksList";
import TaskDialog from "@/components/tasks/TaskDialog";
import DeletedTasksDialog from "@/components/tasks/DeletedTasksDialog";
import { useGTD } from "@/components/gtd/GTDContext";

interface TasksTabViewProps {
  isToDoNot?: boolean;
}

const TasksTabView: React.FC<TasksTabViewProps> = ({ isToDoNot = false }) => {
  const { tasks, addTask, updateTask, deleteTask, permanentlyDeleteTask, getDeletedTasks, restoreTask } = useGTD();
  const [activeTab, setActiveTab] = useState<string>("today");
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showDeletedTasksDialog, setShowDeletedTasksDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  // Filter tasks based on the active tab
  const filteredTasks = tasks.filter(task => {
    if (isToDoNot !== !!task.isToDoNot) return false;
    if (task.status === "deleted") return false;
    
    if (activeTab === "today") {
      return task.status === "today";
    }
    
    if (activeTab === "upcoming") {
      return task.status === "todo" || task.status === "next-action" || task.status === "in-progress";
    }
    
    if (activeTab === "completed") {
      return task.status === "completed";
    }
    
    return true;
  });

  const handleAddTask = (task: any) => {
    addTask({
      ...task,
      isToDoNot,
      // Set status based on the active tab
      status: activeTab === "today" 
        ? "today" 
        : activeTab === "completed" 
          ? "completed" 
          : "todo",
    });
  };

  const handleEditTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      setSelectedTask(task);
      setShowTaskDialog(true);
    }
  };

  const handleTaskComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      updateTask(id, { 
        status: task.status === "completed" ? "todo" : "completed" 
      });
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeletedTasksDialog(true)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Trash
              </Button>
              
              <Button
                onClick={() => {
                  setSelectedTask(null);
                  setShowTaskDialog(true);
                }}
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Add {isToDoNot ? "Item" : "Task"}
              </Button>
            </div>
          </div>
          
          <TabsContent value="today" className="mt-4">
            <TasksList 
              tasks={filteredTasks}
              showActions={true}
              onTaskComplete={handleTaskComplete}
              isToDoNot={isToDoNot}
              onEdit={handleEditTask}
            />
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-4">
            <TasksList 
              tasks={filteredTasks}
              showActions={true}
              onTaskComplete={handleTaskComplete}
              isToDoNot={isToDoNot}
              onEdit={handleEditTask}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-4">
            <TasksList 
              tasks={filteredTasks}
              showActions={true}
              onTaskComplete={handleTaskComplete}
              isToDoNot={isToDoNot}
              onEdit={handleEditTask}
            />
          </TabsContent>
          
          <TabsContent value="all" className="mt-4">
            <TasksList 
              tasks={filteredTasks}
              showActions={true}
              onTaskComplete={handleTaskComplete}
              isToDoNot={isToDoNot}
              onEdit={handleEditTask}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <TaskDialog
        open={showTaskDialog}
        onOpenChange={setShowTaskDialog}
        initialTask={selectedTask}
        onAddTask={handleAddTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
      />
      
      <DeletedTasksDialog
        open={showDeletedTasksDialog}
        onOpenChange={setShowDeletedTasksDialog}
        deletedTasks={getDeletedTasks().filter(task => isToDoNot === !!task.isToDoNot)}
        onRestoreTask={restoreTask}
        onPermanentlyDeleteTask={permanentlyDeleteTask}
      />
    </div>
  );
};

export default TasksTabView;
