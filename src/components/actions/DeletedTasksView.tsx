
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import DeletedTaskCard from "./deleted/DeletedTaskCard";

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

interface DeletedTasksViewProps {
  tasks: Task[];
  onTaskRestore: (taskId: string) => void;
  onTaskPermanentDelete: (taskId: string) => void;
}

const DeletedTasksView: React.FC<DeletedTasksViewProps> = ({
  tasks,
  onTaskRestore,
  onTaskPermanentDelete
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon={Trash2}
        title="No Deleted Tasks"
        description="Deleted tasks will appear here. You can restore them or permanently delete them."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Deleted Tasks</h2>
          <p className="text-slate-400">
            {tasks.length} deleted task{tasks.length !== 1 ? 's' : ''} • Restore or permanently delete
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <span className="text-sm text-amber-300">Tasks auto-delete after 30 days</span>
        </div>
      </motion.div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <DeletedTaskCard
            key={task.id}
            task={task}
            index={index}
            onTaskRestore={onTaskRestore}
            onTaskPermanentDelete={onTaskPermanentDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default DeletedTasksView;
