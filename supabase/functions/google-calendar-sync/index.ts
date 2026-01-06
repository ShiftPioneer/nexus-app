import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-google-token',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization header exists
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

    // Get user to verify auth - getUser is more reliable than getSession for edge functions
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User auth error:', userError?.message || 'No user');
      return new Response(JSON.stringify({ error: 'Authentication failed' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Get provider token from request header (passed from client)
    // This is the Google OAuth token needed for Calendar API calls
    const googleToken = req.headers.get('x-google-token');
    
    if (!googleToken) {
      console.error('No Google token provided in x-google-token header');
      return new Response(JSON.stringify({ 
        error: 'No Google access token available. Please reconnect your Google account.',
        needsReconnect: true 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Google token received, length:', googleToken.length);

    const body = await req.json();
    const { action, events, timeMin, timeMax } = body;
    console.log('Google Calendar sync action:', action);

    if (action === 'fetch') {
      // Fetch events from Google Calendar
      const now = new Date();
      const defaultTimeMin = timeMin || now.toISOString();
      const defaultTimeMax = timeMax || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      calendarUrl.searchParams.set('timeMin', defaultTimeMin);
      calendarUrl.searchParams.set('timeMax', defaultTimeMax);
      calendarUrl.searchParams.set('singleEvents', 'true');
      calendarUrl.searchParams.set('orderBy', 'startTime');
      calendarUrl.searchParams.set('maxResults', '100');

      console.log('Fetching Google Calendar events from:', calendarUrl.toString());
      
      const response = await fetch(calendarUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${googleToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Calendar API error:', response.status, errorText);
        
        if (response.status === 401 || response.status === 403) {
          return new Response(JSON.stringify({ 
            error: 'Google token expired or invalid. Please reconnect your Google account.',
            needsReconnect: true 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: `Failed to fetch calendar events: ${errorText}` }), {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const data = await response.json();
      console.log(`Fetched ${data.items?.length || 0} events from Google Calendar`);

      // Transform Google Calendar events to our format
      const transformedEvents = (data.items || []).map((event: any) => ({
        googleEventId: event.id,
        title: event.summary || 'Untitled Event',
        description: event.description || '',
        startDateTime: event.start?.dateTime || event.start?.date,
        endDateTime: event.end?.dateTime || event.end?.date,
        isAllDay: !event.start?.dateTime,
        location: event.location || '',
        htmlLink: event.htmlLink,
      }));

      return new Response(JSON.stringify({ events: transformedEvents, success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (action === 'push') {
      // Push events to Google Calendar
      if (!events || !Array.isArray(events)) {
        return new Response(JSON.stringify({ error: 'Events array required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      console.log(`Pushing ${events.length} events to Google Calendar`);
      const results = [];
      
      for (const event of events) {
        const googleEvent = {
          summary: event.title,
          description: event.description || '',
          start: {
            dateTime: event.startDateTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: event.endDateTime,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };

        try {
          const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${googleToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(googleEvent),
            }
          );

          if (response.ok) {
            const createdEvent = await response.json();
            console.log('Created event:', createdEvent.id);
            results.push({ success: true, eventId: createdEvent.id, title: event.title });
          } else {
            const errorText = await response.text();
            console.error('Failed to create event:', errorText);
            results.push({ success: false, title: event.title, error: errorText });
          }
        } catch (error) {
          console.error('Error creating event:', error);
          results.push({ success: false, title: event.title, error: error.message });
        }
      }

      return new Response(JSON.stringify({ results, success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use "fetch" or "push".' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-calendar-sync:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
