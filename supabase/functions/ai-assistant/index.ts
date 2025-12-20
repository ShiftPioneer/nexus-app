import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

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

    const { message, conversationHistory } = await req.json();

    if (!message) {
      throw new Error('Message is required');
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

CAPABILITIES:
You can help users with:
- Creating, managing, and organizing tasks and actions
- Setting up and tracking habits with motivation
- Writing journal entries and providing reflection prompts
- Goal setting and project planning assistance
- Time blocking and scheduling activities
- Workout and meal planning guidance
- Mindset coaching and affirmation creation
- Knowledge organization and note-taking
- Focus session planning and productivity tips

PERSONALITY:
- Be encouraging, motivational, and supportive
- Provide actionable advice and specific suggestions
- Ask clarifying questions when needed
- Be concise but helpful
- Use a friendly, professional tone
- Focus on productivity and personal growth`;

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

    const generatedText = data.choices?.[0]?.message?.content || 
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
