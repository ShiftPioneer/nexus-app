
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { CheckSquare, XSquare, Layout, BarChart3, Kanban } from "lucide-react";
import TasksTabView from "@/components/tasks/TasksTabView";
import NotToDoMatrix from "@/components/tasks/NotToDoMatrix";
import EisenhowerMatrix from "@/components/tasks/EisenhowerMatrix";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import DeletedTasksDialog from "@/components/tasks/DeletedTasksDialog";

const Actions = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [showDeletedTasks, setShowDeletedTasks] = useState(false);

  // Placeholder data and handlers
  const [tasks] = useState([]);
  const [deletedTasks] = useState([]);

  const handleTaskUpdate = (id: string, updates: any) => {
    console.log('Task update:', id, updates);
  };

  const handleTaskClick = (id: string) => {
    console.log('Task clicked:', id);
  };

  const handleRestoreTask = (id: string) => {
    console.log('Restore task:', id);
  };

  const handlePermanentlyDeleteTask = (id: string) => {
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
      value: "kanban", 
      label: "Kanban", 
      icon: Kanban,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
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
          <ModernTabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
            {tabItems.map((tab) => (
              <ModernTabsTrigger 
                key={tab.value}
                value={tab.value}
                gradient={tab.gradient}
                icon={tab.icon}
                className="flex-1"
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="todo" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <TasksTabView />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="not-todo" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <NotToDoMatrix 
                tasks={tasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskClick={handleTaskClick}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="kanban" className="mt-8">
            <div className="max-w-7xl mx-auto">
              <KanbanBoard />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="matrix" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <EisenhowerMatrix />
            </div>
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
