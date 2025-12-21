import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { navigationIcons } from "@/lib/navigation-icons";
import { CheckSquare, X, Kanban, Grid3x3, Trash2 } from "lucide-react";
import TaskCreationDialog from "@/components/actions/TaskCreationDialog";
import ActionsTabContent from "@/components/actions/ActionsTabContent";
import { ActionsProvider, useActions } from "@/components/actions/ActionsContext";
interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: 'todo' | 'not-todo';
  deleted?: boolean;
  deletedAt?: Date;
}
const ActionsContent = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [taskType, setTaskType] = useState<'todo' | 'not-todo'>('todo');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const {
    tasks,
    setTasks,
    handleCreateTask
  } = useActions();

  // Sample data initialization
  React.useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Task[] = [{
        id: '1',
        title: 'Complete project proposal',
        description: 'Finish the quarterly project proposal for the marketing team',
        completed: false,
        priority: 'high',
        category: 'Work',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        tags: ['urgent', 'work'],
        type: 'todo'
      }, {
        id: '2',
        title: 'Check social media',
        description: 'Avoid mindless scrolling during work hours',
        completed: false,
        priority: 'medium',
        category: 'Habits',
        createdAt: new Date(),
        tags: ['distraction', 'habits'],
        type: 'not-todo'
      }, {
        id: '3',
        title: 'Exercise for 30 minutes',
        description: 'Morning workout routine',
        completed: true,
        priority: 'high',
        category: 'Health',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        tags: ['health', 'routine'],
        type: 'todo'
      }];
      setTasks(sampleTasks);
    }
  }, [tasks.length, setTasks]);
  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setTaskType(task.type);
    setIsCreatingTask(true);
  };
  const handleAddTask = (type?: 'todo' | 'not-todo') => {
    const newTaskType = type || (activeTab === 'not-todo' ? 'not-todo' : 'todo');
    setTaskType(newTaskType);
    setEditingTask(null);
    setIsCreatingTask(true);
  };
  const handleCreateTaskWrapper = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? {
        ...task,
        ...taskData
      } : task));
    } else {
      handleCreateTask(taskData, taskType);
    }
    setIsCreatingTask(false);
    setEditingTask(null);
  };
  const tabItems = [{
    value: "todo",
    label: "To Do",
    icon: CheckSquare,
    gradient: "from-green-500 via-emerald-500 to-teal-500"
  }, {
    value: "not-todo",
    label: "Not To Do",
    icon: X,
    gradient: "from-red-500 via-pink-500 to-rose-500"
  }, {
    value: "kanban",
    label: "Kanban",
    icon: Kanban,
    gradient: "from-blue-500 via-indigo-500 to-purple-500"
  }, {
    value: "matrix",
    label: "Matrix",
    icon: Grid3x3,
    gradient: "from-orange-500 via-amber-500 to-yellow-500"
  }, {
    value: "deleted",
    label: "Deleted",
    icon: Trash2,
    gradient: "from-gray-500 via-slate-500 to-zinc-500"
  }];
  return <div className="page-container">
      <div className="page-content px-[20px]">
        <UnifiedPageHeader title="Actions" description="Manage your tasks and focus on what matters most" icon={navigationIcons.actions} gradient="from-green-500 via-emerald-500 to-teal-500" />

      <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full px-[20px]">
        <ModernTabsList className="grid w-full grid-cols-5 max-w-5xl mx-auto">
          {tabItems.map(tab => <ModernTabsTrigger key={tab.value} value={tab.value} gradient={tab.gradient} icon={tab.icon} className="flex-1">
              {tab.label}
            </ModernTabsTrigger>)}
        </ModernTabsList>
        
        <ActionsTabContent activeTab={activeTab} onTaskEdit={handleTaskEdit} onAddTask={handleAddTask} />
      </ModernTabs>

        <TaskCreationDialog open={isCreatingTask} onOpenChange={setIsCreatingTask} onCreateTask={handleCreateTaskWrapper} taskType={taskType} editingTask={editingTask} />
      </div>
    </div>;
};
const Actions = () => {
  return <ModernAppLayout>
      <ActionsProvider>
        <ActionsContent />
      </ActionsProvider>
    </ModernAppLayout>;
};
export default Actions;