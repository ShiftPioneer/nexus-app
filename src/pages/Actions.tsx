
import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { ModernTabs, ModernTabsList, ModernTabsTrigger, ModernTabsContent } from "@/components/ui/modern-tabs";
import { UnifiedPageHeader } from "@/components/ui/unified-page-header";
import { CheckSquare, X, Kanban, Grid3x3 } from "lucide-react";
import ModernTasksList from "@/components/actions/ModernTasksList";
import { useLocalStorage } from "@/hooks/use-local-storage";

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
}

const Actions = () => {
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);

  // Sample data for demonstration
  React.useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Task[] = [
        {
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
        },
        {
          id: '2',
          title: 'Check social media',
          description: 'Avoid mindless scrolling during work hours',
          completed: false,
          priority: 'medium',
          category: 'Habits',
          createdAt: new Date(),
          tags: ['distraction', 'habits'],
          type: 'not-todo'
        },
        {
          id: '3',
          title: 'Exercise for 30 minutes',
          description: 'Morning workout routine',
          completed: true,
          priority: 'high',
          category: 'Health',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          tags: ['health', 'routine'],
          type: 'todo'
        },
        {
          id: '4',
          title: 'Skip breakfast',
          description: 'Maintain healthy eating habits',
          completed: false,
          priority: 'medium',
          category: 'Health',
          createdAt: new Date(),
          tags: ['health', 'nutrition'],
          type: 'not-todo'
        }
      ];
      setTasks(sampleTasks);
    }
  }, []);

  const todoTasks = tasks.filter(task => task.type === 'todo');
  const notTodoTasks = tasks.filter(task => task.type === 'not-todo');

  const handleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTaskEdit = (task: Task) => {
    // TODO: Open edit dialog
    console.log('Edit task:', task);
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleAddTask = (type: 'todo' | 'not-todo') => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: type === 'todo' ? 'New Task' : 'New Avoidance Item',
      completed: false,
      priority: 'medium',
      category: 'General',
      createdAt: new Date(),
      type
    };
    setTasks([...tasks, newTask]);
  };

  const tabItems = [
    { 
      value: "todo", 
      label: "To Do", 
      icon: CheckSquare,
      gradient: "from-green-500 via-emerald-500 to-teal-500"
    },
    { 
      value: "not-todo", 
      label: "Not To Do", 
      icon: X,
      gradient: "from-red-500 via-pink-500 to-rose-500"
    },
    { 
      value: "kanban", 
      label: "Kanban", 
      icon: Kanban,
      gradient: "from-blue-500 via-indigo-500 to-purple-500"
    },
    { 
      value: "matrix", 
      label: "Matrix", 
      icon: Grid3x3,
      gradient: "from-orange-500 via-amber-500 to-yellow-500"
    }
  ];

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-8">
        <UnifiedPageHeader
          title="Actions"
          description="Manage your tasks and focus on what matters most"
          icon={CheckSquare}
          gradient="from-green-500 via-emerald-500 to-teal-500"
        />

        <ModernTabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <ModernTabsList className="grid w-full grid-cols-4 max-w-4xl mx-auto">
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
              <ModernTasksList
                tasks={todoTasks}
                onTaskComplete={handleTaskComplete}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onAddTask={() => handleAddTask('todo')}
                title="Tasks To Do"
                emptyMessage="No tasks yet. Add your first task to get started with productivity!"
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="not-todo" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <ModernTasksList
                tasks={notTodoTasks}
                onTaskComplete={handleTaskComplete}
                onTaskEdit={handleTaskEdit}
                onTaskDelete={handleTaskDelete}
                onAddTask={() => handleAddTask('not-todo')}
                title="Things to Avoid"
                emptyMessage="No avoidance items yet. Add habits or activities you want to avoid."
                showCompleted={false}
              />
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="kanban" className="mt-8">
            <div className="max-w-7xl mx-auto">
              <div className="glass rounded-2xl p-6 border border-slate-700/50 text-center">
                <Kanban className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Kanban View</h3>
                <p className="text-slate-400">Modern Kanban board coming soon...</p>
              </div>
            </div>
          </ModernTabsContent>
          
          <ModernTabsContent value="matrix" className="mt-8">
            <div className="max-w-6xl mx-auto">
              <div className="glass rounded-2xl p-6 border border-slate-700/50 text-center">
                <Grid3x3 className="h-16 w-16 text-slate-500 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-white mb-2">Eisenhower Matrix</h3>
                <p className="text-slate-400">Priority matrix view coming soon...</p>
              </div>
            </div>
          </ModernTabsContent>
        </ModernTabs>
      </div>
    </ModernAppLayout>
  );
};

export default Actions;
