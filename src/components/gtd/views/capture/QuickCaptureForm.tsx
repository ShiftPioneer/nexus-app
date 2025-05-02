import React, { useState, useEffect, useRef } from "react";
import { useGTD } from "../../GTDContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Mic, MicOff, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import TagInput from "../../../ui/tag-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define WebkitSpeechRecognition interface for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
  // Define the optional resultIndex property
  resultIndex?: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Add types to the global window object
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const QuickCaptureForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"Very Low" | "Low" | "Medium" | "High" | "Very High">("Medium");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [context, setContext] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState("");
  const [taskType, setTaskType] = useState<"todo" | "not-to-do">("todo");
  
  const { addTask } = useGTD();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Speech recognition setup
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  useEffect(() => {
    // Initialize speech recognition
    if (window.webkitSpeechRecognition || window.SpeechRecognition) {
      const SpeechRecognitionAPI = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          // Use 0 as default if resultIndex is undefined
          const resultIndex = event.resultIndex || 0;
          
          for (let i = resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          if (finalTranscript) {
            setRecordedText(finalTranscript);
          }
        };
        
        recognitionRef.current.onerror = () => {
          setIsRecording(false);
          toast({
            title: "Speech Recognition Error",
            description: "An error occurred with speech recognition",
            variant: "destructive",
          });
        };
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser does not support speech recognition",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      if (recordedText) {
        setDescription((prev) => prev + ' ' + recordedText);
        setRecordedText("");
      }
    } else {
      recognitionRef.current.start();
    }
    
    setIsRecording(!isRecording);
  };
  
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachment(file);
      toast({
        title: "File Attached",
        description: `${file.name} has been attached`,
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a title for the task",
        variant: "destructive",
      });
      return;
    }
    
    const newTask = {
      title,
      description,
      priority,
      status: "inbox" as const,
      isToDoNot: taskType === "not-to-do",
      ...(dueDate && { dueDate }),
      ...(tags.length && { tags }),
      ...(context && { context }),
      ...(attachment && {
        attachment: {
          name: attachment.name,
          type: attachment.type,
          url: URL.createObjectURL(attachment),
        },
      }),
    };
    
    addTask(newTask);
    
    toast({
      title: taskType === "todo" ? "Task Captured" : "Avoidance Item Captured",
      description: taskType === "todo" 
        ? "Your task has been added to the inbox" 
        : "Your avoidance item has been added to the inbox",
    });
    
    // Reset the form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate(undefined);
    setTags([]);
    setContext("");
    setAttachment(null);
    setRecordedText("");
    setTaskType("todo");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Quick Capture</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">What's on your mind?</Label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Task Type</Label>
            <RadioGroup 
              defaultValue="todo" 
              value={taskType}
              onValueChange={(value) => setTaskType(value as "todo" | "not-to-do")}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="todo" id="todo" />
                <Label htmlFor="todo" className="cursor-pointer">To Do</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-to-do" id="not-to-do" />
                <Label htmlFor="not-to-do" className="cursor-pointer">Not To Do</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="description">Details (optional)</Label>
              <Button
                type="button"
                size="sm"
                variant={isRecording ? "destructive" : "outline"}
                className="h-8 gap-1"
                onClick={toggleRecording}
              >
                {isRecording ? (
                  <>
                    <MicOff className="h-4 w-4" /> Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" /> Record
                  </>
                )}
              </Button>
            </div>
            <Textarea
              id="description"
              placeholder="Describe your task"
              value={`${description}${recordedText ? ` ${recordedText}` : ''}`}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as any)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select priority" />
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

            <div>
              <Label>Due Date (optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (optional)</Label>
            <TagInput 
              id="tags" 
              placeholder="Add tags..."
              value={tags}
              onChange={setTags}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="context">Context (optional)</Label>
            <Input
              id="context"
              placeholder="e.g., Home, Work, Errands"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              className="mt-1 w-full"
              onClick={handleSelectFile}
            >
              <Paperclip className="h-4 w-4 mr-2" />
              {attachment ? attachment.name : "Attach File (optional)"}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Capture {taskType === "todo" ? "Task" : "Avoidance Item"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuickCaptureForm;
