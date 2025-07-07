
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, Flag, ArrowRight, CheckCircle2, X, Calendar } from "lucide-react";
import { useGTD } from "../GTDContext";
import { GTDTask, TaskPriority, TaskCategory } from "@/types/gtd";

const ClarifyView = () => {
  const { tasks, updateTask, deleteTask } = useGTD();
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<GTDTask | null>(null);

  const unclarifiedTasks = tasks.filter(task => 
    !task.clarified && 
    (searchTerm === "" || task.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (priorityFilter === "all" || task.priority === priorityFilter)
  );

  const handleClarifyTask = (task: GTDTask, updates: Partial<GTDTask>) => {
    updateTask(task.id, { ...updates, clarified: true });
    setSelectedTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="glass rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Clarify</h2>
            <p className="text-slate-300">Transform captured items into actionable tasks</p>
          </div>
          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-300">
            {unclarifiedTasks.length} items to clarify
          </Badge>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-600 text-white"
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-600 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {unclarifiedTasks.length === 0 ? (
          <div className="lg:col-span-2">
            <Card className="bg-slate-900/50 border-slate-700/50 text-center p-12">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">All caught up!</h3>
              <p className="text-slate-400">No items need clarification right now.</p>
            </Card>
          </div>
        ) : (
          unclarifiedTasks.map((task) => (
            <Card key={task.id} className="bg-slate-900/80 border-slate-700/50 hover:border-blue-500/30 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg group-hover:text-blue-300 transition-colors">
                      {task.title}
                    </CardTitle>
                    {task.description && (
                      <p className="text-slate-400 text-sm mt-1 line-clamp-2">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={`
                      ${task.priority === 'urgent' ? 'border-red-500/50 text-red-300 bg-red-500/10' : ''}
                      ${task.priority === 'high' ? 'border-orange-500/50 text-orange-300 bg-orange-500/10' : ''}
                      ${task.priority === 'medium' ? 'border-yellow-500/50 text-yellow-300 bg-yellow-500/10' : ''}
                      ${task.priority === 'low' ? 'border-green-500/50 text-green-300 bg-green-500/10' : ''}
                    `}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Badge variant="secondary" className="bg-slate-700/50 text-slate-300">
                      {task.category}
                    </Badge>
                  </div>
                  
                  <Button
                    onClick={() => setSelectedTask(task)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                  >
                    Clarify
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Clarification Dialog */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-slate-900 border-slate-700 max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Clarify Task</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTask(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              <ClarificationForm
                task={selectedTask}
                onSave={(updates) => handleClarifyTask(selectedTask, updates)}
                onCancel={() => setSelectedTask(null)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const ClarificationForm = ({ task, onSave, onCancel }: {
  task: GTDTask;
  onSave: (updates: Partial<GTDTask>) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState<TaskCategory>(task.category);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [context, setContext] = useState(task.context || "");
  const [nextAction, setNextAction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      category,
      priority,
      context,
      nextAction: nextAction || undefined,
      status: nextAction ? 'next-action' : 'clarified'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title" className="text-white font-medium">Task Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white font-medium">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-800 border-slate-600 text-white mt-1"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category" className="text-white font-medium">Category</Label>
          <Select value={category} onValueChange={(value: string) => setCategory(value as TaskCategory)}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="inbox">Inbox</SelectItem>
              <SelectItem value="next-actions">Next Actions</SelectItem>
              <SelectItem value="projects">Projects</SelectItem>
              <SelectItem value="waiting-for">Waiting For</SelectItem>
              <SelectItem value="someday-maybe">Someday/Maybe</SelectItem>
              <SelectItem value="reference">Reference</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="priority" className="text-white font-medium">Priority</Label>
          <Select value={priority} onValueChange={(value: string) => setPriority(value as TaskPriority)}>
            <SelectTrigger className="bg-slate-800 border-slate-600 text-white mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="context" className="text-white font-medium">Context</Label>
        <Input
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="@home, @office, @phone, etc."
          className="bg-slate-800 border-slate-600 text-white mt-1"
        />
      </div>

      <div>
        <Label htmlFor="nextAction" className="text-white font-medium">Next Action (Optional)</Label>
        <Input
          id="nextAction"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          placeholder="What's the very next physical action?"
          className="bg-slate-800 border-slate-600 text-white mt-1"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
        <Button type="button" variant="outline" onClick={onCancel} className="border-slate-600 text-slate-300">
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save & Clarify
        </Button>
      </div>
    </form>
  );
};

export default ClarifyView;
