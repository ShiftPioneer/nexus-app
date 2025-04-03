
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
  
  const { addTask } = useGTD();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Speech recognition setup
  const recognitionRef = useRef<any>(null);
  
  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
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
      title: "Task Captured",
      description: "Your task has been added to the inbox",
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
          <Button type="submit" className="w-full">Capture Task</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuickCaptureForm;
