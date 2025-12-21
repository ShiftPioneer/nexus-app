import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

// Define the tools for task management
const tools = [
  {
    type: "function",
    function: {
      name: "create_task",
      description: "Create a new task or action item for the user. Use this when the user asks to add, create, or schedule a task.",
      parameters: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "The title or name of the task"
          },
          description: {
            type: "string",
            description: "Optional description or details about the task"
          },
          urgent: {
            type: "boolean",
            description: "Whether the task is urgent (time-sensitive)"
          },
          important: {
            type: "boolean",
            description: "Whether the task is important (high impact)"
          },
          category: {
            type: "string",
            description: "Category for the task (e.g., Work, Personal, Health, Finance)"
          },
          type: {
            type: "string",
            enum: ["todo", "not-todo"],
            description: "Type of task: 'todo' for things to do, 'not-todo' for things to avoid"
          },
          dueDate: {
            type: "string",
            description: "Optional due date in ISO format (YYYY-MM-DD)"
          }
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
          taskTitle: {
            type: "string",
            description: "The title or description of the task to complete (will match closest)"
          }
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
          taskTitle: {
            type: "string",
            description: "The title or description of the task to delete (will match closest)"
          }
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
          filter: {
            type: "string",
            enum: ["all", "completed", "pending", "urgent", "important"],
            description: "Filter to apply when listing tasks"
          },
          type: {
            type: "string",
            enum: ["todo", "not-todo", "all"],
            description: "Type of tasks to list"
          }
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
          taskTitle: {
            type: "string",
            description: "The title or description of the task to update (will match closest)"
          },
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

    const { message, conversationHistory, currentTasks } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Build context about current tasks if provided
    let taskContext = '';
    if (currentTasks && Array.isArray(currentTasks) && currentTasks.length > 0) {
      const activeTasks = currentTasks.filter((t: any) => !t.deleted);
      const todoTasks = activeTasks.filter((t: any) => t.type === 'todo');
      const notTodoTasks = activeTasks.filter((t: any) => t.type === 'not-todo');
      
      taskContext = `\n\nCURRENT USER TASKS:
To-Do Tasks (${todoTasks.length}):
${todoTasks.map((t: any) => `- "${t.title}" [${t.completed ? 'COMPLETED' : 'PENDING'}] ${t.urgent ? '[URGENT]' : ''} ${t.important ? '[IMPORTANT]' : ''} Category: ${t.category || 'General'}`).join('\n') || 'No to-do tasks'}

Not-To-Do Items (${notTodoTasks.length}):
${notTodoTasks.map((t: any) => `- "${t.title}" [${t.completed ? 'AVOIDED' : 'ACTIVE'}]`).join('\n') || 'No not-to-do items'}
`;
    }

    // Build messages array for OpenAI-compatible API
    const systemPrompt = `You are the Nexus AI Assistant, an intelligent productivity companion integrated into the Nexus productivity platform. 

PLATFORM OVERVIEW:
Nexus is a comprehensive productivity and life management platform with these modules:
- Actions: Task and action management with "To Do" and "Not To Do" sections
- Habits: Habit tracking with streaks and progress analytics
- Journal: Productivity journaling with mood tracking and reflection prompts
- Planning: Goal and project management with SMART goals and OKRs
- Time Design: Calendar and time block management with activity scheduling
- Energy Hub: Workout tracking and meal planning
- Mindset: Vision boards, affirmations, and core values
- Knowledge: Note-taking and learning resource management
- Focus: Pomodoro timers and focus session tracking

YOUR CAPABILITIES:
You have tools to manage the user's tasks directly:
- create_task: Add new tasks or avoidance items
- complete_task: Mark tasks as done
- delete_task: Remove tasks
- update_task: Modify task properties
- list_tasks: Summarize current tasks

IMPORTANT RULES:
1. When the user asks you to perform an action (create, complete, delete, update a task), USE THE APPROPRIATE TOOL.
2. When you call a tool, the user will be asked to confirm before it executes.
3. Be specific when identifying tasks - use the exact title when possible.
4. For create_task, always determine if it's a "todo" (action to take) or "not-todo" (behavior to avoid).
5. Use Eisenhower prioritization: urgent = time-sensitive, important = high impact.

PERSONALITY:
- Be encouraging, motivational, and supportive
- Provide actionable advice and specific suggestions
- Ask clarifying questions when needed
- Be concise but helpful
- Use a friendly, professional tone
- Focus on productivity and personal growth
${taskContext}`;

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
    default:
      return `I'd like to perform an action. Please confirm to proceed.`;
  }
}