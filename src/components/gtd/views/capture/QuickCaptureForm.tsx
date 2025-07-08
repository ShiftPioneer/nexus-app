
import React, { useState, useRef } from "react";
import { useGTD } from "../../GTDContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TaskPriority } from "../../GTDContext";
import { Check, Inbox, Zap, Camera, Paperclip, Link, Mic } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { TaskAttachment } from "@/types/gtd";
import { motion } from "framer-motion";
import VoiceInput from "./VoiceInput";
import AttachmentInput from "./AttachmentInput";

const QuickCaptureForm = () => {
  const { addTask } = useGTD();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
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
        description: "Your speech has been added to the title."
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
        description: "Your speech has been added to the details."
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
      category: "inbox",
      clarified: false,
      isToDoNot,
      attachment: attachments.length > 0 ? attachments[0] : undefined
    });

    // Clear the form
    setTitle("");
    setDescription("");
    setPriority("medium");
    setIsToDoNot(false);
    setAttachments([]);

    // Show success toast
    toast({
      title: "Task Captured",
      description: "Your task has been added to the inbox"
    });
  };

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { value: "medium", label: "Medium", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { value: "high", label: "High", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
    { value: "urgent", label: "Urgent", color: "bg-red-500/20 text-red-300 border-red-500/30" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Quick Capture</CardTitle>
              <p className="text-sm text-slate-400">Capture what's on your mind instantly</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Task Title */}
            <div className="space-y-2">
              <Label className="text-primary font-medium">Task Title</Label>
              <div className="relative">
                <Input
                  placeholder="What's on your mind?"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="pr-12 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <VoiceInput
                    onTranscription={handleVoiceTranscriptionTitle}
                    isRecording={isRecordingTitle}
                    onRecordingStateChange={handleRecordingStateChangeTitle}
                  />
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-2">
              <Label className="text-primary font-medium">Details</Label>
              <div className="relative">
                <Textarea
                  placeholder="Add more context or notes..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="pr-12 min-h-[100px] bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none"
                />
                <div className="absolute right-3 top-3">
                  <VoiceInput
                    onTranscription={handleVoiceTranscriptionDescription}
                    isRecording={isRecordingDescription}
                    onRecordingStateChange={handleRecordingStateChangeDescription}
                  />
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-3">
              <Label className="text-primary font-medium">Attachments</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <Link className="h-4 w-4 mr-2" />
                  Link
                </Button>
              </div>
              <AttachmentInput
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </div>
            
            {/* Priority */}
            <div className="space-y-3">
              <Label className="text-primary font-medium">Priority Level</Label>
              <div className="grid grid-cols-4 gap-2">
                {priorityOptions.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setPriority(option.value as TaskPriority)}
                    className={`${
                      priority === option.value 
                        ? `${option.color} border-2` 
                        : "bg-slate-800/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {option.label}
                    {priority === option.value && <Check className="ml-2 h-4 w-4" />}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Task Type */}
            <div className="space-y-3">
              <Label className="text-primary font-medium">Task Type</Label>
              <RadioGroup value={isToDoNot ? "nottodo" : "todo"} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="todo" 
                    id="todo" 
                    checked={!isToDoNot} 
                    onClick={() => setIsToDoNot(false)}
                    className="border-slate-600 text-primary"
                  />
                  <Label htmlFor="todo" className="text-slate-300 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <span>To Do</span>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="nottodo" 
                    id="nottodo" 
                    checked={isToDoNot} 
                    onClick={() => setIsToDoNot(true)}
                    className="border-slate-600 text-primary"
                  />
                  <Label htmlFor="nottodo" className="text-slate-300 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                        <span className="text-red-400 text-xs">×</span>
                      </span>
                      <span>Not To Do</span>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Submit Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-medium py-3 h-auto shadow-lg shadow-primary/20"
              >
                <Inbox className="h-5 w-5 mr-2" />
                Capture Task
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuickCaptureForm;
