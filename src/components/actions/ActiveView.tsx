import React, { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  CheckSquare,
  LayoutGrid,
  List,
  Grid3X3,
  Plus,
  MoreHorizontal,
  Calendar,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
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
import { cn } from "@/lib/utils";
import EisenhowerMatrixView from "./EisenhowerMatrixView";

interface ActiveViewProps {
  onAddTask: () => void;
}

type ViewMode = "list" | "kanban" | "matrix";
type TaskTypeFilter = "all" | "todo" | "not-todo";
type QuadrantFilter = "all" | "doFirst" | "schedule" | "delegate" | "consider";

const ActiveView: React.FC<ActiveViewProps> = ({ onAddTask }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [taskTypeFilter, setTaskTypeFilter] = useState<TaskTypeFilter>("all");
  const [quadrantFilter, setQuadrantFilter] = useState<QuadrantFilter>("all");

  const {
    activeTasks,
    completeTask,
    deleteTask,
    moveToWaitingFor,
    moveToSomeday,
  } = useUnifiedTasks();

  const getPriorityBadge = (urgent?: boolean, important?: boolean) => {
    if (urgent && important)
      return {
        label: "Do First",
        className: "bg-red-500/20 text-red-400 border-red-500/30",
      };
    if (!urgent && important)
      return {
        label: "Schedule",
        className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      };
    if (urgent && !important)
      return {
        label: "Delegate",
        className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      };
    return {
      label: "Consider",
      className: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    };
  };

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeTasks.filter((t) => {
      // Task type filter
      if (taskTypeFilter === "todo" && t.type !== "todo") return false;
      if (taskTypeFilter === "not-todo" && t.type !== "not-todo") return false;

      // Quadrant filter
      if (quadrantFilter !== "all") {
        const isDoFirst = !!t.urgent && !!t.important;
        const isSchedule = !t.urgent && !!t.important;
        const isDelegate = !!t.urgent && !t.important;
        const isConsider = !t.urgent && !t.important;

        if (quadrantFilter === "doFirst" && !isDoFirst) return false;
        if (quadrantFilter === "schedule" && !isSchedule) return false;
        if (quadrantFilter === "delegate" && !isDelegate) return false;
        if (quadrantFilter === "consider" && !isConsider) return false;
      }

      // Text search
      const textMatch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q));

      return textMatch;
    });
  }, [activeTasks, query, taskTypeFilter, quadrantFilter]);

  // Counts
  const todoCount = activeTasks.filter((t) => t.type === "todo").length;
  const notTodoCount = activeTasks.filter((t) => t.type === "not-todo").length;

  // Group tasks by Eisenhower quadrant
  const doFirstTasks = filteredTasks.filter((t) => t.urgent && t.important);
  const scheduleTasks = filteredTasks.filter((t) => !t.urgent && t.important);
  const delegateTasks = filteredTasks.filter((t) => t.urgent && !t.important);
  const considerTasks = filteredTasks.filter((t) => !t.urgent && !t.important);

  if (activeTasks.length === 0) {
    return (
      <EmptyState
        icon={CheckSquare}
        title="No Active Tasks"
        description="Capture ideas in the Inbox, clarify them, and they'll appear here ready to work on."
        action={
          <Button onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        }
      />
    );
  }

  const renderTaskCard = (task: UnifiedTask, index: number) => {
    const priorityBadge = getPriorityBadge(task.urgent, task.important);

    return (
      <motion.div
        key={task.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.03 }}
        className="group"
      >
        <Card className={cn(
          "transition-all hover:shadow-md",
          task.type === "not-todo" && "border-l-4 border-l-red-500"
        )}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => completeTask(task.id)}
                className={cn(
                  "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                  task.type === "todo" 
                    ? "border-green-500 hover:bg-green-500/20"
                    : "border-red-500 hover:bg-red-500/20"
                )}
              >
                {task.completed && (
                  task.type === "todo" 
                    ? <CheckCircle className="h-4 w-4 text-green-500" />
                    : <XCircle className="h-4 w-4 text-red-500" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={cn(
                        "font-medium",
                        task.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </h3>
                    {task.type === "not-todo" && (
                      <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/30">
                        <XCircle className="h-3 w-3 mr-1" />
                        Avoid
                      </Badge>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => moveToWaitingFor(task.id, "")}>
                        <Clock className="h-4 w-4 mr-2" />
                        Move to Waiting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => moveToSomeday(task.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Move to Someday
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

                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className={priorityBadge.className}>
                    {priorityBadge.label}
                  </Badge>

                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Badge>
                  )}

                  {task.context && (
                    <Badge variant="outline" className="text-xs">
                      {task.context}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderKanbanColumn = (
    title: string,
    tasks: UnifiedTask[],
    gradient: string
  ) => (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className={`p-3 rounded-t-xl bg-gradient-to-r ${gradient}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">{title}</h3>
          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <div className="bg-muted/30 backdrop-blur-sm border border-t-0 rounded-b-xl p-3 space-y-2 min-h-[200px]">
        <AnimatePresence>
          {tasks.map((task, i) => (
            <Card 
              key={task.id} 
              className={cn(
                "cursor-pointer hover:shadow-md transition-all",
                task.type === "not-todo" && "border-l-4 border-l-red-500"
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      {task.type === "todo" 
                        ? <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                        : <XCircle className="h-3.5 w-3.5 text-red-500" />
                      }
                      <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
                    </div>
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => completeTask(task.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => moveToWaitingFor(task.id, "")}>
                        <Clock className="h-4 w-4 mr-2" />
                        Move to Waiting
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => moveToSomeday(task.id)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Move to Someday
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
              </CardContent>
            </Card>
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-[100px] text-muted-foreground text-sm border-2 border-dashed rounded-xl">
            No tasks
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with View Toggles */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            Active Tasks
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredTasks.length} of {activeTasks.length} tasks shown
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-lg"
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={viewMode === "kanban" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("kanban")}
              className="rounded-lg"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Kanban
            </Button>
            <Button
              variant={viewMode === "matrix" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("matrix")}
              className="rounded-lg"
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Matrix
            </Button>
          </div>

          <Button onClick={onAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Task Type Filter */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTaskTypeFilter("all")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              taskTypeFilter === "all" 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            All ({activeTasks.length})
          </button>
          <button
            onClick={() => setTaskTypeFilter("todo")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              taskTypeFilter === "todo" 
                ? "bg-green-500 text-white" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <CheckCircle className="h-3.5 w-3.5" />
            To Do ({todoCount})
          </button>
          <button
            onClick={() => setTaskTypeFilter("not-todo")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              taskTypeFilter === "not-todo" 
                ? "bg-red-500 text-white" 
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            Not To Do ({notTodoCount})
          </button>
        </div>
      </div>

      {/* Quadrant Quick Filters (only for list/kanban) */}
      {viewMode !== "matrix" && (
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All Priorities" },
            { key: "doFirst", label: "Do First", color: "bg-red-500/20 text-red-400" },
            { key: "schedule", label: "Schedule", color: "bg-blue-500/20 text-blue-400" },
            { key: "delegate", label: "Delegate", color: "bg-yellow-500/20 text-yellow-400" },
            { key: "consider", label: "Consider", color: "bg-slate-500/20 text-slate-400" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setQuadrantFilter(key as QuadrantFilter)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all border",
                quadrantFilter === key 
                  ? color || "bg-primary text-primary-foreground"
                  : "bg-transparent border-border text-muted-foreground hover:border-foreground/50"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content Views */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No matches"
          description="Try a different search or filter."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setTaskTypeFilter("all");
                setQuadrantFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : viewMode === "matrix" ? (
        <EisenhowerMatrixView 
          tasks={filteredTasks} 
          taskTypeFilter={taskTypeFilter}
          onComplete={completeTask}
          onDelete={deleteTask}
        />
      ) : viewMode === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {renderKanbanColumn("Do First", doFirstTasks, "from-red-500 to-orange-500")}
          {renderKanbanColumn("Schedule", scheduleTasks, "from-blue-500 to-indigo-500")}
          {renderKanbanColumn("Delegate", delegateTasks, "from-yellow-500 to-orange-400")}
          {renderKanbanColumn("Consider", considerTasks, "from-slate-500 to-slate-600")}
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => renderTaskCard(task, index))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ActiveView;
