
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListTodo, Plus, Clock, Search, Sliders, CalendarIcon, Star, Tag, ChevronRight, Filter, LayoutGrid, List, Grid2X2, Mic, MicOff, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskDialog from "@/components/tasks/TaskDialog";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useGTD } from "@/components/gtd/GTDContext";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'very high' | 'high' | 'medium' | 'low' | 'very low';
  category: string;
  dueDate?: Date;
  importance: number;
  relatedGoals?: string[];
  relatedProjects?: string[];
  status: 'today' | 'todo' | 'in-progress' | 'completed' | 'overdue' | 'deleted';
  createdAt: Date;
}

const CATEGORIES = ["All Categories", "Work", "Personal", "Finance", "Health", "Career", "Education", "Family", "Home"];
const PRIORITIES = ["All Priorities", "Very High", "High", "Medium", "Low", "Very Low"];

const Tasks = () => {
  const { toast } = useToast();
  const { tasks: gtdTasks, addTask: addGTDTask, updateTask: updateGTDTask, moveTask } = useGTD();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "board" | "matrix">("list");
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedPriority, setSelectedPriority] = useState("All Priorities");
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("Medium");
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<any>(null);
  
  // Initialize with sample tasks and sync with GTD tasks
  const [taskList, setTaskList] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Project Proposal",
      description: "Outline the main points and deliverables",
      priority: "high",
      category: "Work",
      dueDate: new Date(),
      importance: 80,
      status: "todo",
      createdAt: new Date()
    },
    {
      id: "2",
      title: "Schedule Team Meeting",
      description: "Coordinate with team members about availability",
      priority: "medium",
      category: "Work",
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      importance: 55,
      status: "todo",
      createdAt: new Date()
    },
    {
      id: "3",
      title: "Review Monthly Budget",
      description: "Analyze expenses and revenue for the month",
      priority: "medium",
      category: "Finance",
      dueDate: new Date(Date.now() + 3 * 86400000), // 3 days from now
      importance: 30,
      status: "todo",
      createdAt: new Date()
    },
    {
      id: "4",
      title: "Update LinkedIn Profile",
      description: "Add recent achievements and update skills",
      priority: "low",
      category: "Career",
      status: "completed",
      importance: 15,
      createdAt: new Date(Date.now() - 86400000) // yesterday
    },
    {
      id: "5",
      title: "Book Dentist Appointment",
      description: "Schedule regular checkup",
      priority: "medium",
      category: "Health",
      dueDate: new Date(Date.now() + 7 * 86400000), // a week from now
      importance: 25,
      status: "todo",
      createdAt: new Date()
    }
  ]);

  // Sync GTD tasks with Tasks page
  useEffect(() => {
    // Convert GTD tasks to Tasks format
    const nextActionTasks = gtdTasks
      .filter(gtdTask => gtdTask.status === "next-action" || gtdTask.status === "deleted")
      .map(gtdTask => {
        // Check if the task already exists in taskList
        const existingTask = taskList.find(task => task.id === gtdTask.id);
        if (existingTask) return existingTask;

        // Map GTD priority to Tasks priority format
        const priorityMap: Record<string, 'very high' | 'high' | 'medium' | 'low' | 'very low'> = {
          "Very High": "very high",
          "High": "high",
          "Medium": "medium",
          "Low": "low",
          "Very Low": "very low"
        };

        // Map GTD status to Tasks status
        let taskStatus: Task['status'] = "todo";
        if (gtdTask.status === "deleted") {
          taskStatus = "deleted";
        } else if (gtdTask.tags?.includes("today")) {
          taskStatus = "today";
        } else if (gtdTask.tags?.includes("completed")) {
          taskStatus = "completed";
        }

        return {
          id: gtdTask.id,
          title: gtdTask.title,
          description: gtdTask.description,
          priority: priorityMap[gtdTask.priority] || "medium",
          category: gtdTask.context || "Personal",
          dueDate: gtdTask.dueDate,
          importance: gtdTask.priority === "Very High" ? 90 : 
                     gtdTask.priority === "High" ? 70 : 
                     gtdTask.priority === "Medium" ? 50 : 
                     gtdTask.priority === "Low" ? 30 : 10,
          status: taskStatus,
          createdAt: gtdTask.createdAt
        };
      });

    // Merge new GTD tasks with existing taskList (avoiding duplicates)
    const newTaskList = [...taskList];
    nextActionTasks.forEach(newTask => {
      const index = newTaskList.findIndex(task => task.id === newTask.id);
      if (index >= 0) {
        newTaskList[index] = newTask;
      } else {
        newTaskList.push(newTask);
      }
    });

    setTaskList(newTaskList);
  }, [gtdTasks]);

  // Initialize speech recognition
  const startRecording = () => {
    try {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        toast({
          title: "Speech recognition not supported",
          description: "Your browser doesn't support speech recognition.",
          variant: "destructive"
        });
        return;
      }
      
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setTitle(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast({
          title: "Recording error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak now to capture your task"
      });
    } catch (error) {
      console.error('Speech recognition error:', error);
      toast({
        title: "Recording error",
        description: "Could not start recording. Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Voice input captured"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      toast({
        title: "File attached",
        description: `${file.name} has been attached to this task.`
      });
    }
  };
  
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCreateTask = (task: Task) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date()
    };
    setTaskList([newTask, ...taskList]);
    
    // Sync with GTD if it's not coming from there
    addGTDTask({
      title: task.title,
      description: task.description,
      priority: task.priority === "very high" ? "Very High" : 
               task.priority === "high" ? "High" : 
               task.priority === "medium" ? "Medium" :
               task.priority === "low" ? "Low" : "Very Low",
      status: "next-action",
      tags: task.status === "today" ? ["today"] : undefined,
      context: task.category
    });
    
    toast({
      title: "Task Created",
      description: "Your task has been created successfully!"
    });
    setShowTaskDialog(false);
  };

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    // Create a task in both systems
    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: title.trim(),
      description: description.trim(),
      priority: priority.toLowerCase() as any,
      category: "Personal",
      importance: priority === "Very High" ? 90 : 
                 priority === "High" ? 70 : 
                 priority === "Medium" ? 50 : 
                 priority === "Low" ? 30 : 10,
      status: "todo",
      createdAt: new Date()
    };
    
    setTaskList([newTask, ...taskList]);
    
    // Sync with GTD
    addGTDTask({
      title: title.trim(),
      description: description.trim(),
      priority: priority as any,
      status: "next-action",
      attachment: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        file: selectedFile
      } : undefined
    });
    
    // Clear form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setSelectedFile(null);
    
    toast({
      title: "Task added",
      description: "Task has been added successfully!"
    });
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: Task['status'], newPriority?: Task['priority']) => {
    setTaskList(taskList.map(task => {
      if (task.id === taskId) {
        const updatedTask = {
          ...task,
          status: newStatus,
          priority: newPriority || task.priority
        };
        return updatedTask;
      }
      return task;
    }));

    // Sync with GTD context
    const gtdTask = gtdTasks.find(task => task.id === taskId);
    if (gtdTask) {
      let gtdStatus: any = gtdTask.status;
      
      if (newStatus === "deleted") {
        gtdStatus = "deleted";
      } else if (newStatus === "completed") {
        gtdStatus = "completed";
      } else if (newStatus === "today") {
        gtdStatus = "next-action";
        updateGTDTask(taskId, { tags: ["today"] });
      }
      
      moveTask(taskId, gtdStatus, newPriority ? 
        (newPriority === "very high" ? "Very High" : 
         newPriority === "high" ? "High" : 
         newPriority === "medium" ? "Medium" :
         newPriority === "low" ? "Low" : "Very Low") : undefined);
    }
    
    toast({
      description: `Task status updated to ${newStatus.replace('-', ' ')}`
    });
  };

  const handlePermanentDelete = (taskId: string) => {
    setTaskList(taskList.filter(task => task.id !== taskId));
    
    // Remove from GTD context if it exists there
    const gtdTask = gtdTasks.find(task => task.id === taskId);
    if (gtdTask) {
      moveTask(taskId, "deleted");
    }
    
    toast({
      description: "Task permanently deleted"
    });
  };

  const handleRestore = (taskId: string) => {
    setTaskList(taskList.map(task => task.id === taskId ? {
      ...task,
      status: "todo"
    } : task));
    
    // Restore in GTD context if it exists there
    const gtdTask = gtdTasks.find(task => task.id === taskId);
    if (gtdTask && gtdTask.status === "deleted") {
      moveTask(taskId, "next-action");
    }
    
    toast({
      description: "Task restored"
    });
  };

  const handleMatrixDrop = (taskId: string, quadrant: string) => {
    // Update task based on which quadrant it was dropped in
    let newStatus: Task['status'] = 'todo';
    let newPriority: Task['priority'] = 'medium';
    
    switch (quadrant) {
      case 'do':
        // Urgent & Important
        newStatus = 'today';
        newPriority = 'very high';
        break;
      case 'plan':
        // Not Urgent & Important
        newStatus = 'todo';
        newPriority = 'high';
        break;
      case 'delegate':
        // Urgent & Not Important
        newStatus = 'todo';
        newPriority = 'medium';
        break;
      case 'eliminate':
        // Not Urgent & Not Important
        newStatus = 'deleted';
        newPriority = 'very low';
        break;
    }
    
    setTaskList(taskList.map(task => task.id === taskId ? {
      ...task,
      status: newStatus,
      priority: newPriority
    } : task));
    
    // Sync with GTD
    const gtdTask = gtdTasks.find(task => task.id === taskId);
    if (gtdTask) {
      let gtdStatus: any = "next-action";
      if (newStatus === "deleted") {
        gtdStatus = "deleted";
      } else if (newStatus === "completed") {
        gtdStatus = "completed";
      }
      
      moveTask(taskId, gtdStatus, 
        newPriority === "very high" ? "Very High" : 
        newPriority === "high" ? "High" : 
        newPriority === "medium" ? "Medium" :
        newPriority === "low" ? "Low" : "Very Low");
      
      if (newStatus === "today") {
        updateGTDTask(taskId, { tags: ["today"] });
      }
    }
    
    toast({
      description: `Task moved to ${quadrant} quadrant`
    });
  };

  const filteredTasks = taskList.filter(task => {
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategory !== "All Categories" && task.category !== selectedCategory) {
      return false;
    }

    // Filter by priority
    if (selectedPriority !== "All Priorities" && task.priority !== selectedPriority.toLowerCase()) {
      return false;
    }

    // Filter by tab
    if (activeTab === "all") return task.status !== "deleted";
    if (activeTab === "today") {
      if (task.status === "today") return true;
      if (!task.dueDate) return false;
      const today = new Date();
      return task.status !== "deleted" && task.dueDate.getDate() === today.getDate() && task.dueDate.getMonth() === today.getMonth() && task.dueDate.getFullYear() === today.getFullYear();
    }
    if (activeTab === "upcoming") return task.status !== "deleted" && (task.status === "todo" || task.status === "in-progress");
    if (activeTab === "completed") return task.status === "completed";
    if (activeTab === "overdue") {
      if (!task.dueDate) return false;
      return task.status !== "deleted" && task.dueDate < new Date() && task.status !== "completed";
    }
    if (activeTab === "deleted") return task.status === "deleted";
    return task.status !== "deleted";
  });

  // For Eisenhower matrix
  const urgentImportantTasks = taskList.filter(task => (task.priority === "very high" || task.priority === "high") && task.importance >= 70 && task.status !== "completed" && task.status !== "deleted");
  const notUrgentImportantTasks = taskList.filter(task => task.priority === "medium" && task.importance >= 70 && task.status !== "completed" && task.status !== "deleted");
  const urgentNotImportantTasks = taskList.filter(task => (task.priority === "very high" || task.priority === "high") && task.importance < 70 && task.status !== "completed" && task.status !== "deleted");
  const notUrgentNotImportantTasks = taskList.filter(task => (task.priority === "low" || task.priority === "very low") && task.importance < 70 && task.status !== "completed" && task.status !== "deleted");

  return (
    <AppLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ListTodo className="h-6 w-6 text-primary" />
              Tasks
            </h1>
            <p className="text-muted-foreground">Manage your daily tasks and to-dos</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} className="flex-1 sm:flex-none bg-zinc-50 text-base text-orange-600">
              <List className="h-4 w-4 mr-2" />
              Tasks List
            </Button>
            <Button variant={viewMode === "board" ? "default" : "outline"} onClick={() => setViewMode("board")} className="flex-1 sm:flex-none">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Tasks Board
            </Button>
            <Button variant={viewMode === "matrix" ? "default" : "outline"} onClick={() => setViewMode("matrix")} className="flex-1 sm:flex-none">
              <Grid2X2 className="h-4 w-4 mr-2" />
              Tasks Matrix
            </Button>
            <Button onClick={() => setShowTaskDialog(true)} className="gap-2">
              <Plus size={18} />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>
        
        {/* Quick Add Task Form */}
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Add Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleQuickAddTask} className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="What's on your mind?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="pr-10"
                  />
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className={isRecording ? "bg-red-500 text-white hover:bg-red-600" : ""}
                  onClick={isRecording ? stopRecording : startRecording}
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={openFileSelector}
                  title="Attach file"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,application/pdf,text/plain"
                />
              </div>
              
              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Attached: {selectedFile.name}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="w-full sm:w-1/3">
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Very Low">Very Low</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Very High">Very High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full sm:w-auto">
                  Add Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-9" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="aspect-square lg:hidden">
              <Filter className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">{selectedCategory}</span>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {CATEGORIES.map(category => (
                  <DropdownMenuItem 
                    key={category} 
                    onClick={() => setSelectedCategory(category)} 
                    className={category === selectedCategory ? "bg-muted" : ""}
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">{selectedPriority}</span>
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {PRIORITIES.map(priority => (
                  <DropdownMenuItem 
                    key={priority} 
                    onClick={() => setSelectedPriority(priority)} 
                    className={priority === selectedPriority ? "bg-muted" : ""}
                  >
                    {priority}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
          
          {viewMode === "list" && (
            <TabsContent value={activeTab} className="mt-4">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>Manage and organize your tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-4">
                    {filteredTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <ListTodo className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No tasks found</h3>
                        <p className="mt-2 text-muted-foreground">
                          {activeTab === "all" ? "Start by creating your first task." : activeTab === "deleted" ? "No deleted tasks." : `No ${activeTab} tasks. Try creating a new task or changing filters.`}
                        </p>
                        {activeTab !== "deleted" && (
                          <Button onClick={() => setShowTaskDialog(true)} className="mt-4">
                            Create New Task
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredTasks.map(task => (
                          <Card 
                            key={task.id} 
                            className={cn(
                              "border-l-4", 
                              task.priority === "very high" ? "border-l-red-600" : 
                              task.priority === "high" ? "border-l-red-500" : 
                              task.priority === "medium" ? "border-l-orange-500" : 
                              task.priority === "low" ? "border-l-blue-500" : "border-l-blue-300", // very low
                              task.status === "deleted" && "border-dashed opacity-75", 
                              "hover:shadow-md transition-shadow"
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  {task.status !== "deleted" && (
                                    <input 
                                      type="checkbox" 
                                      checked={task.status === "completed"} 
                                      onChange={() => handleUpdateTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")} 
                                      className="h-5 w-5 rounded-full" 
                                    />
                                  )}
                                </div>
                                
                                <div className="flex-grow">
                                  <h3 className={cn(
                                    "font-medium", 
                                    task.status === "completed" && "line-through text-muted-foreground", 
                                    task.status === "deleted" && "text-muted-foreground"
                                  )}>
                                    {task.title}
                                  </h3>
                                  {task.description && (
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                                  <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                    {task.category}
                                  </span>
                                  
                                  {task.dueDate && (
                                    <span className="text-xs px-2 py-1 rounded-full flex items-center gap-1 bg-muted">
                                      <Clock className="h-3 w-3" />
                                      {task.dueDate.toLocaleDateString()}
                                    </span>
                                  )}
                                  
                                  <span className={cn(
                                    "text-xs px-2 py-1 rounded-full", 
                                    task.priority === "very high" ? "bg-red-100 text-red-800" : 
                                    task.priority === "high" ? "bg-red-100 text-red-800" : 
                                    task.priority === "medium" ? "bg-orange-100 text-orange-800" : 
                                    task.priority === "low" ? "bg-blue-100 text-blue-800" : "bg-blue-50 text-blue-800" // very low
                                  )}>
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                  </span>
                                  
                                  {task.status === "deleted" ? (
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="outline" onClick={() => handleRestore(task.id)}>
                                        Restore
                                      </Button>
                                      <Button size="sm" variant="destructive" onClick={() => handlePermanentDelete(task.id)}>
                                        Delete
                                      </Button>
                                    </div>
                                  ) : (
                                    <Button size="sm" variant="outline" onClick={() => handleUpdateTaskStatus(task.id, "deleted")}>
                                      Delete
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <p className="text-muted-foreground text-sm">
                    Showing {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          )}
        </Tabs>
        
        {viewMode === "board" && (
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Board</CardTitle>
                <CardDescription>Manage tasks using drag and drop</CardDescription>
              </CardHeader>
              <CardContent>
                <KanbanBoard 
                  tasks={taskList.filter(task => task.status !== "deleted")} 
                  onUpdateTaskStatus={handleUpdateTaskStatus} 
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        {viewMode === "matrix" && (
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Eisenhower Matrix</CardTitle>
                <CardDescription>Prioritize tasks based on urgency and importance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Do - Urgent & Important */}
                  <Card className="border-l-4 border-l-green-500 overflow-hidden">
                    <CardHeader className="bg-green-50 pb-2">
                      <CardTitle className="text-lg text-green-800">Do</CardTitle>
                      <CardDescription className="text-green-800">
                        Urgent & Important • {urgentImportantTasks.length} tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent 
                      className="p-4 max-h-[350px] overflow-y-auto" 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData("taskId");
                        handleMatrixDrop(taskId, 'do');
                      }}
                    >
                      {urgentImportantTasks.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg p-8">
                          Drop tasks here
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {urgentImportantTasks.map(task => (
                            <Card 
                              key={task.id} 
                              className="p-2 shadow-sm cursor-move" 
                              draggable 
                              onDragStart={e => e.dataTransfer.setData("taskId", task.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === "completed"} 
                                  onChange={() => handleUpdateTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")} 
                                  className="h-4 w-4" 
                                />
                                <span className="flex-1 text-sm font-medium">{task.title}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Plan - Not Urgent & Important */}
                  <Card className="border-l-4 border-l-blue-500 overflow-hidden">
                    <CardHeader className="bg-blue-50 pb-2">
                      <CardTitle className="text-lg text-blue-800">Plan</CardTitle>
                      <CardDescription className="text-blue-800">
                        Not Urgent & Important • {notUrgentImportantTasks.length} tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent 
                      className="p-4 max-h-[350px] overflow-y-auto" 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData("taskId");
                        handleMatrixDrop(taskId, 'plan');
                      }}
                    >
                      {notUrgentImportantTasks.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg p-8">
                          Drop tasks here
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {notUrgentImportantTasks.map(task => (
                            <Card 
                              key={task.id} 
                              className="p-2 shadow-sm cursor-move" 
                              draggable 
                              onDragStart={e => e.dataTransfer.setData("taskId", task.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === "completed"} 
                                  onChange={() => handleUpdateTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")} 
                                  className="h-4 w-4" 
                                />
                                <span className="flex-1 text-sm font-medium">{task.title}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Delegate - Urgent & Not Important */}
                  <Card className="border-l-4 border-l-yellow-500 overflow-hidden">
                    <CardHeader className="bg-yellow-50 pb-2">
                      <CardTitle className="text-lg text-yellow-800">Delegate</CardTitle>
                      <CardDescription className="text-yellow-800">
                        Urgent & Not Important • {urgentNotImportantTasks.length} tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent 
                      className="p-4 max-h-[350px] overflow-y-auto" 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData("taskId");
                        handleMatrixDrop(taskId, 'delegate');
                      }}
                    >
                      {urgentNotImportantTasks.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg p-8">
                          Drop tasks here
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {urgentNotImportantTasks.map(task => (
                            <Card 
                              key={task.id} 
                              className="p-2 shadow-sm cursor-move" 
                              draggable 
                              onDragStart={e => e.dataTransfer.setData("taskId", task.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === "completed"} 
                                  onChange={() => handleUpdateTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")} 
                                  className="h-4 w-4" 
                                />
                                <span className="flex-1 text-sm font-medium">{task.title}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Eliminate - Not Urgent & Not Important */}
                  <Card className="border-l-4 border-l-red-500 overflow-hidden">
                    <CardHeader className="bg-red-50 pb-2">
                      <CardTitle className="text-lg text-red-800">Eliminate</CardTitle>
                      <CardDescription className="text-red-800">
                        Not Urgent & Not Important • {notUrgentNotImportantTasks.length} tasks
                      </CardDescription>
                    </CardHeader>
                    <CardContent 
                      className="p-4 max-h-[350px] overflow-y-auto" 
                      onDragOver={e => e.preventDefault()} 
                      onDrop={e => {
                        e.preventDefault();
                        const taskId = e.dataTransfer.getData("taskId");
                        handleMatrixDrop(taskId, 'eliminate');
                      }}
                    >
                      {notUrgentNotImportantTasks.length === 0 ? (
                        <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg p-8">
                          Drop tasks here
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {notUrgentNotImportantTasks.map(task => (
                            <Card 
                              key={task.id} 
                              className="p-2 shadow-sm cursor-move" 
                              draggable 
                              onDragStart={e => e.dataTransfer.setData("taskId", task.id)}
                            >
                              <div className="flex items-center gap-2">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === "completed"} 
                                  onChange={() => handleUpdateTaskStatus(task.id, task.status === "completed" ? "todo" : "completed")} 
                                  className="h-4 w-4" 
                                />
                                <span className="flex-1 text-sm font-medium">{task.title}</span>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      
        <TaskDialog open={showTaskDialog} onOpenChange={setShowTaskDialog} onCreateTask={handleCreateTask} />
      </div>
    </AppLayout>
  );
};

export default Tasks;
