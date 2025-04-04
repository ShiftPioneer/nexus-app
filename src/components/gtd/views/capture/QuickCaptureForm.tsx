import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mic, MicOff, FileUp, Paperclip } from "lucide-react";
import { useGTD } from "@/components/gtd/GTDContext";
import { useToast } from "@/hooks/use-toast";

// Add proper TypeScript declarations for SpeechRecognition
interface Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

const QuickCaptureForm: React.FC = () => {
  const { addTask } = useGTD();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use proper type checking when accessing window.SpeechRecognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = useRef<any>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setRecordingText(prev => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognition.current.onstart = () => {
        toast({
          title: "Voice Recording Started",
          description: "Speak now to add content to your task",
          duration: 3000,
        });
      };

      recognition.current.onend = () => {
        setIsRecording(false);
        toast({
          title: "Voice Recording Ended",
          description: "Your speech has been added to the description",
          duration: 3000,
        });
      };

      recognition.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
          duration: 3000,
        });
      };
    } else {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser does not support speech recognition. Try Google Chrome.",
        variant: "destructive",
        duration: 5000,
      });
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
    };
  }, []);

  const toggleRecording = () => {
    if (!SpeechRecognition) return;

    if (isRecording) {
      recognition.current.stop();
      setDescription(prev => prev + " " + recordingText);
    } else {
      setRecordingText("");
      recognition.current.start();
      setIsRecording(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAttachment(file);
      toast({
        title: "Attachment Added",
        description: `${file.name} has been attached to the task`,
        duration: 3000,
      });
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Missing Task Title",
        description: "Please enter a title for your task",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority: "Medium",
      status: "inbox",
      attachment: attachment
        ? {
            name: attachment.name,
            type: attachment.type,
          }
        : undefined,
    };

    addTask(newTask);
    setTitle("");
    setDescription("");
    setAttachment(null);

    toast({
      title: "Task Added to Inbox",
      description: "Your task has been added to the inbox",
      duration: 3000,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Task Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <Label htmlFor="description">Task Description</Label>
          <Button
            type="button"
            variant={isRecording ? "destructive" : "outline"}
            size="sm"
            onClick={toggleRecording}
            disabled={!SpeechRecognition}
            className="gap-1"
          >
            {isRecording ? (
              <>
                <MicOff className="h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-4 w-4" />
                Record Voice
              </>
            )}
          </Button>
        </div>
        <Textarea
          id="description"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[100px]"
        />
        {recordingText && (
          <div className="mt-1 text-sm text-muted-foreground">
            Recording: {recordingText}
          </div>
        )}
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
          onClick={handleFileUpload}
          className="w-full gap-2"
        >
          <Paperclip className="h-4 w-4" />
          {attachment ? attachment.name : "Attach File"}
        </Button>
      </div>
      <Button type="submit" className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add Task
      </Button>
    </form>
  );
};

export default QuickCaptureForm;
