
import { useToast } from "@/hooks/use-toast";

interface GoogleCalendarConfig {
  clientId: string;
  apiKey: string;
  scope: string[];
}

class GoogleCalendarService {
  private static instance: GoogleCalendarService;
  private apiKey: string = '';
  private clientId: string = '';
  private scope: string[] = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/calendar.events'
  ];
  private isInitialized: boolean = false;
  private isAuthorized: boolean = false;
  
  private constructor() {}

  public static getInstance(): GoogleCalendarService {
    if (!GoogleCalendarService.instance) {
      GoogleCalendarService.instance = new GoogleCalendarService();
    }
    return GoogleCalendarService.instance;
  }

  public initialize(config: GoogleCalendarConfig): void {
    this.apiKey = config.apiKey;
    this.clientId = config.clientId;
    this.scope = config.scope || this.scope;
    
    this.loadGoogleCalendarApi().then(() => {
      this.isInitialized = true;
    }).catch(error => {
      console.error('Error initializing Google Calendar API:', error);
    });
  }

  private loadGoogleCalendarApi(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        // @ts-ignore
        window.gapi.load('client:auth2', () => {
          // @ts-ignore
          window.gapi.client.init({
            apiKey: this.apiKey,
            clientId: this.clientId,
            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
            scope: this.scope.join(' ')
          }).then(() => {
            resolve();
          }).catch((error: any) => {
            reject(error);
          });
        });
      };
      script.onerror = (error) => {
        reject(error);
      };
      document.body.appendChild(script);
    });
  }

  public signIn(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Google Calendar API is not initialized'));
        return;
      }

      // @ts-ignore
      const auth = window.gapi.auth2.getAuthInstance();
      auth.signIn().then(
        (response: any) => {
          this.isAuthorized = true;
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  public signOut(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.isInitialized) {
        reject(new Error('Google Calendar API is not initialized'));
        return;
      }

      // @ts-ignore
      const auth = window.gapi.auth2.getAuthInstance();
      auth.signOut().then(
        () => {
          this.isAuthorized = false;
          resolve(true);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  public async getCalendars(): Promise<any[]> {
    if (!this.isInitialized || !this.isAuthorized) {
      throw new Error('Google Calendar API is not initialized or authorized');
    }

    try {
      // @ts-ignore
      const response = await window.gapi.client.calendar.calendarList.list();
      return response.result.items;
    } catch (error) {
      console.error('Error fetching calendars:', error);
      throw error;
    }
  }

  public async getEvents(calendarId: string, timeMin: Date, timeMax: Date): Promise<any[]> {
    if (!this.isInitialized || !this.isAuthorized) {
      throw new Error('Google Calendar API is not initialized or authorized');
    }

    try {
      // @ts-ignore
      const response = await window.gapi.client.calendar.events.list({
        'calendarId': calendarId,
        'timeMin': timeMin.toISOString(),
        'timeMax': timeMax.toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 100,
        'orderBy': 'startTime'
      });
      return response.result.items;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  public async createEvent(calendarId: string, event: any): Promise<any> {
    if (!this.isInitialized || !this.isAuthorized) {
      throw new Error('Google Calendar API is not initialized or authorized');
    }

    try {
      // @ts-ignore
      const response = await window.gapi.client.calendar.events.insert({
        'calendarId': calendarId,
        'resource': event
      });
      return response.result;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  public async updateEvent(calendarId: string, eventId: string, event: any): Promise<any> {
    if (!this.isInitialized || !this.isAuthorized) {
      throw new Error('Google Calendar API is not initialized or authorized');
    }

    try {
      // @ts-ignore
      const response = await window.gapi.client.calendar.events.update({
        'calendarId': calendarId,
        'eventId': eventId,
        'resource': event
      });
      return response.result;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  public async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    if (!this.isInitialized || !this.isAuthorized) {
      throw new Error('Google Calendar API is not initialized or authorized');
    }

    try {
      // @ts-ignore
      await window.gapi.client.calendar.events.delete({
        'calendarId': calendarId,
        'eventId': eventId
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }
}

export default GoogleCalendarService;
