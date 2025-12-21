import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Mic, MicOff, Loader2, MessageCircle, X, Check, XCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useActions } from "@/components/actions/ActionsContext";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  toolCall?: ToolCall;
  toolStatus?: "pending" | "confirmed" | "cancelled";
}

interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, any>;
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
      content:
        "Hi! I'm your Nexus AI Assistant. I can help you manage tasks, habits, journal entries, time design activities, and more. Try saying \"Add a task to review my goals\" or \"Show me my pending tasks\"!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get actions context for task management
  const actionsContext = useActionsContext();

  const {
    isListening,
    transcript,
    error: speechError,
    errorCode,
    isSupported,
    isSecureContext,
    startListening,
    stopListening,
    resetTranscript,
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
      inputRef.current?.focus();
    }
  }, [transcript, isListening, resetTranscript]);

  useEffect(() => {
    if (speechError) {
      toast({
        title: "Voice Input Issue",
        description: speechError,
        variant: "destructive",
      });
    }
  }, [speechError, toast]);

  const executeToolCall = useCallback((toolCall: ToolCall): string => {
    if (!actionsContext) {
      return "Unable to access task management. Please navigate to the Actions page first.";
    }

    const { tasks, handleCreateTask, handleTaskComplete, handleTaskDelete, updateTask } = actionsContext;

    switch (toolCall.name) {
      case "create_task": {
        const { title, description, urgent, important, category, type, dueDate } = toolCall.arguments;
        handleCreateTask({
          title,
          description: description || "",
          urgent: urgent || false,
          important: important || false,
          category: category || "General",
          dueDate: dueDate ? new Date(dueDate) : undefined,
        }, type || "todo");
        return `Created ${type === 'not-todo' ? 'avoidance item' : 'task'}: "${title}"`;
      }

      case "complete_task": {
        const { taskTitle } = toolCall.arguments;
        const task = findTaskByTitle(tasks, taskTitle);
        if (task) {
          handleTaskComplete(task.id);
          return `Marked "${task.title}" as completed!`;
        }
        return `Couldn't find a task matching "${taskTitle}".`;
      }

      case "delete_task": {
        const { taskTitle } = toolCall.arguments;
        const task = findTaskByTitle(tasks, taskTitle);
        if (task) {
          handleTaskDelete(task.id);
          return `Deleted task: "${task.title}"`;
        }
        return `Couldn't find a task matching "${taskTitle}".`;
      }

      case "update_task": {
        const { taskTitle, updates } = toolCall.arguments;
        const task = findTaskByTitle(tasks, taskTitle);
        if (task) {
          const processedUpdates: Record<string, any> = { ...updates };
          if (updates.dueDate) {
            processedUpdates.dueDate = new Date(updates.dueDate);
          }
          updateTask(task.id, processedUpdates);
          return `Updated task: "${task.title}"`;
        }
        return `Couldn't find a task matching "${taskTitle}".`;
      }

      case "list_tasks": {
        const { filter, type } = toolCall.arguments;
        let filteredTasks = tasks.filter(t => !t.deleted);
        
        if (type && type !== 'all') {
          filteredTasks = filteredTasks.filter(t => t.type === type);
        }
        
        if (filter === 'completed') {
          filteredTasks = filteredTasks.filter(t => t.completed);
        } else if (filter === 'pending') {
          filteredTasks = filteredTasks.filter(t => !t.completed);
        } else if (filter === 'urgent') {
          filteredTasks = filteredTasks.filter(t => t.urgent);
        } else if (filter === 'important') {
          filteredTasks = filteredTasks.filter(t => t.important);
        }

        if (filteredTasks.length === 0) {
          return "No tasks found matching your criteria.";
        }

        const summary = filteredTasks.slice(0, 5).map(t => 
          `• ${t.title} ${t.completed ? '✓' : ''} ${t.urgent ? '🔴' : ''} ${t.important ? '⭐' : ''}`
        ).join('\n');

        return `Found ${filteredTasks.length} task(s):\n${summary}${filteredTasks.length > 5 ? `\n...and ${filteredTasks.length - 5} more` : ''}`;
      }

      default:
        return "Unknown action requested.";
    }
  }, [actionsContext]);

  const handleConfirmToolCall = useCallback((messageId: string, toolCall: ToolCall) => {
    const result = executeToolCall(toolCall);
    
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, toolStatus: "confirmed" as const } : msg
    ));

    // Add result message
    const resultMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: result,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, resultMessage]);

    toast({
      title: "Action Completed",
      description: result,
    });
  }, [executeToolCall, toast]);

  const handleCancelToolCall = useCallback((messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, toolStatus: "cancelled" as const } : msg
    ));

    const cancelMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: "Action cancelled. Is there anything else I can help you with?",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, cancelMessage]);
  }, []);

  const callAIAssistant = async (content: string) => {
    const conversationHistory = messages
      .slice(-12)
      .map((m) => ({ type: m.type, content: m.content }));

    // Include current tasks for context
    const currentTasks = actionsContext?.tasks || [];

    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: {
        message: content,
        conversationHistory,
        currentTasks: currentTasks.map(t => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          urgent: t.urgent,
          important: t.important,
          category: t.category,
          type: t.type,
          deleted: t.deleted,
        })),
      },
    });

    if (error) throw error;
    if (data?.error && !data?.response) throw new Error(data.error);
    
    return {
      response: (data?.response as string) || "Sorry — I couldn't generate a response.",
      toolCall: data?.toolCall as ToolCall | undefined,
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const { response, toolCall } = await callAIAssistant(content.trim());

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response,
        timestamp: new Date(),
        toolCall,
        toolStatus: toolCall ? "pending" : undefined,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error: any) {
      console.error("AI Assistant error:", error);

      toast({
        title: "AI Assistant Error",
        description:
          error?.message ||
          "Couldn't reach the AI assistant. Please make sure you're logged in and try again.",
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content:
            "I couldn't respond right now. Try again in a moment (or re-login if the session expired).",
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!isSupported) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.",
        variant: "destructive",
      });
      return;
    }

    if (!isSecureContext) {
      toast({
        title: "Secure Connection Required",
        description: "Voice input requires HTTPS. Please use text input instead.",
        variant: "destructive",
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

  const handleTextMode = () => {
    if (isListening) stopListening();
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
              aria-label="Close AI assistant"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

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
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex flex-col gap-2 max-w-[85%]">
                      <div className="flex gap-3">
                        {message.type === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30 shadow-md">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-3 max-w-full ${
                            message.type === "user"
                              ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg border border-primary/20"
                              : "bg-slate-800/80 text-slate-100 border border-slate-700/50 shadow-lg backdrop-blur-sm"
                          }`}
                        >
                          <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-2 ${
                              message.type === "user" ? "text-white/70" : "text-slate-400"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Tool Call Confirmation UI */}
                      {message.toolCall && message.toolStatus === "pending" && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="ml-10 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-400" />
                            <span className="text-xs font-medium text-amber-300">Action Required</span>
                          </div>
                          <p className="text-xs text-slate-300 mb-3">
                            {getToolActionDescription(message.toolCall)}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleConfirmToolCall(message.id, message.toolCall!)}
                              className="h-7 px-3 text-xs bg-success/20 hover:bg-success/30 text-success border border-success/30"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelToolCall(message.id)}
                              className="h-7 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 text-slate-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {message.toolStatus === "confirmed" && (
                        <div className="ml-10 flex items-center gap-2 text-xs text-success">
                          <Check className="h-3 w-3" />
                          <span>Action completed</span>
                        </div>
                      )}

                      {message.toolStatus === "cancelled" && (
                        <div className="ml-10 flex items-center gap-2 text-xs text-slate-400">
                          <XCircle className="h-3 w-3" />
                          <span>Action cancelled</span>
                        </div>
                      )}
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
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span className="text-sm text-slate-300 font-medium">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm">
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-300">Input Mode</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={isListening ? "default" : "outline"}
                    size="sm"
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className={`h-7 px-3 text-xs transition-all duration-200 ${
                      !isSupported || !isSecureContext
                        ? "opacity-50 cursor-not-allowed bg-slate-800/60 border-slate-600/60"
                        : "bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80"
                    }`}
                    aria-label={isListening ? "Stop voice input" : "Start voice input"}
                    title={!isSupported ? "Voice not supported in this browser" : !isSecureContext ? "HTTPS required for voice" : ""}
                  >
                    {isListening ? (
                      <MicOff className="h-3 w-3 mr-1" />
                    ) : (
                      <Mic className="h-3 w-3 mr-1" />
                    )}
                    {isListening ? "Stop" : "Voice"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTextMode}
                    disabled={isLoading}
                    className="h-7 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 transition-all duration-200"
                    aria-label="Text input"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                </div>
              </div>

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

              {speechError && errorCode === 'network' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-3"
                >
                  <AlertTriangle className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-300">Voice requires a stable connection. Please use text input instead.</span>
                </motion.div>
              )}
            </div>

            <div className="px-4 pb-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={isListening ? "Voice input active..." : "Type your message..."}
                    className="bg-slate-800/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 rounded-xl min-h-[44px]"
                    disabled={isLoading}
                    aria-label="AI assistant message"
                  />
                </div>
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-xl px-4 h-11 shadow-lg transition-all duration-200 disabled:opacity-50 flex-shrink-0"
                  aria-label="Send message"
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

// Safe wrapper to use ActionsContext (may not be available on all pages)
function useActionsContext() {
  try {
    return useActions();
  } catch {
    return null;
  }
}

// Helper to find task by title (fuzzy match)
function findTaskByTitle(tasks: any[], searchTitle: string) {
  const normalizedSearch = searchTitle.toLowerCase().trim();
  
  // Exact match first
  const exactMatch = tasks.find(t => 
    !t.deleted && t.title.toLowerCase() === normalizedSearch
  );
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = tasks.find(t => 
    !t.deleted && t.title.toLowerCase().includes(normalizedSearch)
  );
  if (partialMatch) return partialMatch;
  
  // Search term in task title
  const containsMatch = tasks.find(t => 
    !t.deleted && normalizedSearch.includes(t.title.toLowerCase())
  );
  return containsMatch;
}

// Generate human-readable description of tool action
function getToolActionDescription(toolCall: ToolCall): string {
  switch (toolCall.name) {
    case "create_task":
      const type = toolCall.arguments.type === 'not-todo' ? 'avoidance item' : 'task';
      let desc = `Create ${type}: "${toolCall.arguments.title}"`;
      if (toolCall.arguments.urgent) desc += ' (Urgent)';
      if (toolCall.arguments.important) desc += ' (Important)';
      if (toolCall.arguments.category) desc += ` in ${toolCall.arguments.category}`;
      return desc;
    case "complete_task":
      return `Mark as completed: "${toolCall.arguments.taskTitle}"`;
    case "delete_task":
      return `Delete task: "${toolCall.arguments.taskTitle}"`;
    case "update_task":
      return `Update task: "${toolCall.arguments.taskTitle}"`;
    case "list_tasks":
      return "List your current tasks";
    default:
      return "Perform an action";
  }
}

export default AIAssistant;