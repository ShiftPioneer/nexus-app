import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Mic, MicOff, Loader2, MessageCircle, X, Check, XCircle, AlertTriangle, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useScribe } from "@elevenlabs/react";
import { useUnifiedTasks } from "@/contexts/UnifiedTasksContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
        "Hi! I'm Nexus AI, your productivity companion. I can help you manage tasks, track habits, journal entries, schedule activities, and set goals. Try saying \"Add a task to review my goals\" or \"Show me my habits\"!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnectingVoice, setIsConnectingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Get unified tasks context for task management
  const tasksContext = useTasksContext();

  // ElevenLabs Scribe for voice transcription
  const scribe = useScribe({
    onPartialTranscript: (data) => {
      setInputValue(data.text);
    },
    onCommittedTranscript: (data) => {
      setInputValue(prev => prev + " " + data.text);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-fullscreen on mobile
  useEffect(() => {
    if (isMobile && isOpen) {
      setIsFullscreen(true);
    }
  }, [isMobile, isOpen]);

  const executeToolCall = useCallback((toolCall: ToolCall): string => {
    if (!tasksContext) {
      return "Unable to access task management. Please navigate to the Actions page first.";
    }

    const { tasks, addTask, completeTask, deleteTask, updateTask } = tasksContext;

    switch (toolCall.name) {
      // ============ TASK OPERATIONS ============
      case "create_task": {
        const { title, description, urgent, important, category, type } = toolCall.arguments;
        addTask({
          title,
          description: description || "",
          type: type || "todo",
          status: "active",
          priority: urgent && important ? "urgent" : important ? "high" : urgent ? "medium" : "low",
          category: category || "general",
          urgent: urgent || false,
          important: important || false,
          clarified: true,
          completed: false,
        });
        return `✅ Created ${type === 'not-todo' ? 'avoidance item' : 'task'}: "${title}"`;
      }

      case "complete_task": {
        const { taskTitle } = toolCall.arguments;
        const task = findTaskByTitle(tasks, taskTitle);
        if (task) {
          completeTask(task.id);
          return `✅ Marked "${task.title}" as completed!`;
        }
        return `❌ Couldn't find a task matching "${taskTitle}".`;
      }

      case "delete_task": {
        const { taskTitle } = toolCall.arguments;
        const task = findTaskByTitle(tasks, taskTitle);
        if (task) {
          deleteTask(task.id);
          return `🗑️ Deleted task: "${task.title}"`;
        }
        return `❌ Couldn't find a task matching "${taskTitle}".`;
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
          return `✏️ Updated task: "${task.title}"`;
        }
        return `❌ Couldn't find a task matching "${taskTitle}".`;
      }

      case "list_tasks": {
        const { filter, type } = toolCall.arguments;
        let filteredTasks = tasks.filter(t => t.status !== 'deleted');
        
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
          return "📋 No tasks found matching your criteria.";
        }

        const summary = filteredTasks.slice(0, 5).map(t => 
          `• ${t.title} ${t.completed ? '✓' : ''} ${t.urgent ? '🔴' : ''} ${t.important ? '⭐' : ''}`
        ).join('\n');

        return `📋 Found ${filteredTasks.length} task(s):\n${summary}${filteredTasks.length > 5 ? `\n...and ${filteredTasks.length - 5} more` : ''}`;
      }

      // ============ HABIT OPERATIONS ============
      case "create_habit": {
        const { title, category, frequency, dailyTarget, description } = toolCall.arguments;
        // Store in localStorage for now (habits are stored locally)
        const habitsKey = 'nexus-habits';
        const stored = localStorage.getItem(habitsKey);
        const habits = stored ? JSON.parse(stored) : [];
        const newHabit = {
          id: Date.now().toString(),
          title,
          category: category || 'other',
          frequency: frequency || 'daily',
          dailyTarget: dailyTarget || 1,
          description: description || '',
          streak: 0,
          completionDates: [],
          completionHistory: [],
          todayCompletions: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        habits.push(newHabit);
        localStorage.setItem(habitsKey, JSON.stringify(habits));
        return `✅ Created habit: "${title}" in ${category} category`;
      }

      case "complete_habit": {
        const { habitTitle } = toolCall.arguments;
        const habitsKey = 'nexus-habits';
        const stored = localStorage.getItem(habitsKey);
        const habits = stored ? JSON.parse(stored) : [];
        const habitIndex = habits.findIndex((h: any) => 
          h.title.toLowerCase().includes(habitTitle.toLowerCase())
        );
        if (habitIndex >= 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          habits[habitIndex].completionDates.push(today.toISOString());
          habits[habitIndex].todayCompletions = (habits[habitIndex].todayCompletions || 0) + 1;
          habits[habitIndex].streak = (habits[habitIndex].streak || 0) + 1;
          localStorage.setItem(habitsKey, JSON.stringify(habits));
          return `✅ Marked habit "${habits[habitIndex].title}" as completed! 🔥 ${habits[habitIndex].streak} day streak!`;
        }
        return `❌ Couldn't find a habit matching "${habitTitle}".`;
      }

      case "list_habits": {
        const habitsKey = 'nexus-habits';
        const stored = localStorage.getItem(habitsKey);
        const habits = stored ? JSON.parse(stored) : [];
        
        if (habits.length === 0) {
          return "🔄 No habits tracked yet. Would you like to create one?";
        }

        const today = new Date().toDateString();
        const summary = habits.slice(0, 5).map((h: any) => {
          const completedToday = h.completionDates?.some((d: string) => 
            new Date(d).toDateString() === today
          );
          return `• ${h.title} ${completedToday ? '✓' : '○'} [${h.category}] - 🔥${h.streak || 0}`;
        }).join('\n');

        return `🔄 Your habits:\n${summary}`;
      }

      // ============ JOURNAL OPERATIONS ============
      case "create_journal_entry": {
        const { title, content, mood, tags } = toolCall.arguments;
        const journalKey = 'nexus-journal-entries';
        const stored = localStorage.getItem(journalKey);
        const entries = stored ? JSON.parse(stored) : [];
        const newEntry = {
          id: Date.now().toString(),
          title,
          content,
          mood,
          tags: tags || [],
          date: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
        };
        entries.unshift(newEntry);
        localStorage.setItem(journalKey, JSON.stringify(entries));
        return `📔 Created journal entry: "${title}"`;
      }

      case "list_journal_entries": {
        const journalKey = 'nexus-journal-entries';
        const stored = localStorage.getItem(journalKey);
        const entries = stored ? JSON.parse(stored) : [];
        
        if (entries.length === 0) {
          return "📔 No journal entries yet. Would you like to write one?";
        }

        const moodEmojis: Record<string, string> = { 
          amazing: '🌟', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' 
        };
        const limit = toolCall.arguments.limit || 5;
        const summary = entries.slice(0, limit).map((e: any) => 
          `• ${e.date}: "${e.title}" ${moodEmojis[e.mood] || ''}`
        ).join('\n');

        return `📔 Recent journal entries:\n${summary}`;
      }

      // ============ ACTIVITY OPERATIONS ============
      case "create_activity": {
        const { title, startTime, endTime, category, description, color } = toolCall.arguments;
        const activitiesKey = 'nexus-time-activities';
        const stored = localStorage.getItem(activitiesKey);
        const activities = stored ? JSON.parse(stored) : [];
        const newActivity = {
          id: Date.now().toString(),
          title,
          startTime,
          endTime,
          category: category || 'personal',
          description: description || '',
          color: color || '#FF6500',
          createdAt: new Date().toISOString(),
        };
        activities.push(newActivity);
        localStorage.setItem(activitiesKey, JSON.stringify(activities));
        return `📅 Scheduled: "${title}" from ${new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      case "list_activities": {
        const activitiesKey = 'nexus-time-activities';
        const stored = localStorage.getItem(activitiesKey);
        const activities = stored ? JSON.parse(stored) : [];
        const date = toolCall.arguments.date || new Date().toISOString().split('T')[0];
        
        const dayActivities = activities.filter((a: any) => 
          a.startTime?.startsWith(date)
        );
        
        if (dayActivities.length === 0) {
          return `📅 No activities scheduled for ${date}.`;
        }

        const summary = dayActivities.map((a: any) => {
          const start = new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const end = new Date(a.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return `• ${start}-${end}: ${a.title}`;
        }).join('\n');

        return `📅 Schedule for ${date}:\n${summary}`;
      }

      // ============ GOAL OPERATIONS ============
      case "create_goal": {
        const { title, description, targetValue, unit, deadline } = toolCall.arguments;
        const goalsKey = 'nexus-goals';
        const stored = localStorage.getItem(goalsKey);
        const goals = stored ? JSON.parse(stored) : [];
        const newGoal = {
          id: Date.now().toString(),
          title,
          description: description || '',
          targetValue: targetValue || 100,
          currentValue: 0,
          unit: unit || '%',
          deadline: deadline || null,
          status: 'active',
          createdAt: new Date().toISOString(),
        };
        goals.push(newGoal);
        localStorage.setItem(goalsKey, JSON.stringify(goals));
        return `🎯 Created goal: "${title}"`;
      }

      case "update_goal_progress": {
        const { goalTitle, currentValue } = toolCall.arguments;
        const goalsKey = 'nexus-goals';
        const stored = localStorage.getItem(goalsKey);
        const goals = stored ? JSON.parse(stored) : [];
        const goalIndex = goals.findIndex((g: any) => 
          g.title.toLowerCase().includes(goalTitle.toLowerCase())
        );
        if (goalIndex >= 0) {
          goals[goalIndex].currentValue = currentValue;
          const progress = Math.round((currentValue / goals[goalIndex].targetValue) * 100);
          if (progress >= 100) {
            goals[goalIndex].status = 'completed';
          }
          localStorage.setItem(goalsKey, JSON.stringify(goals));
          return `🎯 Updated "${goals[goalIndex].title}" to ${progress}% complete!`;
        }
        return `❌ Couldn't find a goal matching "${goalTitle}".`;
      }

      case "list_goals": {
        const goalsKey = 'nexus-goals';
        const stored = localStorage.getItem(goalsKey);
        const goals = stored ? JSON.parse(stored) : [];
        
        if (goals.length === 0) {
          return "🎯 No goals set yet. Would you like to create one?";
        }

        const status = toolCall.arguments.status || 'active';
        let filteredGoals = goals;
        if (status !== 'all') {
          filteredGoals = goals.filter((g: any) => g.status === status);
        }

        const summary = filteredGoals.slice(0, 5).map((g: any) => {
          const progress = Math.round((g.currentValue / g.targetValue) * 100);
          return `• ${g.title}: ${progress}% ${g.status === 'completed' ? '✓' : ''}`;
        }).join('\n');

        return `🎯 Your goals:\n${summary}`;
      }

      // ============ SUMMARY OPERATIONS ============
      case "get_daily_summary": {
        const pendingTasks = tasks.filter(t => !t.completed && t.status !== 'deleted' && t.type === 'todo');
        const completedTasks = tasks.filter(t => t.completed && t.type === 'todo');
        
        const habitsKey = 'nexus-habits';
        const habitsStored = localStorage.getItem(habitsKey);
        const habits = habitsStored ? JSON.parse(habitsStored) : [];
        const today = new Date().toDateString();
        const completedHabits = habits.filter((h: any) => 
          h.completionDates?.some((d: string) => new Date(d).toDateString() === today)
        );

        return `📊 Daily Summary:

📋 Tasks: ${completedTasks.length} completed, ${pendingTasks.length} pending
🔄 Habits: ${completedHabits.length}/${habits.length} completed today

${pendingTasks.length > 0 ? `\nTop priorities:\n${pendingTasks.slice(0, 3).map(t => `• ${t.title}`).join('\n')}` : 'All caught up! 🎉'}`;
      }

      case "get_productivity_insights": {
        const completedTasks = tasks.filter(t => t.completed).length;
        const totalTasks = tasks.filter(t => t.status !== 'deleted').length;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const habitsKey = 'nexus-habits';
        const habitsStored = localStorage.getItem(habitsKey);
        const habits = habitsStored ? JSON.parse(habitsStored) : [];
        const avgStreak = habits.length > 0 
          ? Math.round(habits.reduce((acc: number, h: any) => acc + (h.streak || 0), 0) / habits.length)
          : 0;

        return `💡 Productivity Insights:

📈 Task completion rate: ${completionRate}%
🔥 Average habit streak: ${avgStreak} days
📋 Total tasks: ${totalTasks}
🔄 Active habits: ${habits.length}

${completionRate >= 70 ? "Great job! You're on fire! 🔥" : completionRate >= 50 ? "Good progress! Keep pushing! 💪" : "Let's focus on completing more tasks today! 🎯"}`;
      }

      default:
        return "Unknown action requested.";
    }
  }, [tasksContext]);

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
      description: result.substring(0, 100),
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

    // Get current data from various sources
    const currentTasks = tasksContext?.tasks || [];
    
    // Get habits from localStorage
    const habitsKey = 'nexus-habits';
    const habitsStored = localStorage.getItem(habitsKey);
    const currentHabits = habitsStored ? JSON.parse(habitsStored) : [];

    // Get activities from localStorage
    const activitiesKey = 'nexus-time-activities';
    const activitiesStored = localStorage.getItem(activitiesKey);
    const currentActivities = activitiesStored ? JSON.parse(activitiesStored) : [];

    // Get goals from localStorage
    const goalsKey = 'nexus-goals';
    const goalsStored = localStorage.getItem(goalsKey);
    const currentGoals = goalsStored ? JSON.parse(goalsStored) : [];

    // Get journal entries from localStorage
    const journalKey = 'nexus-journal-entries';
    const journalStored = localStorage.getItem(journalKey);
    const currentJournalEntries = journalStored ? JSON.parse(journalStored) : [];

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
          status: t.status,
        })),
        currentHabits,
        currentActivities,
        currentGoals,
        currentJournalEntries: currentJournalEntries.slice(0, 5),
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

  const handleVoiceInput = async () => {
    if (scribe.isConnected) {
      scribe.disconnect();
      return;
    }

    setIsConnectingVoice(true);
    
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // Get token from edge function
      const { data, error } = await supabase.functions.invoke("elevenlabs-scribe-token");
      
      if (error || !data?.token) {
        throw new Error(error?.message || "Failed to get voice token");
      }

      await scribe.connect({
        token: data.token,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
    } catch (error: any) {
      console.error("Voice input error:", error);
      toast({
        title: "Voice Input Error",
        description: error.message || "Failed to start voice input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnectingVoice(false);
    }
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

  const containerClass = isFullscreen
    ? "fixed inset-0 z-[100]"
    : "fixed top-16 right-4 w-80 sm:w-96 h-[32rem] sm:h-[36rem] z-[60] max-h-[calc(100vh-5rem)]";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={containerClass}
    >
      <Card className="h-full bg-slate-950/98 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 overflow-hidden flex flex-col">
        <CardHeader className="pb-3 pt-4 px-4 border-b border-primary/20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 flex-shrink-0">
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
            <div className="flex items-center gap-1">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8 w-8 text-muted hover:text-white hover:bg-slate-800/60 transition-all duration-200 rounded-lg border border-transparent hover:border-primary/30"
                  aria-label={isFullscreen ? "Minimize" : "Maximize"}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              )}
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
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col flex-1 min-h-0">
          <ScrollArea className="flex-1">
            <div className="px-4 py-3 space-y-4">
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
                    <div className="flex flex-col gap-2 max-w-[90%] sm:max-w-[85%]">
                      <div className="flex gap-2 sm:gap-3">
                        {message.type === "assistant" && (
                          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30 shadow-md">
                            <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-full ${
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
                          className="ml-8 sm:ml-10 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
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
                              className="h-8 px-3 text-xs bg-success/20 hover:bg-success/30 text-success border border-success/30"
                            >
                              <Check className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelToolCall(message.id)}
                              className="h-8 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 text-slate-300"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </motion.div>
                      )}

                      {message.toolStatus === "confirmed" && (
                        <div className="ml-8 sm:ml-10 flex items-center gap-2 text-xs text-success">
                          <Check className="h-3 w-3" />
                          <span>Action completed</span>
                        </div>
                      )}

                      {message.toolStatus === "cancelled" && (
                        <div className="ml-8 sm:ml-10 flex items-center gap-2 text-xs text-slate-400">
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
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary/30 shadow-md">
                      <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
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

          <div className="border-t border-slate-700/50 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm flex-shrink-0">
            <div className="px-3 sm:px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-300">Input Mode</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={scribe.isConnected ? "default" : "outline"}
                    size="sm"
                    onClick={handleVoiceInput}
                    disabled={isLoading || isConnectingVoice}
                    className={`h-8 px-3 text-xs transition-all duration-200 ${
                      scribe.isConnected 
                        ? "bg-error/80 hover:bg-error text-white border-error" 
                        : "bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80"
                    }`}
                    aria-label={scribe.isConnected ? "Stop voice input" : "Start voice input"}
                  >
                    {isConnectingVoice ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : scribe.isConnected ? (
                      <MicOff className="h-3 w-3 mr-1" />
                    ) : (
                      <Mic className="h-3 w-3 mr-1" />
                    )}
                    {isConnectingVoice ? "Connecting..." : scribe.isConnected ? "Stop" : "Voice"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (scribe.isConnected) scribe.disconnect();
                      inputRef.current?.focus();
                    }}
                    disabled={isLoading}
                    className="h-8 px-3 text-xs bg-slate-800/60 border-slate-600/60 hover:bg-slate-700/80 transition-all duration-200"
                    aria-label="Text input"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Text
                  </Button>
                </div>
              </div>

              {scribe.isConnected && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-error/10 border border-error/30 mb-3"
                >
                  <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                  <span className="text-xs text-error font-medium">Listening... Speak now</span>
                </motion.div>
              )}

              {scribe.partialTranscript && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 rounded-lg bg-primary/10 border border-primary/30 mb-3"
                >
                  <span className="text-xs text-primary font-medium italic">"{scribe.partialTranscript}"</span>
                </motion.div>
              )}
            </div>

            <div className="px-3 sm:px-4 pb-4">
              <div className="flex gap-2 sm:gap-3 items-end">
                <div className="flex-1">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={scribe.isConnected ? "Voice input active..." : "Type your message..."}
                    className="bg-slate-800/60 border-slate-600/60 text-white placeholder-slate-400 focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200 rounded-xl min-h-[44px] text-base"
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

// Safe wrapper to use UnifiedTasksContext (may not be available on all pages)
function useTasksContext() {
  try {
    return useUnifiedTasks();
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
    // Task tools
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
    
    // Habit tools
    case "create_habit":
      return `Create habit: "${toolCall.arguments.title}" in ${toolCall.arguments.category}`;
    case "complete_habit":
      return `Mark habit completed: "${toolCall.arguments.habitTitle}"`;
    case "list_habits":
      return "List your habits";
    
    // Journal tools
    case "create_journal_entry":
      return `Create journal entry: "${toolCall.arguments.title}"`;
    case "list_journal_entries":
      return "List recent journal entries";
    
    // Activity tools
    case "create_activity":
      return `Schedule activity: "${toolCall.arguments.title}"`;
    case "list_activities":
      return "List scheduled activities";
    
    // Goal tools
    case "create_goal":
      return `Create goal: "${toolCall.arguments.title}"`;
    case "update_goal_progress":
      return `Update goal progress: "${toolCall.arguments.goalTitle}"`;
    case "list_goals":
      return "List your goals";
    
    // Summary tools
    case "get_daily_summary":
      return "Get your daily summary";
    case "get_productivity_insights":
      return "Get productivity insights";
    
    default:
      return "Perform an action";
  }
}

export default AIAssistant;
