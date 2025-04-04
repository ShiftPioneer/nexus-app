
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { KnowledgeEntry, KnowledgeCategory, KnowledgeContextValue } from "@/types/knowledge";
import { useTasks } from "@/contexts/TaskContext";
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within a KnowledgeProvider");
  }
  return context;
};

interface KnowledgeProviderProps {
  children: ReactNode;
}

export const KnowledgeProvider: React.FC<KnowledgeProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([
    {
      id: "1",
      title: "How to implement the GTD methodology",
      content: "GTD (Getting Things Done) is a productivity methodology created by David Allen...",
      tags: ["productivity", "gtd", "methodology"],
      createdAt: new Date(2023, 3, 15),
      updatedAt: new Date(2023, 3, 15),
      category: "resources"
    },
    {
      id: "2",
      title: "Learning Spanish - Key Phrases",
      content: "Here are some essential Spanish phrases to remember...",
      tags: ["language", "spanish", "learning"],
      createdAt: new Date(2023, 4, 2),
      updatedAt: new Date(2023, 4, 5),
      category: "projects"
    },
    {
      id: "3",
      title: "Personal Finance Fundamentals",
      content: "Understanding personal finance basics is crucial for long-term wealth building...",
      tags: ["finance", "money", "investing"],
      createdAt: new Date(2023, 2, 10),
      updatedAt: new Date(2023, 2, 10),
      category: "areas"
    },
    {
      id: "4",
      title: "Recipe for Chicken Curry",
      content: "Ingredients: Chicken, curry powder, coconut milk...",
      tags: ["cooking", "recipe", "food"],
      createdAt: new Date(2023, 1, 5),
      updatedAt: new Date(2023, 1, 5), 
      category: "resources"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<KnowledgeCategory | "all">("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineEntries, setOfflineEntries] = useState<KnowledgeEntry[]>([]);
  const { tasks } = useTasks();
  const { toast } = useToast();
  
  // Check network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Sync offline entries when coming back online
      if (offlineEntries.length > 0) {
        setEntries(prev => [...prev, ...offlineEntries]);
        setOfflineEntries([]);
        toast({
          title: "Back online",
          description: `${offlineEntries.length} entries have been synchronized`,
          duration: 3000,
        });
      }
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: "You're offline",
        description: "Knowledge entries will be saved locally and synced when you're back online",
        duration: 3000,
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineEntries, toast]);

  const addEntry = (entry: Omit<KnowledgeEntry, "id" | "createdAt" | "updatedAt">) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      category: entry.category || "inbox", // Default to inbox
    };
    
    if (isOffline) {
      setOfflineEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Entry saved offline",
        description: "Will be synchronized when you're back online",
        duration: 3000,
      });
    } else {
      setEntries(prev => [newEntry, ...prev]);
      toast({
        title: "Entry added",
        description: `${newEntry.title} has been added to ${newEntry.category}`,
        duration: 3000,
      });
    }
    
    return newEntry;
  };

  const updateEntry = (id: string, updatedFields: Partial<KnowledgeEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
        ? { ...entry, ...updatedFields, updatedAt: new Date() } 
        : entry
      )
    );
    
    toast({
      title: "Entry updated",
      description: "Your knowledge entry has been updated",
      duration: 3000,
    });
  };

  const deleteEntry = (id: string) => {
    // Find the entry before deleting
    const entryToDelete = entries.find(entry => entry.id === id);
    
    setEntries(prev => prev.filter(entry => entry.id !== id));
    
    if (entryToDelete) {
      toast({
        title: "Entry deleted",
        description: `"${entryToDelete.title}" has been deleted`,
        duration: 3000,
      });
    }
  };

  const moveEntry = (id: string, category: KnowledgeCategory) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
        ? { ...entry, category, updatedAt: new Date() } 
        : entry
      )
    );
    
    toast({
      title: "Entry moved",
      description: `Entry moved to ${category}`,
      duration: 3000,
    });
  };

  const getEntriesByCategory = (category: KnowledgeCategory) => {
    return entries.filter(entry => entry.category === category);
  };

  const findSimilarEntries = (entry: KnowledgeEntry) => {
    // Simple implementation - find entries with matching tags
    const entryTags = new Set(entry.tags);
    return entries.filter(e => 
      e.id !== entry.id && 
      e.tags.some(tag => entryTags.has(tag))
    );
  };

  const checkForDuplicates = (entry: Partial<KnowledgeEntry>): KnowledgeEntry[] => {
    // Check for potential duplicates based on title similarity or tag overlap
    const potentialDuplicates = entries.filter(e => {
      // Title similarity (basic check - contains major words)
      const titleWords = entry.title?.toLowerCase().split(/\s+/) || [];
      const existingTitleWords = e.title.toLowerCase().split(/\s+/);
      const titleSimilarity = titleWords.filter(word => 
        word.length > 3 && existingTitleWords.includes(word)
      ).length;
      
      // Tag overlap
      const tagOverlap = entry.tags?.filter(tag => 
        e.tags.includes(tag)
      ).length || 0;
      
      return (titleSimilarity >= 2) || (tagOverlap > 1);
    });
    
    return potentialDuplicates;
  };

  const searchEntries = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.content.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };
  
  const generateAiSummary = (entry: KnowledgeEntry) => {
    // Simulate AI summary generation 
    // In a real app, this would make an API call to an AI service
    const sentences = entry.content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const summaryLength = Math.max(1, Math.floor(sentences.length / 3));
    const summary = sentences.slice(0, summaryLength).join(". ") + ".";
    
    updateEntry(entry.id, { aiSummary: summary });
    
    return summary;
  };
  
  const linkTaskToEntry = (entryId: string, taskId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId) {
        const linkedTaskIds = entry.linkedTaskIds || [];
        if (!linkedTaskIds.includes(taskId)) {
          return { 
            ...entry, 
            linkedTaskIds: [...linkedTaskIds, taskId],
            updatedAt: new Date()
          };
        }
      }
      return entry;
    }));
    
    toast({
      title: "Task linked",
      description: "Task has been linked to this knowledge entry",
      duration: 3000,
    });
  };
  
  const unlinkTaskFromEntry = (entryId: string, taskId: string) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === entryId && entry.linkedTaskIds) {
        return { 
          ...entry, 
          linkedTaskIds: entry.linkedTaskIds.filter(id => id !== taskId),
          updatedAt: new Date()
        };
      }
      return entry;
    }));
    
    toast({
      title: "Task unlinked",
      description: "Task has been unlinked from this knowledge entry",
      duration: 3000,
    });
  };
  
  const getLinkedTasks = (entryId: string) => {
    const entry = entries.find(e => e.id === entryId);
    if (!entry || !entry.linkedTaskIds?.length) return [];
    
    return tasks.filter(task => entry.linkedTaskIds?.includes(task.id));
  };
  
  const getRelatedEntriesForTask = (taskId: string) => {
    return entries.filter(entry => 
      entry.linkedTaskIds?.includes(taskId)
    );
  };
  
  const filterEntries = (category: KnowledgeCategory | "all", tags: string[], query: string) => {
    return entries.filter(entry => {
      const matchesCategory = category === "all" || entry.category === category;
      const matchesTags = tags.length === 0 || tags.every(tag => entry.tags.includes(tag));
      const matchesQuery = !query || 
        entry.title.toLowerCase().includes(query.toLowerCase()) ||
        entry.content.toLowerCase().includes(query.toLowerCase());
      
      return matchesCategory && matchesTags && matchesQuery;
    });
  };
  
  // For archiving old entries
  const archiveOldEntries = (daysThreshold: number) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    const entriesToArchive = entries.filter(entry => 
      entry.category !== "archives" && 
      entry.updatedAt < thresholdDate
    );
    
    if (entriesToArchive.length === 0) {
      toast({
        title: "No entries to archive",
        description: "There are no old entries to move to archives",
        duration: 3000,
      });
      return;
    }
    
    for (const entry of entriesToArchive) {
      moveEntry(entry.id, "archives");
    }
    
    toast({
      title: "Entries archived",
      description: `${entriesToArchive.length} old entries moved to archives`,
      duration: 3000,
    });
  };
  
  // For analytics and review
  const getEntriesStats = () => {
    const inboxCount = entries.filter(e => e.category === "inbox").length;
    const projectsCount = entries.filter(e => e.category === "projects").length;
    const areasCount = entries.filter(e => e.category === "areas").length;
    const resourcesCount = entries.filter(e => e.category === "resources").length;
    const archivesCount = entries.filter(e => e.category === "archives").length;
    
    const totalEntries = entries.length;
    const withTasks = entries.filter(e => e.linkedTaskIds && e.linkedTaskIds.length > 0).length;
    const withFiles = entries.filter(e => e.fileAttachment).length;
    
    return {
      categories: { inboxCount, projectsCount, areasCount, resourcesCount, archivesCount },
      totalEntries,
      withTasks,
      withFiles
    };
  };

  return (
    <KnowledgeContext.Provider
      value={{
        entries,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        activeTags,
        setActiveTags,
        addEntry,
        updateEntry,
        deleteEntry,
        moveEntry,
        getEntriesByCategory,
        findSimilarEntries,
        checkForDuplicates,
        searchEntries,
        generateAiSummary,
        linkTaskToEntry,
        unlinkTaskFromEntry,
        getLinkedTasks,
        getRelatedEntriesForTask,
        filterEntries,
        archiveOldEntries,
        getEntriesStats,
        isOffline
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  );
};
