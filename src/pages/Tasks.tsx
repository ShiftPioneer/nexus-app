
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, List, LayoutGrid, Filter, ArrowUpDown, CheckSquare, Clock, FileText, Calendar } from "lucide-react";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskDialog from "@/components/tasks/TaskDialog";
import { v4 as uuidv4 } from 'uuid';

// Define TaskPriority type
type TaskPriority = "Very Low" | "Low" | "Medium" | "High" | "Very High";

// Define TaskStatus type
type TaskStatus = "today" | "todo" | "in-progress" | "completed" | "deleted";

// Define Task interface
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  tags?: string[];
  project?: string;
  createdAt: Date;
  updatedAt?: Date;
  context?: string;
}

// Define EisenhowerMatrix quadrant type
type EisenhowerQuadrant = "urgent-important" | "not-urgent-important" | "urgent-not-important" | "not-urgent-not-important";

const Tasks = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [view, setView] = useState<"list" | "kanban">("list");
  const [activeTab, setActiveTab] = useState<"all" | "today" | "eisenhower">("all");
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all");
  const [sortOption, setSortOption] = useState<"priority" | "dueDate" | "title">("priority");
  const [eisenhowerMatrix, setEisenhowerMatrix] = useState<Record<EisenhowerQuadrant, Task[]>>({
    "urgent-important": [],
    "not-urgent-important": [],
    "urgent-not-important": [],
    "not-urgent-not-important": []
  });

  // Tasks state with some example data
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem("nexus-tasks");
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: "1",
        title: "Create project proposal",
        description: "Draft the initial proposal for client review",
        status: "todo",
        priority: "High",
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        tags: ["work", "client"],
        project: "Client XYZ",
        createdAt: new Date()
      },
      {
        id: "2",
        title: "Review team deliverables",
        description: "Check the current progress and provide feedback",
        status: "in-progress",
        priority: "Medium",
        dueDate: new Date(Date.now() + 86400000), // 1 day from now
        tags: ["work", "review"],
        project: "Team Management",
        createdAt: new Date()
      },
      {
        id: "3",
        title: "Schedule team meeting",
        status: "todo",
        priority: "Low",
        createdAt: new Date()
      },
      {
        id: "4",
        title: "Research new productivity tools",
        description: "Find better tools for project management",
        status: "today",
        priority: "Medium",
        tags: ["research", "productivity"],
        createdAt: new Date()
      }
    ];
  });

  // Check if there's a new task from GTD page
  useEffect(() => {
    if (location.state?.newTask) {
      const gtdTask = location.state.newTask;
      
      // Convert GTD task to Tasks page format
      const newTask: Task = {
        id: gtdTask.id || uuidv4(),
        title: gtdTask.title,
        description: gtdTask.description,
        status: gtdTask.status === "next-action" ? "todo" : 
               gtdTask.status === "today" ? "today" : "todo",
        priority: gtdTask.priority,
        dueDate: gtdTask.dueDate,
        tags: gtdTask.tags,
        project: gtdTask.project,
        createdAt: gtdTask.createdAt || new Date(),
        context: gtdTask.context
      };
      
      // Check if the task already exists
      const existingTaskIndex = tasks.findIndex(t => t.id === newTask.id);
      
      if (existingTaskIndex >= 0) {
        // Update existing task
        const updatedTasks = [...tasks];
        updatedTasks[existingTaskIndex] = {
          ...updatedTasks[existingTaskIndex],
          ...newTask,
          updatedAt: new Date()
        };
        setTasks(updatedTasks);
        
        toast({
          title: "Task Updated",
          description: "The task has been updated from GTD.",
        });
      } else {
        // Add new task
        setTasks([...tasks, newTask]);
        
        toast({
          title: "Task Added",
          description: "A new task has been added from GTD.",
        });
      }
      
      // Clear the location state to prevent duplicate additions
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

  // Save tasks to local storage when they change
  useEffect(() => {
    localStorage.setItem("nexus-tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Setup Eisenhower Matrix whenever tasks change
  useEffect(() => {
    const matrix: Record<EisenhowerQuadrant, Task[]> = {
      "urgent-important": [],
      "not-urgent-important": [],
      "urgent-not-important": [],
      "not-urgent-not-important": []
    };
    
    tasks.forEach(task => {
      // Fix type comparison error - we need to use specific types
      if (task.status !== "completed" && task.status !== "deleted") {
        // Fix priority comparison by checking against string literals
        const isUrgent = task.priority === "High" || task.priority === "Very High";
        const isImportant = task.priority === "High" || task.priority === "Very High" || task.priority === "Medium";
        
        if (isUrgent && isImportant) {
          matrix["urgent-important"].push(task);
        } else if (!isUrgent && isImportant) {
          matrix["not-urgent-important"].push(task);
        } else if (isUrgent && !isImportant) {
          matrix["urgent-not-important"].push(task);
        } else {
          matrix["not-urgent-not-important"].push(task);
        }
      }
    });
    
    setEisenhowerMatrix(matrix);
  }, [tasks]);

  const handleAddTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    
    toast({
      title: "Task Created",
      description: "Your new task has been created successfully."
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    ));
    
    toast({
      title: "Task Updated",
      description: "Your task has been updated successfully."
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: "deleted", updatedAt: new Date() } : task
    ));
    
    toast({
      title: "Task Deleted",
      description: "The task has been moved to trash."
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleMoveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus, updatedAt: new Date() } : task
    ));
  };

  const handleDragInEisenhower = (taskId: string, quadrant: EisenhowerQuadrant) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    let newPriority: TaskPriority = "Medium";
    
    switch (quadrant) {
      case "urgent-important":
        newPriority = "Very High";
        break;
      case "not-urgent-important":
        newPriority = "High";
        break;
      case "urgent-not-important":
        newPriority = "Medium";
        break;
      case "not-urgent-not-important":
        newPriority = "Low";
        break;
    }
    
    handleUpdateTask(taskId, { priority: newPriority });
    
    toast({
      title: "Task Priority Updated",
      description: `Task priority updated to ${newPriority}.`
    });
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status based on active tab
    if (activeTab === "today" && task.status !== "today") return false;
    if (task.status === "deleted") return false;
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by priority
    if (filterPriority !== "all" && task.priority !== filterPriority) {
      return false;
    }
    
    return true;
  });
  
  // Sort filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "priority") {
      const priorityValues: Record<TaskPriority, number> = { 
        "Very High": 4, 
        "High": 3, 
        "Medium": 2, 
        "Low": 1, 
        "Very Low": 0 
      };
      return priorityValues[b.priority] - priorityValues[a.priority];
    } else if (sortOption === "dueDate") {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      return a.title.localeCompare(b.title);
    }
  });

  // Group tasks by status for Kanban view
  const groupedTasks = {
    today: sortedTasks.filter(task => task.status === "today"),
    todo: sortedTasks.filter(task => task.status === "todo"),
    "in-progress": sortedTasks.filter(task => task.status === "in-progress"),
    completed: sortedTasks.filter(task => task.status === "completed")
  };

  // Priority color mapping
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "Very High": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-blue-500";
      case "Low": return "bg-green-500";
      case "Very Low": return "bg-gray-400";
    }
  };

  // Setup drag handlers for Eisenhower matrix
  useEffect(() => {
    const setupDropzone = (id: string, quadrant: EisenhowerQuadrant) => {
      const element = document.getElementById(id);
      if (!element) return;
      
      const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
      };
      
      const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        const taskId = e.dataTransfer?.getData('taskId');
        if (taskId) {
          handleDragInEisenhower(taskId, quadrant);
        }
      };
      
      element.addEventListener('dragover', handleDragOver);
      element.addEventListener('drop', handleDrop);
      
      return () => {
        element.removeEventListener('dragover', handleDragOver);
        element.removeEventListener('drop', handleDrop);
      };
    };
    
    if (activeTab === "eisenhower") {
      const cleanups = [
        setupDropzone('urgent-important-dropzone', 'urgent-important'),
        setupDropzone('not-urgent-important-dropzone', 'not-urgent-important'),
        setupDropzone('urgent-not-important-dropzone', 'urgent-not-important'),
        setupDropzone('not-urgent-not-important-dropzone', 'not-urgent-not-important')
      ];
      
      return () => {
        cleanups.forEach(cleanup => cleanup && cleanup());
      };
    }
  }, [activeTab]);

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-muted-foreground">Manage and organize your tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsTaskDialogOpen(true)} className="gap-2">
              <Plus size={18} />
              Add Task
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab as any}>
                    <TabsList>
                      <TabsTrigger value="all">All Tasks</TabsTrigger>
                      <TabsTrigger value="today">Today</TabsTrigger>
                      <TabsTrigger value="eisenhower">Eisenhower Matrix</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={view === "list" ? "default" : "outline"} 
                      size="icon"
                      onClick={() => setView("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={view === "kanban" ? "default" : "outline"} 
                      size="icon"
                      onClick={() => setView("kanban")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {activeTab !== "eisenhower" && (
                <CardContent>
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <Input 
                        placeholder="Search tasks..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Select value={filterPriority} onValueChange={setFilterPriority as any}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            <span>Priority</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="Very Low">Very Low</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Very High">Very High</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortOption} onValueChange={setSortOption as any}>
                        <SelectTrigger>
                          <div className="flex items-center">
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            <span>Sort</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="dueDate">Due Date</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {view === "list" ? (
                    <div className="space-y-2">
                      {sortedTasks.length === 0 ? (
                        <div className="text-center py-10">
                          <FileText className="mx-auto h-10 w-10 text-muted-foreground/60" />
                          <h3 className="mt-2 font-medium">No tasks found</h3>
                          <p className="text-sm text-muted-foreground">
                            Add a new task or adjust your filters
                          </p>
                        </div>
                      ) : (
                        sortedTasks.map(task => (
                          <div 
                            key={task.id} 
                            className="p-4 border rounded-lg hover:bg-accent/10 cursor-pointer transition-colors"
                            onClick={() => handleEditTask(task)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                <h3 className="font-medium">{task.title}</h3>
                              </div>
                              <div className="flex items-center gap-2">
                                {task.status === "today" && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Today</span>
                                )}
                                {task.status === "in-progress" && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">In Progress</span>
                                )}
                                {task.status === "completed" && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Completed</span>
                                )}
                                {task.dueDate && (
                                  <div className="flex items-center text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            {task.description && (
                              <p className="mt-1 text-sm text-muted-foreground truncate">{task.description}</p>
                            )}
                            {task.tags && task.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {task.tags.map(tag => (
                                  <span 
                                    key={tag} 
                                    className="px-2 py-0.5 bg-accent/50 text-accent-foreground text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    <div className="mt-4">
                      <KanbanBoard 
                        columns={groupedTasks}
                        onTaskClick={handleEditTask}
                        onTaskMove={handleMoveTask}
                        getPriorityColor={getPriorityColor}
                      />
                    </div>
                  )}
                </CardContent>
              )}
              
              {activeTab === "eisenhower" && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-red-500/30 bg-red-500/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-red-500" />
                        <span>Urgent & Important</span>
                      </h3>
                      <div className="space-y-2 min-h-[200px]" id="urgent-important-dropzone">
                        {eisenhowerMatrix["urgent-important"].map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => handleEditTask(task)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{task.title}</span>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border border-amber-500/30 bg-amber-500/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Important, Not Urgent</span>
                      </h3>
                      <div className="space-y-2 min-h-[200px]" id="not-urgent-important-dropzone">
                        {eisenhowerMatrix["not-urgent-important"].map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => handleEditTask(task)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{task.title}</span>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border border-blue-500/30 bg-blue-500/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <List className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Urgent, Not Important</span>
                      </h3>
                      <div className="space-y-2 min-h-[200px]" id="urgent-not-important-dropzone">
                        {eisenhowerMatrix["urgent-not-important"].map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => handleEditTask(task)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{task.title}</span>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border border-green-500/30 bg-green-500/10 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <CheckSquare className="h-4 w-4 mr-2 text-green-500" />
                        <span>Not Urgent, Not Important</span>
                      </h3>
                      <div className="space-y-2 min-h-[200px]" id="not-urgent-not-important-dropzone">
                        {eisenhowerMatrix["not-urgent-not-important"].map(task => (
                          <div 
                            key={task.id} 
                            className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                            onClick={() => handleEditTask(task)}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData('taskId', task.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{task.title}</span>
                              <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-center text-muted-foreground">
                    <p>Drag and drop tasks between quadrants to reprioritize them.</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === "today").length}</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Todo</p>
                      <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === "todo").length}</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === "in-progress").length}</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold mt-1">{tasks.filter(t => t.status === "completed").length}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Priority Breakdown</h4>
                    <div className="space-y-2">
                      {[
                        { priority: "Very High" as const, label: "Very High" },
                        { priority: "High" as const, label: "High" },
                        { priority: "Medium" as const, label: "Medium" },
                        { priority: "Low" as const, label: "Low" },
                        { priority: "Very Low" as const, label: "Very Low" }
                      ].map(({ priority, label }) => {
                        const count = tasks.filter(t => t.priority === priority && t.status !== "deleted").length;
                        const percentage = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
                        
                        return (
                          <div key={priority} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{label}</span>
                              <span>{count} tasks ({percentage}%)</span>
                            </div>
                            <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getPriorityColor(priority)}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Recently Completed</h4>
                    <div className="space-y-2">
                      {tasks
                        .filter(t => t.status === "completed")
                        .sort((a, b) => ((b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0)))
                        .slice(0, 3)
                        .map(task => (
                          <div 
                            key={task.id} 
                            className="flex justify-between items-center p-2 border rounded bg-accent/10"
                            onClick={() => handleEditTask(task)}
                          >
                            <span className="text-sm truncate">{task.title}</span>
                            <div className={`h-2 w-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                          </div>
                        ))}
                      
                      {tasks.filter(t => t.status === "completed").length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No completed tasks yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </AppLayout>
  );
};

export default Tasks;
