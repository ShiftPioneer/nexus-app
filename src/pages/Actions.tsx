
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { CheckSquare, XSquare, Layout, BarChart3 } from "lucide-react";
import TasksTabView from "@/components/tasks/TasksTabView";
import NotToDoMatrix from "@/components/tasks/NotToDoMatrix";
import EisenhowerMatrix from "@/components/tasks/EisenhowerMatrix";
import DeletedTasksDialog from "@/components/tasks/DeletedTasksDialog";

const Actions = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);

  // Placeholder data and handlers
  const [tasks] = useState([]);
  const [deletedTasks] = useState([]);

  const handleTaskUpdate = (id: string, updates: any) => {
    // Placeholder implementation
    console.log('Task update:', id, updates);
  };

  const handleTaskClick = (id: string) => {
    // Placeholder implementation
    console.log('Task clicked:', id);
  };

  const handleRestoreTask = (id: string) => {
    // Placeholder implementation
    console.log('Restore task:', id);
  };

  const handlePermanentlyDeleteTask = (id: string) => {
    // Placeholder implementation
    console.log('Permanently delete task:', id);
  };

  const tabItems = [
    { 
      value: "todo", 
      label: "To Do", 
      icon: CheckSquare,
      gradient: "from-emerald-500 via-teal-500 to-cyan-500"
    },
    { 
      value: "not-todo", 
      label: "Not To Do", 
      icon: XSquare,
      gradient: "from-red-500 via-rose-500 to-pink-500"
    },
    { 
      value: "matrix", 
      label: "Priority Matrix", 
      icon: Layout,
      gradient: "from-purple-500 via-indigo-500 to-blue-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <UnifiedPageHeader
          title="Actions"
          description="Manage your tasks, priorities, and action items effectively"
          icon={CheckSquare}
          gradient="from-emerald-500 via-teal-500 to-cyan-500"
        />

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList>
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="todo">
            <TasksTabView />
          </ModernTabsContent>
          
          <ModernTabsContent value="not-todo">
            <NotToDoMatrix 
              tasks={tasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskClick={handleTaskClick}
            />
          </ModernTabsContent>
          
          <ModernTabsContent value="matrix">
            <EisenhowerMatrix />
          </ModernTabsContent>
        </ModernTabs>

        <DeletedTasksDialog 
          open={showDeletedTasks} 
          onOpenChange={setShowDeletedTasks}
          deletedTasks={deletedTasks}
          onRestoreTask={handleRestoreTask}
          onPermanentlyDeleteTask={handlePermanentlyDeleteTask}
        />
      </div>
    </ModernAppLayout>
  );
};

export default Actions;
