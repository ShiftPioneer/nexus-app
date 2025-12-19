
import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Calendar, Zap, AlertTriangle, Clock, CheckCircle, GripVertical } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  urgent?: boolean;
  important?: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: string;
  dueDate?: Date;
  createdAt: Date;
  tags?: string[];
  type: "todo" | "not-todo";
}

interface MatrixViewProps {
  tasks: Task[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onAddTask: () => void;
  title?: string;
  type?: "todo" | "not-todo";
}

const derivePriorityFromEisenhower = (urgent: boolean, important: boolean) => {
  if (urgent && important) return "urgent" as const;
  if (!urgent && important) return "high" as const;
  if (urgent && !important) return "medium" as const;
  return "low" as const;
};

const deriveEisenhowerFromLegacyPriority = (priority: Task["priority"]) => {
  if (priority === "urgent") return { urgent: true, important: true };
  if (priority === "high") return { urgent: false, important: true };
  if (priority === "medium") return { urgent: true, important: false };
  return { urgent: false, important: false };
};

const MatrixView: React.FC<MatrixViewProps> = ({
  tasks,
  onTaskComplete,
  onTaskEdit,
  onTaskDelete,
  onTaskUpdate,
  onAddTask,
  title = "Eisenhower Matrix",
  type = "todo",
}) => {
  const getEisenhower = (task: Task) => {
    if (typeof task.urgent === "boolean" && typeof task.important === "boolean") {
      return { urgent: task.urgent, important: task.important };
    }
    return deriveEisenhowerFromLegacyPriority(task.priority);
  };

  const getMatrixQuadrant = (task: Task) => {
    const { urgent, important } = getEisenhower(task);
    if (urgent && important) return "High-High";
    if (!urgent && important) return "Low-High";
    if (urgent && !important) return "High-Low";
    return "Low-Low";
  };

  const getTasksByQuadrant = (quadrant: string) => {
    return tasks.filter((task) => getMatrixQuadrant(task) === quadrant && !task.completed);
  };

  const quadrants = [
    {
      id: "High-High",
      title: type === "todo" ? "Do It Now" : "Eliminate Immediately",
      subtitle: "Urgent & Important",
      color: type === "todo" ? "from-red-500 to-red-600" : "from-red-600 to-red-700",
      icon: AlertTriangle,
      description:
        type === "todo"
          ? "Critical tasks requiring immediate attention"
          : "Harmful habits to stop immediately",
    },
    {
      id: "Low-High",
      title: type === "todo" ? "Schedule It" : "Avoid Strategically",
      subtitle: "Not Urgent & Important",
      color: type === "todo" ? "from-blue-500 to-blue-600" : "from-blue-600 to-blue-700",
      icon: Calendar,
      description:
        type === "todo" ? "Important tasks to plan and schedule" : "Avoid with a plan",
    },
    {
      id: "High-Low",
      title: type === "todo" ? "Delegate It" : "Minimize Quickly",
      subtitle: "Urgent & Not Important",
      color:
        type === "todo" ? "from-orange-500 to-orange-600" : "from-orange-600 to-orange-700",
      icon: Zap,
      description:
        type === "todo" ? "Urgent but less important tasks" : "Urgent distractions to minimize",
    },
    {
      id: "Low-Low",
      title: type === "todo" ? "Delete It" : "Ignore Completely",
      subtitle: "Not Urgent & Not Important",
      color: type === "todo" ? "from-gray-500 to-gray-600" : "from-gray-600 to-gray-700",
      icon: type === "todo" ? Clock : CheckCircle,
      description:
        type === "todo" ? "Low priority tasks to eliminate" : "Not worth attention",
    },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onTaskUpdate) return;

    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const [urgency, importance] = destination.droppableId.split("-");
    const urgent = urgency === "High";
    const important = importance === "High";

    onTaskUpdate(draggableId, {
      urgent,
      important,
      priority: derivePriorityFromEisenhower(urgent, important),
    });
  };

  const priorityBadgeClass = (priority: Task["priority"]) => {
    if (priority === "urgent") return "border-red-500 text-red-400";
    if (priority === "high") return "border-blue-500 text-blue-400";
    if (priority === "medium") return "border-orange-500 text-orange-400";
    return "border-slate-500 text-slate-300";
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-r ${
              type === "todo" ? "from-orange-500 to-amber-600" : "from-red-500 to-pink-600"
            } flex items-center justify-center shadow-lg`}
          >
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {type === "todo"
            ? "Drag tasks between quadrants to prioritize by urgency + importance."
            : "Drag items between quadrants to decide what to eliminate first."}
        </p>
      </motion.div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {quadrants.map((quadrant, index) => {
            const Icon = quadrant.icon;
            const quadrantTasks = getTasksByQuadrant(quadrant.id);

            return (
              <motion.div
                key={quadrant.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="bg-slate-950/80 backdrop-blur-sm border-slate-700/50 h-full">
                  <CardHeader className="pb-4">
                    <div className={`p-4 rounded-t-lg bg-gradient-to-r ${quadrant.color}`}>
                      <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6" />
                          <div>
                            <CardTitle className="text-lg font-semibold">{quadrant.title}</CardTitle>
                            <p className="text-sm opacity-90">{quadrant.subtitle}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {quadrantTasks.length}
                        </Badge>
                      </div>
                      <p className="text-sm mt-2 opacity-80">{quadrant.description}</p>
                    </div>
                  </CardHeader>

                  <Droppable droppableId={quadrant.id}>
                    {(provided, snapshot) => (
                      <CardContent
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-64 transition-colors ${
                          snapshot.isDraggingOver ? "bg-primary/5" : ""
                        }`}
                      >
                        {quadrantTasks.length === 0 ? (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                              <Icon className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="text-slate-400 text-sm mb-4">
                              No {type === "todo" ? "tasks" : "items"} in this quadrant
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={onAddTask}
                              className="border-slate-600 text-slate-300 hover:bg-slate-800"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add {type === "todo" ? "Task" : "Item"}
                            </Button>
                          </div>
                        ) : (
                          quadrantTasks.map((task, taskIndex) => {
                            const derived = getEisenhower(task);
                            const derivedPriority = derivePriorityFromEisenhower(
                              derived.urgent,
                              derived.important
                            );

                            return (
                              <Draggable key={task.id} draggableId={task.id} index={taskIndex}>
                                {(dragProvided, dragSnapshot) => (
                                  <motion.div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    className={`group p-4 rounded-lg bg-slate-950/90 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 ${
                                      dragSnapshot.isDragging ? "shadow-xl" : ""
                                    }`}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-start gap-2 flex-1 min-w-0">
                                        <div
                                          {...dragProvided.dragHandleProps}
                                          className="mt-0.5 text-slate-500 hover:text-slate-300"
                                          aria-label="Drag task"
                                        >
                                          <GripVertical className="h-4 w-4" />
                                        </div>
                                        <h4 className="font-medium text-white line-clamp-1 flex-1">
                                          {task.title}
                                        </h4>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => onTaskComplete(task.id)}
                                          className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                                          aria-label="Complete task"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => onTaskEdit(task)}
                                          className="h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                                          aria-label="Edit task"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>

                                    {task.description && (
                                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                                        {task.description}
                                      </p>
                                    )}

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          variant="outline"
                                          className={`text-xs capitalize ${priorityBadgeClass(
                                            derivedPriority
                                          )}`}
                                        >
                                          {derivedPriority}
                                        </Badge>
                                        <span className="text-xs text-slate-500">{task.category}</span>
                                      </div>

                                      {task.dueDate && (
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                          <Calendar className="h-3 w-3" />
                                          {new Date(task.dueDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>

                                    {task.tags && task.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {task.tags.slice(0, 3).map((tag) => (
                                          <Badge key={tag} variant="outline" className="text-xs py-0 px-1">
                                            {tag}
                                          </Badge>
                                        ))}
                                        {task.tags.length > 3 && (
                                          <Badge variant="outline" className="text-xs py-0 px-1">
                                            +{task.tags.length - 3}
                                          </Badge>
                                        )}
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </Draggable>
                            );
                          })
                        )}

                        {provided.placeholder}

                        {quadrantTasks.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed border-slate-600 hover:border-slate-500 text-slate-400 hover:text-slate-300 mt-3"
                            onClick={onAddTask}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add {type === "todo" ? "Task" : "Item"}
                          </Button>
                        )}
                      </CardContent>
                    )}
                  </Droppable>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </DragDropContext>
    </div>
  );
};

export default MatrixView;

