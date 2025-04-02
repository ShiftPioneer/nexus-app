
import React, { useState, useRef } from 'react';
import { useGTD } from '../../GTDContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Mic, MicOff, Paperclip } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        isFinal: boolean;
      }
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

const QuickCaptureForm: React.FC = () => {
  const { addTask } = useGTD();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('Medium');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  const startRecording = () => {
    try {
      // Use TypeScript type assertions to bypass type checking for browser APIs
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
      
      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');
        
        setTitle(transcript);
      };
      
      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    // Create basic task
    const newTask = {
      title,
      description,
      priority: priority as "Very Low" | "Low" | "Medium" | "High" | "Very High",
      status: 'inbox' as const,
      // Add attachment if a file was selected
      attachment: selectedFile ? {
        name: selectedFile.name,
        type: selectedFile.type,
        file: selectedFile
      } : undefined
    };
    
    // Add task to GTD context
    addTask(newTask);
    
    // Clear form
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setSelectedFile(null);
    
    // Show success message
    toast({
      title: "Task captured",
      description: "Task has been added to your inbox."
    });
  };

  return (
    <div className="bg-card border rounded-lg shadow-sm p-4 md:p-6">
      <h3 className="text-lg font-medium mb-4">Quick Capture</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
        
        <Textarea
          placeholder="Add details (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        
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
            Add to Inbox
          </Button>
        </div>
      </form>
    </div>
  );
};

export default QuickCaptureForm;
