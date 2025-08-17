import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const googleAIApiKey = Deno.env.get('GOOGLE_AI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    // Build conversation context
    let conversationText = `You are the Nexus AI Assistant, an intelligent productivity companion integrated into the Nexus productivity platform. 

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
- Focus on productivity and personal growth

CONVERSATION HISTORY:
`;

    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        conversationText += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    }

    conversationText += `\nUser: ${message}\nAssistant:`;

    console.log('Sending request to Google AI with message:', message);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleAIApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationText
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Google AI API error:', error);
      throw new Error(`Google AI API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    console.log('Received response from Google AI:', data);

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
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