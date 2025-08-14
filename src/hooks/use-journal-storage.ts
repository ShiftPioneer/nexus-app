import { useState, useEffect } from "react";

export const useJournalStorage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('journal-entries');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading journal entries:', error);
      return [];
    }
  });

  // Save to localStorage whenever entries change
  useEffect(() => {
    try {
      localStorage.setItem('journal-entries', JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving journal entries:', error);
    }
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
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
    addEntry,
    updateEntry,
    deleteEntry,
    getStats
  };
};