import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Define comprehensive tools for all app features
const tools = [
  // ============ TASK TOOLS ============
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a new task or action item for the user. Use this when the user asks to add, create, or schedule a task.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "The title or name of the task" },
          description: { type: "string", description: "Optional description or details about the task" },
          urgent: { type: "boolean", description: "Whether the task is urgent (time-sensitive)" },
          important: { type: "boolean", description: "Whether the task is important (high impact)" },
          category: { type: "string", description: "Category for the task (e.g., Work, Personal, Health, Finance)" },
          type: { type: "string", enum: ["todo", "not-todo"], description: "Type of task: 'todo' for things to do, 'not-todo' for things to avoid" },
          dueDate: { type: "string", description: "Optional due date in ISO format (YYYY-MM-DD)" }
        },
        required: ["title", "type"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "complete_task",
      description: "Mark a task as completed. Use when the user says they finished or completed a task.",
      parameters: {
        type: "object",
        properties: {
          taskTitle: { type: "string", description: "The title or description of the task to complete (will match closest)" }
        },
        required: ["taskTitle"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "delete_task",
      description: "Delete or remove a task. Use when the user wants to remove a task they no longer need.",
      parameters: {
        type: "object",
        properties: {
          taskTitle: { type: "string", description: "The title or description of the task to delete (will match closest)" }
        },
        required: ["taskTitle"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_tasks",
      description: "List and summarize the user's current tasks. Use when user asks about their tasks or to-do list.",
      parameters: {
        type: "object",
        properties: {
          filter: { type: "string", enum: ["all", "completed", "pending", "urgent", "important"], description: "Filter to apply when listing tasks" },
          type: { type: "string", enum: ["todo", "not-todo", "all"], description: "Type of tasks to list" }
        },
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_task",
      description: "Update an existing task's properties like title, priority, or due date.",
      parameters: {
        type: "object",
        properties: {
          taskTitle: { type: "string", description: "The title or description of the task to update (will match closest)" },
          updates: {
            type: "object",
            properties: {
              title: { type: "string", description: "New title for the task" },
              description: { type: "string", description: "New description" },
              urgent: { type: "boolean", description: "Mark as urgent or not" },
              important: { type: "boolean", description: "Mark as important or not" },
              category: { type: "string", description: "New category" },
              dueDate: { type: "string", description: "New due date (YYYY-MM-DD)" }
            },
            additionalProperties: false
          }
        },
        required: ["taskTitle", "updates"],
        additionalProperties: false
      }
    }
  },
  // ============ HABIT TOOLS ============
  {
    type: "function",
    function: {
      name: "create_habit",
      description: "Create a new habit for the user to track. Use when user wants to start tracking a new habit.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "The name of the habit" },
          category: { type: "string", enum: ["health", "productivity", "mindfulness", "learning", "fitness", "other"], description: "Category of the habit" },
          frequency: { type: "string", enum: ["daily", "weekly"], description: "How often the habit should be done" },
          dailyTarget: { type: "number", description: "How many times per day/week to complete the habit (default: 1)" },
          description: { type: "string", description: "Optional description of the habit" }
        },
        required: ["title", "category"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "complete_habit",
      description: "Mark a habit as completed for today. Use when user says they completed a habit.",
      parameters: {
        type: "object",
        properties: {
          habitTitle: { type: "string", description: "The title of the habit to mark complete" }
        },
        required: ["habitTitle"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_habits",
      description: "List and summarize the user's habits with their current streaks.",
      parameters: {
        type: "object",
        properties: {
          filter: { type: "string", enum: ["all", "completed_today", "pending_today"], description: "Filter habits" }
        },
        additionalProperties: false
      }
    }
  },
  // ============ JOURNAL TOOLS ============
  {
    type: "function",
    function: {
      name: "create_journal_entry",
      description: "Create a new journal entry. Use when user wants to write in their journal or log thoughts.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title for the journal entry" },
          content: { type: "string", description: "The main content/text of the journal entry" },
          mood: { type: "string", enum: ["amazing", "good", "neutral", "bad", "terrible"], description: "User's mood for this entry" },
          tags: { type: "array", items: { type: "string" }, description: "Tags to categorize the entry" }
        },
        required: ["title", "content", "mood"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_journal_entries",
      description: "List recent journal entries. Use when user asks about their journal or past entries.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "Maximum number of entries to return (default: 5)" },
          mood: { type: "string", enum: ["amazing", "good", "neutral", "bad", "terrible"], description: "Filter by mood" }
        },
        additionalProperties: false
      }
    }
  },
  // ============ TIME DESIGN TOOLS ============
  {
    type: "function",
    function: {
      name: "create_activity",
      description: "Create a new time block or activity in the calendar. Use when user wants to schedule or plan an activity.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Name of the activity" },
          startTime: { type: "string", description: "Start time in ISO format (YYYY-MM-DDTHH:MM:SS)" },
          endTime: { type: "string", description: "End time in ISO format (YYYY-MM-DDTHH:MM:SS)" },
          category: { type: "string", enum: ["work", "personal", "health", "learning", "social", "rest"], description: "Category of activity" },
          description: { type: "string", description: "Optional description" },
          color: { type: "string", description: "Color for the activity block (hex code)" }
        },
        required: ["title", "startTime", "endTime"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_activities",
      description: "List scheduled activities for today or a specific date.",
      parameters: {
        type: "object",
        properties: {
          date: { type: "string", description: "Date to list activities for (YYYY-MM-DD). Defaults to today." }
        },
        additionalProperties: false
      }
    }
  },
  // ============ PLANNING TOOLS ============
  {
    type: "function",
    function: {
      name: "create_goal",
      description: "Create a new goal for the user. Use when user wants to set a goal or objective.",
      parameters: {
        type: "object",
        properties: {
          title: { type: "string", description: "Name of the goal" },
          description: { type: "string", description: "Description of what the goal entails" },
          targetValue: { type: "number", description: "Target value to achieve (for measurable goals)" },
          unit: { type: "string", description: "Unit of measurement (e.g., books, miles, dollars)" },
          deadline: { type: "string", description: "Deadline in ISO format (YYYY-MM-DD)" }
        },
        required: ["title"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "update_goal_progress",
      description: "Update progress on an existing goal.",
      parameters: {
        type: "object",
        properties: {
          goalTitle: { type: "string", description: "Title of the goal to update" },
          currentValue: { type: "number", description: "New current value/progress" }
        },
        required: ["goalTitle", "currentValue"],
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_goals",
      description: "List the user's goals with their progress.",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["active", "completed", "all"], description: "Filter goals by status" }
        },
        additionalProperties: false
      }
    }
  },
  // ============ GENERAL TOOLS ============
  {
    type: "function",
    function: {
      name: "get_daily_summary",
      description: "Get a summary of the user's day including tasks, habits, and activities.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_productivity_insights",
      description: "Provide productivity insights and suggestions based on user's data.",
      parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    }
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with user's auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.error('Authentication failed:', authError?.message || 'No user found');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { message, conversationHistory, currentTasks, currentHabits, currentActivities, currentGoals, currentJournalEntries } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Build comprehensive context
    let contextSummary = '\n\n=== CURRENT USER DATA ===\n';
    
    // Tasks context
    if (currentTasks && Array.isArray(currentTasks) && currentTasks.length > 0) {
      const activeTasks = currentTasks.filter((t: any) => !t.deleted && t.status !== 'deleted');
      const todoTasks = activeTasks.filter((t: any) => t.type === 'todo');
      const notTodoTasks = activeTasks.filter((t: any) => t.type === 'not-todo');
      const pendingTasks = todoTasks.filter((t: any) => !t.completed);
      const completedToday = todoTasks.filter((t: any) => t.completed);
      
      contextSummary += `\n📋 TASKS (${pendingTasks.length} pending, ${completedToday.length} completed today):
${pendingTasks.slice(0, 10).map((t: any) => `  • "${t.title}" ${t.urgent ? '🔴' : ''} ${t.important ? '⭐' : ''} [${t.category || 'General'}]`).join('\n') || '  No pending tasks'}

❌ NOT-TO-DO ITEMS (${notTodoTasks.length}):
${notTodoTasks.slice(0, 5).map((t: any) => `  • "${t.title}"`).join('\n') || '  None set'}
`;
    }

    // Habits context
    if (currentHabits && Array.isArray(currentHabits) && currentHabits.length > 0) {
      const today = new Date().toDateString();
      const habitsWithStatus = currentHabits.map((h: any) => {
        const completedToday = h.completionDates?.some((d: any) => new Date(d).toDateString() === today);
        return { ...h, completedToday };
      });
      const completedHabits = habitsWithStatus.filter((h: any) => h.completedToday);
      const pendingHabits = habitsWithStatus.filter((h: any) => !h.completedToday);
      
      contextSummary += `\n🔄 HABITS (${completedHabits.length}/${currentHabits.length} completed today):
${pendingHabits.slice(0, 5).map((h: any) => `  • "${h.title}" [${h.category}] - ${h.streak || 0} day streak`).join('\n') || '  All habits completed!'}
`;
    }

    // Activities context
    if (currentActivities && Array.isArray(currentActivities) && currentActivities.length > 0) {
      const today = new Date().toISOString().split('T')[0];
      const todayActivities = currentActivities.filter((a: any) => a.startTime?.startsWith(today));
      
      contextSummary += `\n📅 TODAY'S SCHEDULE (${todayActivities.length} activities):
${todayActivities.slice(0, 5).map((a: any) => {
        const start = new Date(a.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const end = new Date(a.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `  • ${start}-${end}: "${a.title}" [${a.category || 'General'}]`;
      }).join('\n') || '  No activities scheduled'}
`;
    }

    // Goals context
    if (currentGoals && Array.isArray(currentGoals) && currentGoals.length > 0) {
      const activeGoals = currentGoals.filter((g: any) => g.status !== 'completed');
      contextSummary += `\n🎯 GOALS (${activeGoals.length} active):
${activeGoals.slice(0, 5).map((g: any) => {
        const progress = g.targetValue ? Math.round((g.currentValue / g.targetValue) * 100) : 0;
        return `  • "${g.title}" - ${progress}% complete`;
      }).join('\n') || '  No active goals'}
`;
    }

    // Journal context
    if (currentJournalEntries && Array.isArray(currentJournalEntries) && currentJournalEntries.length > 0) {
      const recentEntries = currentJournalEntries.slice(0, 3);
      const moodEmojis: Record<string, string> = { amazing: '🌟', good: '😊', neutral: '😐', bad: '😔', terrible: '😢' };
      contextSummary += `\n📔 RECENT JOURNAL ENTRIES:
${recentEntries.map((e: any) => `  • ${e.date}: "${e.title}" ${moodEmojis[e.mood] || ''}`).join('\n')}
`;
    }

    // Build messages array for OpenAI-compatible API
    const systemPrompt = `You are Nexus AI, an intelligent productivity assistant integrated into the Nexus life management platform. You help users stay productive, build habits, achieve goals, and manage their time effectively.

=== PLATFORM MODULES ===
• Actions: Task management with "To Do" and "Not To Do" items
• Habits: Daily/weekly habit tracking with streaks
• Journal: Productivity journaling with mood tracking
• Planning: Goal and project management (SMART goals, OKRs)
• Time Design: Calendar and time blocking
• Energy Hub: Workout and meal planning
• Mindset: Vision boards, affirmations, core values
• Knowledge: Note-taking and learning resources
• Focus: Pomodoro timers and focus sessions

=== YOUR CAPABILITIES ===
You have tools to manage:
✓ Tasks: create, complete, delete, update, list
✓ Habits: create, complete, list
✓ Journal: create entries, list entries
✓ Time Design: create activities, list schedule
✓ Goals: create, update progress, list

=== IMPORTANT RULES ===
1. When users ask to perform actions (add task, complete habit, etc.), USE THE APPROPRIATE TOOL
2. Tool calls require user confirmation before execution
3. Match items by title - use exact titles when possible
4. For tasks, determine if it's "todo" (action) or "not-todo" (avoidance)
5. Be proactive in suggesting improvements based on user data
6. Keep responses concise and actionable
7. Use emojis sparingly but effectively for clarity

=== PERSONALITY ===
• Encouraging and motivational
• Proactive with suggestions
• Concise but thorough
• Professional yet friendly
• Focus on productivity and personal growth
${contextSummary}`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    messages.push({ role: 'user', content: message });

    console.log('Sending request to Lovable AI Gateway for user:', user.id);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        tools: tools,
        tool_choice: 'auto',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Lovable AI Gateway error:', response.status, error);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded',
          response: "I'm receiving too many requests right now. Please try again in a moment."
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required',
          response: "AI credits have been exhausted. Please add more credits to continue."
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Received response from Lovable AI Gateway for user:', user.id);

    const choice = data.choices?.[0];
    const messageContent = choice?.message;

    // Check if the AI wants to call a tool
    if (messageContent?.tool_calls && messageContent.tool_calls.length > 0) {
      const toolCall = messageContent.tool_calls[0];
      const functionName = toolCall.function?.name;
      let functionArgs = {};
      
      try {
        functionArgs = JSON.parse(toolCall.function?.arguments || '{}');
      } catch (e) {
        console.error('Failed to parse tool arguments:', e);
      }

      console.log('AI wants to call tool:', functionName, 'with args:', functionArgs);

      return new Response(JSON.stringify({ 
        response: messageContent.content || getToolConfirmationMessage(functionName, functionArgs),
        toolCall: {
          id: toolCall.id,
          name: functionName,
          arguments: functionArgs
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const generatedText = messageContent?.content || 
                         "I'm sorry, I couldn't generate a response right now. Please try again.";

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      response: "I'm experiencing some technical difficulties right now. Please try again in a moment."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Generate user-friendly confirmation messages for tool calls
function getToolConfirmationMessage(toolName: string, args: any): string {
  switch (toolName) {
    // Task tools
    case 'create_task':
      const taskType = args.type === 'not-todo' ? 'avoidance item' : 'task';
      return `I'll create a new ${taskType} "${args.title}" for you. Please confirm to proceed.`;
    case 'complete_task':
      return `I'll mark "${args.taskTitle}" as completed. Please confirm to proceed.`;
    case 'delete_task':
      return `I'll delete the task "${args.taskTitle}". Please confirm to proceed.`;
    case 'update_task':
      return `I'll update the task "${args.taskTitle}" with your changes. Please confirm to proceed.`;
    case 'list_tasks':
      return `Here's a summary of your tasks...`;
    
    // Habit tools
    case 'create_habit':
      return `I'll create a new habit "${args.title}" in the ${args.category} category. Please confirm to proceed.`;
    case 'complete_habit':
      return `I'll mark your habit "${args.habitTitle}" as completed for today. Please confirm to proceed.`;
    case 'list_habits':
      return `Here's a summary of your habits...`;
    
    // Journal tools
    case 'create_journal_entry':
      return `I'll create a journal entry titled "${args.title}". Please confirm to proceed.`;
    case 'list_journal_entries':
      return `Here are your recent journal entries...`;
    
    // Activity tools
    case 'create_activity':
      return `I'll schedule "${args.title}" in your calendar. Please confirm to proceed.`;
    case 'list_activities':
      return `Here's your schedule...`;
    
    // Goal tools
    case 'create_goal':
      return `I'll create a new goal "${args.title}". Please confirm to proceed.`;
    case 'update_goal_progress':
      return `I'll update the progress on "${args.goalTitle}". Please confirm to proceed.`;
    case 'list_goals':
      return `Here are your goals...`;
    
    // Summary tools
    case 'get_daily_summary':
      return `Here's your daily summary...`;
    case 'get_productivity_insights':
      return `Here are your productivity insights...`;
    
    default:
      return `I'd like to perform an action. Please confirm to proceed.`;
  }
}
