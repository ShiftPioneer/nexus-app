
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
    { 
      value: "low", 
      label: "Low", 
      icon: Check,
      gradient: "from-green-500/20 to-emerald-500/20",
      color: "text-green-400",
      border: "border-green-500/30"
    },
    { 
      value: "medium", 
      label: "Medium", 
      icon: Zap,
      gradient: "from-blue-500/20 to-cyan-500/20",
      color: "text-blue-400",
      border: "border-blue-500/30"
    },
    { 
      value: "high", 
      label: "High", 
      icon: Zap,
      gradient: "from-orange-500/20 to-red-500/20",
      color: "text-orange-400",
      border: "border-orange-500/30"
    },
    { 
      value: "urgent", 
      label: "Urgent", 
      icon: Zap,
      gradient: "from-red-500/20 to-pink-500/20",
      color: "text-red-400",
      border: "border-red-500/30"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 shadow-2xl">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-orange-500 flex items-center justify-center shadow-lg">
              <Inbox className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white font-bold">Quick Capture</CardTitle>
              <p className="text-sm text-slate-400 mt-1">Capture what's on your mind instantly</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Task Title */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">1</span>
                </div>
                What's on your mind?
              </Label>
              <div className="relative">
                <Input
                  placeholder="Capture your thought or task..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="pr-14 h-12 text-base bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <VoiceInput
                    onTranscription={handleVoiceTranscriptionTitle}
                    isRecording={isRecordingTitle}
                    onRecordingStateChange={handleRecordingStateChangeTitle}
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Details */}
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">2</span>
                </div>
                Additional Details
              </Label>
              <div className="relative">
                <Textarea
                  placeholder="Add context, notes, or additional information..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="pr-14 min-h-[120px] bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 focus:border-primary focus:ring-primary/20 resize-none transition-all duration-200"
                />
                <div className="absolute right-3 top-3">
                  <VoiceInput
                    onTranscription={handleVoiceTranscriptionDescription}
                    isRecording={isRecordingDescription}
                    onRecordingStateChange={handleRecordingStateChangeDescription}
                  />
                </div>
              </div>
            </motion.div>

            {/* Attachments */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">3</span>
                </div>
                Attachments
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500/50 transition-all duration-200"
                  >
                    <Camera className="h-4 w-4 mr-2 text-blue-400" />
                    Photo
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500/50 transition-all duration-200"
                  >
                    <Paperclip className="h-4 w-4 mr-2 text-green-400" />
                    File
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-slate-800/50 border-slate-600/50 text-slate-300 hover:bg-slate-700/50 hover:text-white hover:border-slate-500/50 transition-all duration-200"
                  >
                    <Link className="h-4 w-4 mr-2 text-purple-400" />
                    Link
                  </Button>
                </motion.div>
              </div>
              <AttachmentInput
                attachments={attachments}
                onAttachmentsChange={setAttachments}
              />
            </motion.div>
            
            {/* Priority */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">4</span>
                </div>
                Priority Level
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {priorityOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      type="button"
                      onClick={() => setPriority(option.value as TaskPriority)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                        priority === option.value
                          ? `bg-gradient-to-r ${option.gradient} ${option.border} shadow-lg`
                          : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30 hover:border-slate-500/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        priority === option.value
                          ? `bg-gradient-to-r ${option.gradient}`
                          : "bg-slate-700/50"
                      }`}>
                        <option.icon 
                          size={16} 
                          className={priority === option.value ? option.color : "text-slate-400"} 
                        />
                      </div>
                      <span className={`font-medium ${
                        priority === option.value ? "text-white" : "text-slate-300"
                      }`}>
                        {option.label}
                      </span>
                      {priority === option.value && (
                        <Check size={16} className="ml-auto text-white" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Task Type */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Label className="text-white font-semibold text-base flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-xs">5</span>
                </div>
                Task Type
              </Label>
              <RadioGroup value={isToDoNot ? "nottodo" : "todo"} className="grid grid-cols-2 gap-3">
                <motion.div 
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    !isToDoNot 
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/30" 
                      : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                  }`}
                  onClick={() => setIsToDoNot(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RadioGroupItem 
                    value="todo" 
                    id="todo" 
                    checked={!isToDoNot} 
                    className="border-primary text-primary"
                  />
                  <Label htmlFor="todo" className="text-white font-medium cursor-pointer flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-400" />
                    <span>To Do</span>
                  </Label>
                </motion.div>
                <motion.div 
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isToDoNot 
                      ? "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30" 
                      : "bg-slate-800/30 border-slate-600/50 hover:bg-slate-700/30"
                  }`}
                  onClick={() => setIsToDoNot(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RadioGroupItem 
                    value="nottodo" 
                    id="nottodo" 
                    checked={isToDoNot} 
                    className="border-primary text-primary"
                  />
                  <Label htmlFor="nottodo" className="text-white font-medium cursor-pointer flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                      <span className="text-red-400 text-xs">×</span>
                    </span>
                    <span>Not To Do</span>
                  </Label>
                </motion.div>
              </RadioGroup>
            </motion.div>
            
            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white font-semibold py-4 h-auto shadow-lg shadow-primary/20 text-lg"
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
