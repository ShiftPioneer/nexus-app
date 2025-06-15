import React, { useState, useRef } from "react";
import { useGTD } from "../../GTDContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { TaskPriority } from "../../GTDContext";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TaskAttachment } from "@/types/gtd";
import VoiceInput from "./VoiceInput";
import AttachmentInput from "./AttachmentInput";

const QuickCaptureForm = () => {
  const { addTask } = useGTD();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [isToDoNot, setIsToDoNot] = useState<boolean>(false);
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isRecordingTitle, setIsRecordingTitle] = useState(false);
  const [isRecordingDescription, setIsRecordingDescription] = useState(false);

  const baseTitleRef = useRef("");
  const baseDescriptionRef = useRef("");

  const handleVoiceTranscriptionTitle = (text: string) => {
    setTitle(baseTitleRef.current + text);
  };

  const handleRecordingStateChangeTitle = (isRecording: boolean) => {
    setIsRecordingTitle(isRecording);
    if (isRecording) {
      baseTitleRef.current = title ? `${title.trim()} ` : "";
    } else if (title.trim() && title.trim() !== baseTitleRef.current.trim()) {
      toast({
        title: "Voice input captured",
        description: "Your speech has been added to the title.",
      });
    }
  };

  const handleVoiceTranscriptionDescription = (text: string) => {
    setDescription(baseDescriptionRef.current + text);
  };

  const handleRecordingStateChangeDescription = (isRecording: boolean) => {
    setIsRecordingDescription(isRecording);
    if (isRecording) {
      baseDescriptionRef.current = description ? `${description.trim()} ` : "";
    } else if (description.trim() && description.trim() !== baseDescriptionRef.current.trim()) {
      toast({
        title: "Voice input captured",
        description: "Your speech has been added to the details.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    addTask({
      title,
      description,
      priority,
      status: "inbox",
      isToDoNot,
      attachment: attachments.length > 0 ? attachments[0] : undefined
    });

    // Clear the form
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setIsToDoNot(false);
    setAttachments([]);

    // Show success toast
    toast({
      title: "Task Captured",
      description: "Your task has been added to the inbox"
    });
  };

  return (
    <Card className="bg-slate-950">
      <CardHeader className="bg-slate-950 rounded-lg">
        <CardTitle className="text-xl text-cyan-500">Quick Capture</CardTitle>
      </CardHeader>
      <CardContent className="bg-slate-950">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-500">Task Title</label>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 focus:ring-2 focus:ring-primary bg-slate-900"
              />
              <VoiceInput 
                onTranscription={handleVoiceTranscriptionTitle}
                isRecording={isRecordingTitle}
                onRecordingStateChange={handleRecordingStateChangeTitle}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-500">Details</label>
            <div className="flex items-start space-x-2">
              <Textarea
                placeholder="Add details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 min-h-[100px] focus:ring-2 focus:ring-primary bg-slate-900"
              />
              <div className="pt-2">
                <VoiceInput 
                  onTranscription={handleVoiceTranscriptionDescription}
                  isRecording={isRecordingDescription}
                  onRecordingStateChange={handleRecordingStateChangeDescription}
                />
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-cyan-500">Attachments</label>
            <AttachmentInput 
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-500">Priority</label>
            <div className="flex flex-wrap gap-2">
              {["Very Low", "Low", "Medium", "High", "Very High"].map((p) => (
                <Button
                  key={p}
                  type="button"
                  size="sm"
                  variant={priority === p ? "default" : "outline"}
                  onClick={() => setPriority(p as TaskPriority)}
                  className={priority === p ? "bg-primary text-primary-foreground" : ""}
                >
                  {p}
                  {priority === p && <Check className="ml-2 h-4 w-4" />}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-600">Type</label>
            <RadioGroup defaultValue="todo" className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="todo"
                  id="todo"
                  checked={!isToDoNot}
                  onClick={() => setIsToDoNot(false)}
                />
                <Label htmlFor="todo" className="text-slate-300">To Do</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="nottodo"
                  id="nottodo"
                  checked={isToDoNot}
                  onClick={() => setIsToDoNot(true)}
                />
                <Label htmlFor="nottodo" className="text-slate-300">Not To Do</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full">
            Capture
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuickCaptureForm;
