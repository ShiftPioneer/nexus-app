
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
            <TasksTabView onShowDeletedTasks={() => setShowDeletedTasks(true)} />
          </ModernTabsContent>
          
          <ModernTabsContent value="not-todo">
            <NotToDoMatrix />
          </ModernTabsContent>
          
          <ModernTabsContent value="matrix">
            <EisenhowerMatrix />
          </ModernTabsContent>
        </ModernTabs>

        <DeletedTasksDialog 
          open={showDeletedTasks} 
          onOpenChange={setShowDeletedTasks} 
        />
      </div>
    </ModernAppLayout>
  );
};

export default Actions;
