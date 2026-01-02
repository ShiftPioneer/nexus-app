import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Sparkles, 
  ArrowRight,
  MoreHorizontal,
  Trash2,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { UnifiedTask } from "@/types/unified-tasks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SomedayView: React.FC = () => {
  const { 
    somedayTasks, 
    moveToActive, 
    deleteTask 
  } = useUnifiedTasks();

  if (somedayTasks.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No Someday Ideas"
        description="Future ideas and projects you're not ready to work on yet will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Someday / Maybe
          </h2>
          <p className="text-slate-400 mt-1">
            {somedayTasks.length} idea{somedayTasks.length !== 1 ? 's' : ''} for the future
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {somedayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <Card className="bg-slate-900/80 border-slate-700/50 hover:border-purple-500/30 transition-all h-full">
                <CardContent className="p-4 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-purple-400" />
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-slate-900 border-slate-700">
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
                  
                  <div className="mt-3 flex-1">
                    <h3 className="font-medium text-white">{task.title}</h3>
                    
                    {task.description && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Added {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveToActive(task.id)}
                      className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                    >
                      <ArrowRight className="h-4 w-4 mr-1" />
                      Start Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SomedayView;
