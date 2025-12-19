
import React from 'react';
import { ModernTabsContent } from "@/components/ui/modern-tabs";
import ModernTasksList from "./ModernTasksList";
import KanbanView from "./KanbanView";
import MatrixView from "./MatrixView";
import DeletedTasksView from "./DeletedTasksView";
import { useActions } from "./ActionsContext";

interface ActionsTabContentProps {
  activeTab: string;
  onTaskEdit: (task: any) => void;
  onAddTask: (type?: 'todo' | 'not-todo') => void;
}

const ActionsTabContent: React.FC<ActionsTabContentProps> = ({
  activeTab,
  onTaskEdit,
  onAddTask
}) => {
  const {
    todoTasks,
    notTodoTasks,
    activeTasks,
    deletedTasks,
    handleTaskComplete,
    handleTaskDelete,
    handleTaskRestore,
    handleTaskPermanentDelete,
    updateTask,
  } = useActions();

  return (
    <>
      <ModernTabsContent value="todo" className="mt-8">
        <div className="max-w-6xl mx-auto">
          <ModernTasksList
            tasks={todoTasks}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={onTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddTask={() => onAddTask('todo')}
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
            onTaskEdit={onTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddTask={() => onAddTask('not-todo')}
            title="Things to Avoid"
            emptyMessage="No avoidance items yet. Add habits or activities you want to avoid."
            showCompleted={false}
          />
        </div>
      </ModernTabsContent>
      
      <ModernTabsContent value="kanban" className="mt-8">
        <div className="max-w-full mx-auto">
          <KanbanView
            tasks={activeTasks}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={onTaskEdit}
            onTaskDelete={handleTaskDelete}
            onAddTask={() => onAddTask()}
          />
        </div>
      </ModernTabsContent>
      
      <ModernTabsContent value="matrix" className="mt-8">
        <div className="max-w-full mx-auto space-y-8">
          <MatrixView
            tasks={todoTasks}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={onTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={updateTask}
            onAddTask={() => onAddTask('todo')}
            title="To-Do Matrix"
            type="todo"
          />
          <MatrixView
            tasks={notTodoTasks}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={onTaskEdit}
            onTaskDelete={handleTaskDelete}
            onTaskUpdate={updateTask}
            onAddTask={() => onAddTask('not-todo')}
            title="Not-To-Do Matrix"
            type="not-todo"
          />
        </div>
      </ModernTabsContent>

      <ModernTabsContent value="deleted" className="mt-8">
        <div className="max-w-6xl mx-auto">
          <DeletedTasksView
            tasks={deletedTasks}
            onTaskRestore={handleTaskRestore}
            onTaskPermanentDelete={handleTaskPermanentDelete}
          />
        </div>
      </ModernTabsContent>
    </>
  );
};

export default ActionsTabContent;
