
import React, { useState, useRef } from "react";
import { useGTD } from "../../GTDContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Upload, X, StopCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickCaptureFormProps {
  onAddTask: (title: string, description: string, attachment?: File) => void;
}

const QuickCaptureForm: React.FC<QuickCaptureFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Reference for speech recognition
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  const handleStartRecording = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: "Voice input not supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      recognition.lang = 'en-US';
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript !== '') {
          setTranscript(finalTranscript);
          if (title === '') {
            setTitle(finalTranscript);
          } else {
            setDescription(prevDesc => prevDesc + ' ' + finalTranscript);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
        toast({
          title: "Voice input error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognition.start();
      setIsRecording(true);
      
      toast({
        title: "Voice recording started",
        description: "Speak now to capture your task...",
      });
    } catch (err) {
      console.error('Failed to start recording:', err);
      toast({
        title: "Voice input error",
        description: "Could not start voice recording.",
        variant: "destructive",
      });
    }
  };
  
  const handleStopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Recording has been added to your task.",
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      toast({
        title: "File attached",
        description: `${selectedFile.name} has been attached to your task.`,
      });
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }
    
    onAddTask(title, description, file || undefined);
    
    // Clear form
    setTitle("");
    setDescription("");
    setFile(null);
    setTranscript("");
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <Card className="bg-slate-900 border-slate-700 text-slate-200">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Quick Capture</h3>
        
        <div className="space-y-2">
          <label htmlFor="task-title" className="block text-sm font-medium text-slate-300">
            Task Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What needs to be done?"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="task-description" className="block text-sm font-medium text-slate-300">
            Description (Optional)
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-800 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
            placeholder="Add more details..."
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            className={`flex items-center gap-2 ${isRecording ? 'bg-red-500/20 text-red-500 border-red-500' : 'text-blue-500'}`}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
          >
            {isRecording ? <StopCircle className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isRecording ? 'Stop Recording' : 'Use Voice'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2 text-green-500"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" />
            Attach File
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx"
          />
        </div>
        
        {file && (
          <div className="flex items-center justify-between p-2 bg-slate-800 rounded-md">
            <span className="text-sm truncate max-w-[80%]">{file.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-red-500 hover:bg-red-500/20"
              onClick={handleRemoveFile}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {isRecording && (
          <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-md animate-pulse">
            <p className="text-sm text-red-400">Recording... Speak now</p>
          </div>
        )}
        
        <Button type="submit" className="w-full bg-[#FF6500] hover:bg-[#FF7F38]">
          Add to Inbox
        </Button>
      </form>
    </Card>
  );
};

export default QuickCaptureForm;
