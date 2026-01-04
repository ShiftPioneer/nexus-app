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
  Plus,
  MoreHorizontal,
  Calendar,
  Clock,
  Trash2,
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

interface ActiveViewProps {
  onAddTask: () => void;
}

type ActiveFilter = "all" | "doFirst" | "schedule" | "delegate" | "consider";

const ActiveView: React.FC<ActiveViewProps> = ({ onAddTask }) => {
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ActiveFilter>("all");

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

  const matchesFilter = (task: UnifiedTask, activeFilter: ActiveFilter) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "doFirst") return !!task.urgent && !!task.important;
    if (activeFilter === "schedule") return !task.urgent && !!task.important;
    if (activeFilter === "delegate") return !!task.urgent && !task.important;
    return !task.urgent && !task.important;
  };

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeTasks.filter((t) => {
      const textMatch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.tags || []).some((tag) => tag.toLowerCase().includes(q));

      return textMatch && matchesFilter(t, filter);
    });
  }, [activeTasks, query, filter]);

  // Group tasks by Eisenhower quadrant (from filtered set)
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
        <Card className="bg-slate-900/80 border-slate-700/50 hover:border-slate-600 transition-all">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => completeTask(task.id)}
                className="mt-1 border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-medium ${
                      task.completed
                        ? "text-slate-500 line-through"
                        : "text-white"
                    }`}
                  >
                    {task.title}
                  </h3>

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
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-slate-900 border-slate-700"
                    >
                      <DropdownMenuItem
                        onClick={() => moveToWaitingFor(task.id, "")}
                        className="text-slate-300 hover:text-white hover:bg-slate-800"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Move to Waiting
                      </DropdownMenuItem>
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

                {task.description && (
                  <p className="text-sm text-slate-400 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="outline" className={priorityBadge.className}>
                    {priorityBadge.label}
                  </Badge>

                  {task.dueDate && (
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400"
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </Badge>
                  )}

                  {task.context && (
                    <Badge
                      variant="outline"
                      className="text-xs border-slate-600 text-slate-400"
                    >
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
      <div className="bg-slate-950/50 backdrop-blur-sm border border-t-0 border-slate-700/50 rounded-b-xl p-3 space-y-2 min-h-[200px]">
        <AnimatePresence>
          {tasks.map((task, i) => renderTaskCard(task, i))}
        </AnimatePresence>
      </div>
    </div>
  );

  const filterOptions: { key: ActiveFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: filteredTasks.length },
    { key: "doFirst", label: "Do First", count: doFirstTasks.length },
    { key: "schedule", label: "Schedule", count: scheduleTasks.length },
    { key: "delegate", label: "Delegate", count: delegateTasks.length },
    { key: "consider", label: "Consider", count: considerTasks.length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            Active Tasks
          </h2>
          <p className="text-slate-400 mt-1">
            {activeTasks.length} task{activeTasks.length !== 1 ? "s" : ""} to work on
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="w-full sm:w-[320px]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks (title, notes, tags)…"
              className="h-10 rounded-xl"
              aria-label="Search active tasks"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800/50 rounded-lg p-1 flex gap-1">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-8 px-3"
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setViewMode("kanban")}
                className="h-8 px-3"
                aria-label="Board view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={onAddTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterOptions.map((opt) => (
          <Button
            key={opt.key}
            variant={filter === opt.key ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setFilter(opt.key)}
            className="rounded-xl"
          >
            {opt.label}
            <span className="ml-2 text-xs text-muted-foreground">{opt.count}</span>
          </Button>
        ))}
      </div>

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
                setFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : viewMode === "list" ? (
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task, index) => renderTaskCard(task, index))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {renderKanbanColumn("Do First", doFirstTasks, "from-red-500 to-orange-500")}
          {renderKanbanColumn("Schedule", scheduleTasks, "from-blue-500 to-indigo-500")}
          {renderKanbanColumn("Delegate", delegateTasks, "from-yellow-500 to-orange-400")}
          {renderKanbanColumn("Consider", considerTasks, "from-slate-500 to-slate-600")}
        </div>
      )}
    </div>
  );
};

export default ActiveView;
