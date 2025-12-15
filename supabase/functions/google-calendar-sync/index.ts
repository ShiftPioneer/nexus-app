import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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

    // Get user session and provider token
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error:', sessionError?.message || 'No session');
      return new Response(JSON.stringify({ error: 'No valid session' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const providerToken = session.provider_token;
    
    if (!providerToken) {
      console.error('No provider token available');
      return new Response(JSON.stringify({ 
        error: 'No Google access token available. Please reconnect your Google account.',
        needsReconnect: true 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, events, timeMin, timeMax } = await req.json();
    console.log('Google Calendar sync action:', action);

    if (action === 'fetch') {
      // Fetch events from Google Calendar
      const now = new Date();
      const defaultTimeMin = timeMin || now.toISOString();
      const defaultTimeMax = timeMax || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ahead

      const calendarUrl = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
      calendarUrl.searchParams.set('timeMin', defaultTimeMin);
      calendarUrl.searchParams.set('timeMax', defaultTimeMax);
      calendarUrl.searchParams.set('singleEvents', 'true');
      calendarUrl.searchParams.set('orderBy', 'startTime');
      calendarUrl.searchParams.set('maxResults', '100');

      console.log('Fetching Google Calendar events...');
      
      const response = await fetch(calendarUrl.toString(), {
        headers: {
          'Authorization': `Bearer ${providerToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Calendar API error:', response.status, errorText);
        
        if (response.status === 401) {
          return new Response(JSON.stringify({ 
            error: 'Google token expired. Please reconnect your Google account.',
            needsReconnect: true 
          }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: 'Failed to fetch calendar events' }), {
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

      return new Response(JSON.stringify({ events: transformedEvents }), {
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
                'Authorization': `Bearer ${providerToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(googleEvent),
            }
          );

          if (response.ok) {
            const createdEvent = await response.json();
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

      return new Response(JSON.stringify({ results }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
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
