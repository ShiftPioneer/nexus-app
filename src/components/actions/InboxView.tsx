import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Inbox, 
  ArrowRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Trash2,
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedTask } from "@/types/unified-tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const InboxView: React.FC = () => {
  const { 
    inboxTasks, 
    clarifyTask, 
    deleteTask, 
    moveToSomeday,
    updateTask 
  } = useUnifiedTasks();

  const handleClarify = (task: UnifiedTask, urgent: boolean, important: boolean) => {
    clarifyTask(task.id, urgent, important);
  };

  const getQuadrantInfo = (urgent: boolean, important: boolean) => {
    if (urgent && important) return { label: "Do First", color: "from-red-500 to-orange-500", description: "Urgent & Important" };
    if (!urgent && important) return { label: "Schedule", color: "from-blue-500 to-indigo-500", description: "Important, not urgent" };
    if (urgent && !important) return { label: "Delegate", color: "from-yellow-500 to-orange-400", description: "Urgent, not important" };
    return { label: "Consider", color: "from-slate-500 to-slate-600", description: "Low impact / optional" };
  };

  if (inboxTasks.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="Inbox Zero!"
        description="All caught up! Your inbox is empty. Use Quick Capture above to add new items."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Inbox className="h-5 w-5 text-white" />
            </div>
            Inbox
          </h2>
          <p className="text-slate-400 mt-1">
            {inboxTasks.length} item{inboxTasks.length !== 1 ? 's' : ''} to clarify
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {inboxTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700/50 hover:border-slate-600 transition-all">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{task.title}</h3>
                    {task.description && (
                      <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                        {task.type}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Captured {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
                      <DropdownMenuItem 
                        onClick={() => moveToSomeday(task.id)}
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Move to Someday
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Eisenhower Matrix Clarification */}
                <div className="mt-5 pt-4 border-t border-slate-700/50">
                  <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Clarify: Where does this belong?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { urgent: true, important: true },
                      { urgent: false, important: true },
                      { urgent: true, important: false },
                      { urgent: false, important: false },
                    ].map(({ urgent, important }) => {
                      const info = getQuadrantInfo(urgent, important);
                      return (
                        <button
                          key={`${urgent}-${important}`}
                          onClick={() => handleClarify(task, urgent, important)}
                          className={`p-3 rounded-xl bg-gradient-to-r ${info.color} bg-opacity-20 hover:bg-opacity-30 border border-white/10 transition-all text-left group hover:scale-[1.02]`}
                        >
                          <span className="font-medium text-white text-sm">{info.label}</span>
                          <p className="text-xs text-white/70 mt-0.5">{info.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InboxView;
