
import React, { useState, useRef } from "react";
import { useGTD } from "../../GTDContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Mic, Upload, Plus, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const QuickCaptureForm: React.FC = () => {
  const { addTask } = useGTD();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Very Low" | "Low" | "Medium" | "High" | "Very High">("Medium");
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<{ name: string; type: string; url?: string; file?: File } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Speech recognition setup
  const recognitionRef = useRef<any>(null);
  
  const startRecording = () => {
    // Initialize speech recognition if supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onstart = () => {
        setIsRecording(true);
        toast({
          title: "Voice Recording Started",
          description: "Speak now to capture your task..."
        });
      };
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        
        setTitle(transcript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event);
        toast({
          title: "Speech Recognition Error",
          description: "There was a problem with voice input.",
          variant: "destructive"
        });
        setIsRecording(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current.start();
    } else {
      toast({
        title: "Feature Not Supported",
        description: "Voice input is not supported in this browser.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Voice Recording Stopped",
        description: "Your task has been captured."
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      const isValidType = ['image', 'application', 'text'].includes(fileType);
      
      if (isValidType) {
        const fileURL = URL.createObjectURL(file);
        setAttachment({
          name: file.name,
          type: file.type,
          url: fileURL,
          file: file
        });
        
        toast({
          title: "File Attached",
          description: `${file.name} has been attached to the task.`
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image, document, or text file.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Required Field Missing",
        description: "Please enter a task title.",
        variant: "destructive"
      });
      return;
    }
    
    addTask({
      title,
      description,
      priority,
      status: "inbox",
      attachment: attachment || undefined
    });
    
    toast({
      title: "Task Added",
      description: "The task has been added to your inbox."
    });
    
    // Reset form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setAttachment(null);
  };
  
  const removeAttachment = () => {
    if (attachment?.url) {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachment(null);
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="border-blue-600/20 bg-slate-800/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-semibold text-white">Quick Capture</CardTitle>
        <CardDescription>Quickly add tasks to your inbox</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-20 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          
          <div>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Set Priority" />
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
          
          {attachment && (
            <div className="border border-slate-700 rounded-md p-2 flex justify-between items-center bg-slate-800">
              <div className="truncate">
                {attachment.type.startsWith('image') ? (
                  <div className="flex items-center">
                    <div className="w-8 h-8 mr-2 rounded overflow-hidden">
                      <img src={attachment.url} alt="Attached" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm">{attachment.name}</span>
                  </div>
                ) : (
                  <span className="text-sm">{attachment.name}</span>
                )}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={removeAttachment} 
                className="text-red-500"
              >
                <X size={16} />
              </Button>
            </div>
          )}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*,application/pdf,application/msword,text/plain"
          />
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline" 
              onClick={isRecording ? stopRecording : startRecording}
              className={`${isRecording ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording ? 'Stop Recording' : 'Voice Input'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={triggerFileInput}
              className="bg-slate-700 text-slate-300 hover:bg-slate-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Attach File
            </Button>
            
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickCaptureForm;
