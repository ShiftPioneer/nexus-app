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
      if (process.env.NODE_ENV === 'development') {
        console.error('AI Assistant error:', error);
      }
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
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-16 right-4 w-80 sm:w-96 h-[32rem] sm:h-[36rem] z-[60] max-h-[calc(100vh-5rem)]"
    >
      <Card className="h-full bg-slate-950/95 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Header */}
        <CardHeader className="pb-3 pt-4 px-4 border-b border-primary/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center shadow-lg border border-primary/30">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-slate-900 animate-pulse shadow-glow"></div>
              </div>
              <div>
                <CardTitle className="text-white text-base font-bold">Nexus AI</CardTitle>
                <p className="text-xs text-muted font-medium">Your Smart Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 text-muted hover:text-white hover:bg-slate-800/60 transition-all duration-200 rounded-lg border border-transparent hover:border-primary/30"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="p-0 flex flex-col h-full max-h-full">
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-4 py-3 space-y-4 min-h-full">
              <AnimatePresence mode="popLayout">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex gap-3 max-w-[85%]">
                      {message.type === 'assistant' && (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30 shadow-md">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className={`rounded-2xl px-4 py-3 max-w-full ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg border border-primary/20'
                          : 'bg-slate-800/80 text-slate-100 border border-slate-700/50 shadow-lg backdrop-blur-sm'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.content}</div>
                        <div className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-white/70' : 'text-slate-400'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30 shadow-md">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-slate-300 font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
            {/* Input Mode Selector */}
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-300">Input Mode</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="sm"
                    onClick={handleVoiceInput}
                    disabled={isLoading || !isSupported}
                    className="h-7 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 transition-all duration-200"
                  >
                    {isListening ? <MicOff className="h-3 w-3 mr-1" /> : <Mic className="h-3 w-3 mr-1" />}
                    {isListening ? "Stop" : "Voice"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 transition-all duration-200"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                </div>
              </div>
              
              {/* Voice Status Indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-error/10 border border-error/30 mb-3"
                >
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-xs text-error font-medium">Listening... Speak now</span>
                </motion.div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 pb-3">
              <div className="flex flex-wrap gap-1.5">
                {["Help with tasks", "Track habits", "Focus session", "Set goals"].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(suggestion)}
                    className="text-xs h-6 px-2 bg-slate-800/40 border-slate-600/60 text-slate-300 hover:bg-slate-700/60 hover:text-white hover:border-primary/40 transition-all duration-200 rounded-md"
                    disabled={isLoading}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Main Input Field */}
            <div className="px-4 pb-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Voice input active..." : "Type your message..."}
                    className="bg-slate-800/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 rounded-xl min-h-[44px] resize-none"
                    disabled={isLoading || isListening}
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-4 h-11 shadow-lg transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AIAssistant;