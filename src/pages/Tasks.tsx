
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListTodo, Calendar, Grid3X3, Menu, Plus, Filter, Search, Pin, PinOff } from "lucide-react";
import { GTDProvider } from "@/components/gtd/GTDContext";
import TasksList from "@/components/gtd/TasksList";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const Tasks: React.FC = () => {
  const [view, setView] = useState<string>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Mock tasks data
  const [mockTasks, setMockTasks] = useState([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send for review",
      priority: "high",
      dueDate: new Date(Date.now() + 86400000), // Tomorrow
      tags: ["work", "important"],
      context: "office",
      timeEstimate: 60,
      status: "todo",
      pinned: true
    },
    {
      id: "2",
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith's office",
      priority: "medium",
      dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
      tags: ["health", "personal"],
      context: "phone",
      timeEstimate: 15,
      status: "todo",
      pinned: false
    },
    {
      id: "3",
      title: "Buy groceries",
      description: "Get items for the week",
      priority: "low",
      dueDate: new Date(),
      tags: ["personal", "shopping"],
      context: "errands",
      timeEstimate: 45,
      status: "in-progress",
      pinned: false
    },
    {
      id: "4",
      title: "Review code changes",
      description: "Check latest PR from team",
      priority: "high",
      dueDate: new Date(),
      tags: ["work", "tech"],
      context: "computer",
      timeEstimate: 30,
      status: "completed",
      pinned: false
    }
  ]);
  
  const handleAddTask = () => {
    toast({
      title: "Create Task",
      description: "Task creation dialog will open here",
      duration: 3000,
    });
  };

  const handleTogglePin = (id: string) => {
    setMockTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, pinned: !task.pinned } : task
    ));
    
    const task = mockTasks.find(t => t.id === id);
    if (task) {
      toast({
        title: task.pinned ? "Task Unpinned" : "Task Pinned",
        description: `"${task.title}" has been ${task.pinned ? "unpinned" : "pinned"}`,
        duration: 2000,
      });
    }
  };
  
  const sortedTasks = [...mockTasks].sort((a, b) => {
    // First sort by pinned status
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Then by priority
    return 0;
  });
  
  const filteredTasks = sortedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === "all" || task.priority.toLowerCase() === filterPriority.toLowerCase();
    
    return matchesSearch && matchesPriority;
  });
  
  // Eisenhower Matrix categorization
  const urgentImportant = mockTasks.filter(task => task.priority === "high" && task.dueDate && task.dueDate <= new Date());
  const importantNotUrgent = mockTasks.filter(task => task.priority === "high" && task.dueDate && task.dueDate > new Date());
  const urgentNotImportant = mockTasks.filter(task => task.priority !== "high" && task.dueDate && task.dueDate <= new Date());
  const neitherUrgentNorImportant = mockTasks.filter(task => task.priority !== "high" && (!task.dueDate || task.dueDate > new Date()));
  
  // Kanban columns
  const kanbanColumns = {
    "todo": filteredTasks.filter(task => task.status === "todo"),
    "in-progress": filteredTasks.filter(task => task.status === "in-progress"),
    "completed": filteredTasks.filter(task => task.status === "completed")
  };
  
  const handleTaskClick = (task: any) => {
    toast({
      title: "Edit Task",
      description: `Editing task: ${task.title}`,
      duration: 3000,
    });
  };
  
  const handleTaskMove = (taskId: string, newStatus: string) => {
    setMockTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    
    toast({
      title: "Task Moved",
      description: `Task moved to ${newStatus.replace(/-/g, " ")}`,
      duration: 2000,
    });
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-blue-500";
    }
  };
  
  return (
    <GTDProvider>
      <AppLayout>
        <div className="animate-fade-in space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tasks</h1>
            <Button onClick={handleAddTask} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <Tabs defaultValue="todos" className="w-full">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="todos" className="gap-2">
                  <ListTodo className="h-4 w-4" />
                  To-dos
                </TabsTrigger>
                <TabsTrigger value="calendar" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="eisenhower" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Eisenhower Matrix
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <Button 
                  variant={view === "list" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setView("list")}
                >
                  <ListTodo className="h-4 w-4" />
                </Button>
                <Button 
                  variant={view === "kanban" ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => setView("kanban")}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by priority" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="todos" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>Manage your tasks and to-dos</CardDescription>
                </CardHeader>
                <CardContent>
                  {view === "list" ? (
                    <div className="space-y-4">
                      {filteredTasks.map(task => (
                        <div key={task.id} className="flex items-start gap-2 p-3 border rounded-md hover:bg-accent/5 transition-colors">
                          <div className={`h-3 w-3 rounded-full mt-1.5 ${getPriorityColor(task.priority)}`} />
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-medium">{task.title}</h4>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleTogglePin(task.id)}
                                >
                                  {task.pinned ? (
                                    <Pin className="h-4 w-4 text-primary" fill="currentColor" />
                                  ) : (
                                    <PinOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.tags?.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-accent/20 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {task.dueDate && (
                                <span className="px-2 py-0.5 bg-secondary/20 text-xs rounded-full flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {task.dueDate.toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="space-x-2">
                            <Button size="sm" variant="outline" className="h-8" onClick={() => handleTaskClick(task)}>
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={task.status === "completed" ? "outline" : "default"} 
                              className="h-8"
                              onClick={() => handleTaskMove(task.id, task.status === "completed" ? "todo" : "completed")}
                            >
                              {task.status === "completed" ? "Reopen" : "Complete"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <KanbanBoard 
                      columns={kanbanColumns}
                      onTaskClick={handleTaskClick}
                      onTaskMove={handleTaskMove}
                      getPriorityColor={getPriorityColor}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="calendar" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Calendar View</CardTitle>
                  <CardDescription>View your tasks by date</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-6 text-center text-muted-foreground">
                    Calendar view coming soon
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="eisenhower" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Eisenhower Matrix</h2>
                <div className="flex gap-2">
                  <Button 
                    variant={view === "list" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView("list")}
                  >
                    <ListTodo className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={view === "kanban" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setView("kanban")}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Urgent & Important</CardTitle>
                    <CardDescription>Do these tasks immediately</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksList tasks={urgentImportant} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Important, Not Urgent</CardTitle>
                    <CardDescription>Schedule time to do these tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksList tasks={importantNotUrgent} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Urgent, Not Important</CardTitle>
                    <CardDescription>Delegate these tasks if possible</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksList tasks={urgentNotImportant} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Neither Urgent nor Important</CardTitle>
                    <CardDescription>Consider eliminating these tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TasksList tasks={neitherUrgentNorImportant} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AppLayout>
    </GTDProvider>
  );
};

export default Tasks;
