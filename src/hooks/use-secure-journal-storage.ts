import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags: string[];
  mood: "positive" | "negative" | "neutral" | "mixed";
  created_at?: string;
  updated_at?: string;
}

export const useSecureJournalStorage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load entries when user is authenticated
  useEffect(() => {
    if (user) {
      loadEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user]);

  const loadEntries = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedEntries = data?.map(entry => ({
        id: entry.id,
        title: entry.title,
        content: entry.content,
        date: new Date(entry.date),
        tags: entry.tags || [],
        mood: entry.mood as "positive" | "negative" | "neutral" | "mixed"
      })) || [];

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<JournalEntry, 'id'>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save journal entries",
        variant: "destructive"
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          title: entry.title,
          content: entry.content,
          date: entry.date.toISOString().split('T')[0],
          tags: entry.tags,
          mood: entry.mood
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: JournalEntry = {
        id: data.id,
        title: data.title,
        content: data.content,
        date: new Date(data.date),
        tags: data.tags || [],
        mood: data.mood as "positive" | "negative" | "neutral" | "mixed"
      };

      setEntries(prev => [newEntry, ...prev]);
      
      toast({
        title: "Success",
        description: "Journal entry saved securely",
      });

      return newEntry;
    } catch (error) {
      console.error('Error adding journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateEntry = async (id: string, updates: Partial<JournalEntry>) => {
    if (!user) return;

    try {
      const updateData: any = { ...updates };
      if (updates.date) {
        updateData.date = updates.date.toISOString().split('T')[0];
      }

      const { data, error } = await supabase
        .from('journal_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedEntry: JournalEntry = {
        id: data.id,
        title: data.title,
        content: data.content,
        date: new Date(data.date),
        tags: data.tags || [],
        mood: data.mood as "positive" | "negative" | "neutral" | "mixed"
      };

      setEntries(prev => prev.map(entry => 
        entry.id === id ? updatedEntry : entry
      ));

      toast({
        title: "Success",
        description: "Journal entry updated",
      });
    } catch (error) {
      console.error('Error updating journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive"
      });
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      toast({
        title: "Success",
        description: "Journal entry deleted",
      });
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Error", 
        description: "Failed to delete journal entry",
        variant: "destructive"
      });
    }
  };

  // Calculate statistics
  const getStats = () => {
    const totalEntries = entries.length;
    const wordsWritten = entries.reduce((total, entry) => {
      return total + (entry.content.split(/\s+/).filter(word => word.length > 0).length);
    }, 0);
    
    // Calculate streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (true) {
      const hasEntryForDate = entries.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === currentDate.getTime();
      });
      
      if (hasEntryForDate) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate average mood
    const moodValues = { negative: 2, neutral: 5, mixed: 6, positive: 8 };
    const avgMood = entries.length > 0 ? 
      entries.reduce((sum, entry) => sum + moodValues[entry.mood], 0) / entries.length : 5;

    return {
      totalEntries,
      currentStreak: streak,
      wordsWritten,
      avgMood: Math.round(avgMood * 10) / 10
    };
  };

  return {
    entries,
    loading,
    addEntry,
    updateEntry,
    deleteEntry,
    getStats,
    refresh: loadEntries
  };
};