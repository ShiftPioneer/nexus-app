
import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, Type, Plus, Camera, File, StopCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface QuickCaptureFormProps {
  onAddTask: (title: string, description: string, attachment?: File) => void;
}

const QuickCaptureForm: React.FC<QuickCaptureFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "voice" | "photo" | "file">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAddTask = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    onAddTask(title.trim(), description.trim(), attachment || undefined);
    setTitle("");
    setDescription("");
    setAttachment(null);
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setAttachment(null);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      
      // Mock voice recording - in a real app, you would implement actual voice recording
      toast({
        title: "Recording started",
        description: "Speak now to capture your task...",
      });
      
      // Simulate recording for 3 seconds then stop
      setTimeout(() => {
        setIsRecording(false);
        setTitle("Voice recorded task");
        toast({
          title: "Recording completed",
          description: "Voice recording has been processed",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Microphone error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
      console.error("Microphone access error:", error);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording stopped",
      description: "Voice recording has been processed",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
      setTitle(`File: ${file.name}`);
    }
  };

  const handleSelectFile = (type: "photo" | "file") => {
    setInputMethod(type);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
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
            onClick={() => {
              setInputMethod("voice");
              if (!isRecording) {
                handleStartRecording();
              }
            }}
            className={cn(
              "rounded-md", 
              inputMethod === "voice" ? "bg-slate-700" : "bg-transparent"
            )}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectFile("photo")}
            className={cn(
              "rounded-md", 
              inputMethod === "photo" ? "bg-slate-700" : "bg-transparent"
            )}
          >
            <Camera className="h-4 w-4 mr-2" />
            Photo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectFile("file")}
            className={cn(
              "rounded-md", 
              inputMethod === "file" ? "bg-slate-700" : "bg-transparent"
            )}
          >
            <File className="h-4 w-4 mr-2" />
            File
          </Button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={inputMethod === "photo" ? "image/*" : "*/*"} 
          onChange={handleFileUpload} 
        />
        
        {isRecording ? (
          <div className="p-4 bg-slate-800 border border-red-500 rounded-md text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="animate-pulse h-4 w-4 rounded-full bg-red-500 mr-2" />
              <span className="text-red-500">Recording...</span>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleStopRecording}
              className="flex items-center"
            >
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Recording
            </Button>
          </div>
        ) : (
          <>
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-200"
              disabled={isRecording}
            />
            
            <Textarea
              placeholder="Description (optional)"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-800 border-slate-700 text-slate-200"
              disabled={isRecording}
            />

            {attachment && (
              <div className="bg-slate-800 border border-slate-700 rounded-md p-2 flex items-center justify-between">
                <div className="flex items-center">
                  {attachment.type.includes('image') ? (
                    <Camera className="h-4 w-4 mr-2 text-blue-400" />
                  ) : (
                    <File className="h-4 w-4 mr-2 text-blue-400" />
                  )}
                  <span className="text-sm text-slate-300 truncate">{attachment.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAttachment(null)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  Remove
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
        <Button 
          variant="default" 
          onClick={handleAddTask}
          className="bg-[#FF5722] hover:bg-[#FF6E40] text-white"
          disabled={isRecording || !title.trim()}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add to Inbox
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuickCaptureForm;
