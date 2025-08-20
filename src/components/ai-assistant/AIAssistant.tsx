import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Mic, MicOff, Loader2, MessageCircle, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant", 
      content: "Hi! I'm your Nexus AI Assistant. I can help you manage tasks, habits, journal entries, time design activities, and more. What would you like to do today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { 
    isListening, 
    transcript, 
    error: speechError, 
    isSupported, 
    startListening, 
    stopListening, 
    resetTranscript 
  } = useSpeechRecognition();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  useEffect(() => {
    if (speechError) {
      toast({
        title: "Speech Recognition Error",
        description: speechError,
        variant: "destructive"
      });
    }
  }, [speechError, toast]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Simulate AI response for now since we don't have OpenAI API key
      const simulatedResponse = getSimulatedResponse(content.trim());
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: simulatedResponse,
        timestamp: new Date()
      };

      // Add a small delay for more realistic feel
      setTimeout(() => {
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000);

    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant", 
        content: "I'm sorry, I'm experiencing some technical difficulties. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  // Simulate AI responses based on user input
  const getSimulatedResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('task') || lowerInput.includes('todo')) {
      return "I can help you with task management! You can create new tasks, organize them using the Eisenhower Matrix, or view them in Kanban boards. Would you like me to guide you to the Tasks section?";
    }
    
    if (lowerInput.includes('habit')) {
      return "Great! Habits are key to personal growth. I can help you track daily habits, view analytics, and maintain streaks. The Habits section has powerful tracking and insights features.";
    }
    
    if (lowerInput.includes('journal')) {
      return "Journaling is an excellent way to reflect and grow! You can write entries, track your mood, create rich notes, and gain insights from your journaling patterns. The Journal section has everything you need.";
    }
    
    if (lowerInput.includes('time') || lowerInput.includes('schedule') || lowerInput.includes('calendar')) {
      return "Time management is crucial for productivity! I can help you design your perfect day, schedule activities, and analyze how you spend your time. Check out the Time Design section for powerful planning tools.";
    }
    
    if (lowerInput.includes('goal') || lowerInput.includes('plan')) {
      return "Setting and achieving goals is what Nexus is all about! You can create SMART goals, track progress, and manage projects in the Planning section. I can guide you through the goal-setting process.";
    }
    
    if (lowerInput.includes('energy') || lowerInput.includes('workout') || lowerInput.includes('exercise')) {
      return "Physical energy is the foundation of productivity! The Energy Hub helps you track workouts, plan meals, and monitor your fitness progress. I can help you create a sustainable fitness routine.";
    }
    
    if (lowerInput.includes('focus') || lowerInput.includes('concentration') || lowerInput.includes('pomodoro')) {
      return "Focus is essential for deep work! I can help you use focus techniques like Pomodoro, track your focus sessions, and analyze your concentration patterns. The Focus section has everything you need.";
    }
    
    if (lowerInput.includes('mindset') || lowerInput.includes('vision') || lowerInput.includes('belief')) {
      return "Mindset shapes everything! I can help you clarify your vision, define core values, and develop empowering beliefs. The Mindset section is perfect for personal development work.";
    }
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
      return "Hello! I'm here to help you maximize your productivity and achieve your goals. What area of your life would you like to improve today?";
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return "I'm your comprehensive productivity assistant! I can help you with:\n\n📋 Task & Project Management\n🎯 Habit Tracking\n📝 Journaling & Notes\n⏰ Time Design & Scheduling\n🏆 Goal Setting & Planning\n💪 Energy & Fitness\n🧘 Focus & Concentration\n🧠 Mindset & Vision\n\nWhat would you like to work on?";
    }
    
    // Default response
    return "That's an interesting question! I'm here to help you with productivity, goal achievement, and personal growth. Could you be more specific about what you'd like assistance with? I can help with tasks, habits, journaling, time management, goals, fitness, focus, or mindset development.";
  };

  const handleVoiceInput = () => {
    if (!isSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support speech recognition",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed top-16 right-6 w-96 h-[600px] z-50"
    >
      <Card className="h-full bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-xl border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="pb-4 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/30 to-orange-500/30 flex items-center justify-center shadow-lg shadow-primary/25 relative overflow-hidden">
                <Bot className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-white text-lg font-bold">Nexus AI Assistant</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-glow"></div>
                  <span className="text-xs text-slate-300 font-medium">Online & Ready</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-200 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-primary to-orange-500 text-white'
                        : 'bg-slate-800/50 text-slate-200 border border-slate-700/50'
                    }`}>
                      <div className="text-sm leading-relaxed">{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-white/70' : 'text-slate-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-slate-400">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your productivity..."
                  className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 pr-20"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceInput}
                    disabled={isLoading || !isSupported}
                    className={`h-8 w-8 ${
                      isListening 
                        ? "text-red-400 hover:text-red-300 animate-pulse" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {["Help me with tasks", "Track habits", "Start journaling", "Focus session", "Set goals"].map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendMessage(suggestion)}
                  className="text-xs bg-slate-800/30 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-all duration-200"
                  disabled={isLoading}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIAssistant;