
import React, { useState } from "react";
import { useGTD } from "../GTDContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Type, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import TasksList from "../TasksList";
import GTDPrinciple from "../GTDPrinciple";

const CaptureView: React.FC = () => {
  const { tasks, addTask } = useGTD();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "voice">("text");

  const handleAddTask = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    addTask({
      title: title.trim(),
      description: description.trim(),
      priority: "Medium",
      status: "inbox",
    });
    
    toast({
      title: "Task added",
      description: "Task has been added to your inbox",
    });
    
    setTitle("");
    setDescription("");
  };
  
  const inboxTasks = tasks.filter(task => task.status === "inbox");
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-slate-900 border-slate-700 text-slate-200">
        <CardHeader>
          <CardTitle>Quick Capture</CardTitle>
          <CardDescription className="text-slate-400">Quickly add tasks to your inbox</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputMethod("text")}
              className={cn(
                "rounded-md", 
                inputMethod === "text" ? "bg-slate-700" : "bg-transparent"
              )}
            >
              <Type className="h-4 w-4 mr-2" />
              Type
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setInputMethod("voice")}
              className={cn(
                "rounded-md", 
                inputMethod === "voice" ? "bg-slate-700" : "bg-transparent"
              )}
            >
              <Mic className="h-4 w-4 mr-2" />
              Voice
            </Button>
          </div>
          
          <Input
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-200"
          />
          
          <Textarea
            placeholder="Description (optional)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-slate-800 border-slate-700 text-slate-200"
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {setTitle(""); setDescription("");}}>
            Clear
          </Button>
          <Button 
            variant="default" 
            onClick={handleAddTask}
            className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Inbox
          </Button>
        </CardFooter>
      </Card>
      
      <GTDPrinciple />
      
      <div className="md:col-span-2">
        <h3 className="text-xl font-medium mb-4">Inbox</h3>
        <TasksList tasks={inboxTasks} />
      </div>
    </div>
  );
};

export default CaptureView;
