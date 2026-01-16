import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import { Inbox, CheckSquare, Clock, Sparkles } from "lucide-react";
import QuickCaptureBar from "@/components/actions/QuickCaptureBar";
import InboxView from "@/components/actions/InboxView";
import ActiveView from "@/components/actions/ActiveView";
import WaitingView from "@/components/actions/WaitingView";
import SomedayView from "@/components/actions/SomedayView";
import TaskCreationDialog from "@/components/actions/TaskCreationDialog";
import { UnifiedTasksProvider, useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedTask } from "@/types/unified-tasks";

const ActionsContent = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  
  const { 
    inboxTasks, 
    activeTasks, 
    waitingForTasks, 
    somedayTasks,
    addTask 
  } = useUnifiedTasks();

  const handleAddTask = () => {
    setIsCreatingTask(true);
  };

const handleCreateTask = (taskData: Partial<UnifiedTask>) => {
    // Derive priority from Eisenhower values
    const urgent = taskData.urgent ?? false;
    const important = taskData.important ?? true;
    const priority = urgent && important ? "urgent" : 
                     !urgent && important ? "high" : 
                     urgent && !important ? "medium" : "low";
    
    addTask({
      title: taskData.title || "",
      description: taskData.description,
      type: taskData.type || "todo",
      status: "active",
      priority,
      category: taskData.category || "general",
      urgent,
      important,
      clarified: true,
      dueDate: taskData.dueDate,
      tags: taskData.tags,
      completed: false,
    });
    setIsCreatingTask(false);
  };

  const tabItems = [
    {
      value: "inbox",
      label: "Inbox",
      count: inboxTasks.length,
      icon: Inbox,
      gradient: "from-amber-500 via-orange-500 to-red-500"
    },
    {
      value: "active",
      label: "Active",
      count: activeTasks.length,
      icon: CheckSquare,
      gradient: "from-green-500 via-emerald-500 to-teal-500"
    },
    {
      value: "waiting",
      label: "Waiting",
      count: waitingForTasks.length,
      icon: Clock,
      gradient: "from-yellow-500 via-orange-400 to-amber-500"
    },
    {
      value: "someday",
      label: "Someday",
      count: somedayTasks.length,
      icon: Sparkles,
      gradient: "from-purple-500 via-pink-500 to-rose-500"
    }
  ];

  return (
    <div className="page-container">
      <div className="page-content">
        <UnifiedPageHeader 
          title="Actions" 
          description="Capture, clarify, and get things done with the GTD workflow" 
          icon={navigationIcons.actions} 
          gradient="from-green-500 via-emerald-500 to-teal-500" 
        />

        <QuickCaptureBar />

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
            {tabItems.map(tab => (
              <ModernTabsTrigger 
                key={tab.value} 
                value={tab.value} 
                gradient={tab.gradient} 
                icon={tab.icon}
                count={tab.count}
                className="flex-1"
              >
                {tab.label}
              </ModernTabsTrigger>
            ))}
          </ModernTabsList>
          
          <ModernTabsContent value="inbox" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <InboxView />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="active" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <ActiveView onAddTask={handleAddTask} />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="waiting" className="mt-8">
            <div className="max-w-4xl mx-auto">
              <WaitingView />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="someday" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <SomedayView />
            </div>
          </ModernTabsContent>
        </ModernTabs>

        <TaskCreationDialog 
          open={isCreatingTask} 
          onOpenChange={setIsCreatingTask} 
          onCreateTask={handleCreateTask} 
          taskType="todo"
        />
      </div>
    </div>
  );
};

const Actions = () => {
  return (
    <ModernAppLayout>
      <UnifiedTasksProvider>
        <ActionsContent />
      </UnifiedTasksProvider>
    </ModernAppLayout>
  );
};

export default Actions;
