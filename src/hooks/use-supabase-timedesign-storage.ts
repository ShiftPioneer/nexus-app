import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface DbTimeActivity {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
}

// Transform database format to UI format
const transformFromDb = (dbActivity: DbTimeActivity): TimeActivity => {
  const startTime = new Date(dbActivity.start_time);
  const endTime = new Date(dbActivity.end_time);
  
  return {
    id: dbActivity.id,
    title: dbActivity.title,
    description: dbActivity.description || "",
    category: (dbActivity.category as TimeActivity['category']) || "work",
    color: (dbActivity.color as TimeActivity['color']) || "purple",
    startDate: startTime,
    endDate: endTime,
    startTime: startTime.toTimeString().slice(0, 5), // HH:MM format
    endTime: endTime.toTimeString().slice(0, 5), // HH:MM format
    syncWithGoogleCalendar: false,
    notes: "",
    links: [],
    isRecurring: false,
  };
};

// Transform UI format to database format
const transformToDb = (activity: TimeActivity, userId: string): Omit<DbTimeActivity, 'created_at' | 'updated_at'> => {
  const startDate = new Date(activity.startDate);
  const endDate = new Date(activity.endDate);
  
  const [startHour, startMinute] = activity.startTime.split(':').map(Number);
  const [endHour, endMinute] = activity.endTime.split(':').map(Number);
  
  startDate.setHours(startHour, startMinute, 0, 0);
  endDate.setHours(endHour, endMinute, 0, 0);
  
  return {
    id: activity.id || crypto.randomUUID(),
    user_id: userId,
    title: activity.title,
    description: activity.description,
    category: activity.category,
    color: activity.color,
    start_time: startDate.toISOString(),
    end_time: endDate.toISOString(),
  };
};

export const useSupabaseTimeDesignStorage = () => {
  const [activities, setActivities] = useState<TimeActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch activities from Supabase
  const fetchActivities = useCallback(async () => {
    if (!user) {
      setActivities([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('time_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });

      if (error) throw error;

      const transformedActivities = data?.map(transformFromDb) || [];
      setActivities(transformedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to load activities. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Create activity
  const createActivity = useCallback(async (activity: TimeActivity): Promise<TimeActivity | null> => {
    if (!user) return null;

    try {
      const dbActivity = transformToDb(activity, user.id);
      const { data, error } = await supabase
        .from('time_activities')
        .insert([dbActivity])
        .select()
        .single();

      if (error) throw error;

      const newActivity = transformFromDb(data);
      setActivities(prev => [...prev, newActivity]);
      return newActivity;
    } catch (error) {
      console.error('Error creating activity:', error);
      toast({
        title: "Error",
        description: "Failed to create activity. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Update activity
  const updateActivity = useCallback(async (activity: TimeActivity): Promise<TimeActivity | null> => {
    if (!user || !activity.id) return null;

    try {
      const dbActivity = transformToDb(activity, user.id);
      const { data, error } = await supabase
        .from('time_activities')
        .update(dbActivity)
        .eq('id', activity.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedActivity = transformFromDb(data);
      setActivities(prev => prev.map(a => a.id === activity.id ? updatedActivity : a));
      return updatedActivity;
    } catch (error) {
      console.error('Error updating activity:', error);
      toast({
        title: "Error",
        description: "Failed to update activity. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Delete activity
  const deleteActivity = useCallback(async (id: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('time_activities')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setActivities(prev => prev.filter(a => a.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting activity:', error);
      toast({
        title: "Error",
        description: "Failed to delete activity. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast]);

  // Save activity (create or update)
  const saveActivity = useCallback(async (activity: TimeActivity): Promise<TimeActivity | null> => {
    if (activity.id && activities.find(a => a.id === activity.id)) {
      return updateActivity(activity);
    } else {
      // Generate ID for new activities
      const activityWithId = {
        ...activity,
        id: activity.id || crypto.randomUUID()
      };
      return createActivity(activityWithId);
    }
  }, [activities, createActivity, updateActivity]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    saveActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
};