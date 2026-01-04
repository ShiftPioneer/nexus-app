import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  Sparkles, 
  MoreHorizontal, 
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Calendar,
  Search,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const SomedayView: React.FC = () => {
  const { 
    somedayTasks, 
    moveToActive, 
    deleteTask,
    completeTask
  } = useUnifiedTasks();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "todo" | "not-todo">("all");

  // Filter tasks
  const filteredTasks = somedayTasks.filter(task => {
    // Type filter
    if (typeFilter === "todo" && task.type !== "todo") return false;
    if (typeFilter === "not-todo" && task.type !== "not-todo") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(query);
      const matchesDescription = task.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    return true;
  });

  const todoCount = somedayTasks.filter(t => t.type === "todo").length;
  const notTodoCount = somedayTasks.filter(t => t.type === "not-todo").length;

  if (somedayTasks.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Someday/Maybe"
        description="Ideas and tasks for the future go here. Move items from Active or Inbox when you want to defer them."
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            Someday / Maybe
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredTasks.length} of {somedayTasks.length} ideas shown
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-xl">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span className="text-sm text-muted-foreground">
            Review weekly to find ideas worth activating
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ideas..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTypeFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              typeFilter === "all" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            All ({somedayTasks.length})
          </button>
          <button
            onClick={() => setTypeFilter("todo")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              typeFilter === "todo" 
                ? "bg-green-500 text-white" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setTypeFilter("not-todo")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              typeFilter === "not-todo" 
                ? "bg-red-500 text-white" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            Not To Do ({notTodoCount})
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={cn(
                "h-full transition-all hover:shadow-md hover:-translate-y-0.5",
                task.type === "not-todo" && "border-l-4 border-l-red-500"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      task.type === "todo" ? "bg-green-500/20" : "bg-red-500/20"
                    )}>
                      {task.type === "todo" 
                        ? <CheckCircle className="h-4 w-4 text-green-500" />
                        : <XCircle className="h-4 w-4 text-red-500" />
                      }
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => moveToActive(task.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Activate Now
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => completeTask(task.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteTask(task.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <h3 className="font-medium mb-1">{task.title}</h3>
                  
                  {task.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveToActive(task.id)}
                      className="h-7 text-xs gap-1"
                    >
                      <Play className="h-3 w-3" />
                      Activate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && somedayTasks.length > 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No ideas match your search.</p>
        </div>
      )}
    </div>
  );
};

export default SomedayView;
