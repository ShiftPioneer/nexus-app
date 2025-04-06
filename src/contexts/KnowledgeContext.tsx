
import React, { createContext, useState, useContext, useEffect } from 'react';
import { KnowledgeContextValue, KnowledgeEntry, KnowledgeCategory, Note, Resource, Book, Skillset, Tag } from '@/types/knowledge';
import { useToast } from '@/hooks/use-toast';

export const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  const [notes, setNotes] = useState<Note[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [skillsets, setSkillsets] = useState<Skillset[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<KnowledgeCategory | "all">("all");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [offlineEntries, setOfflineEntries] = useState<KnowledgeEntry[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
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

  const addEntry = (entry: Omit<KnowledgeEntry, "id">) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
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
    
    return newEntry.id;
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
    const entryTags = new Set(entry.tags);
    return entries.filter(e => 
      e.id !== entry.id && 
      e.tags.some(tag => entryTags.has(tag))
    );
  };

  const checkForDuplicates = (entry: Partial<KnowledgeEntry>): KnowledgeEntry[] => {
    const potentialDuplicates = entries.filter(e => {
      const titleWords = entry.title?.toLowerCase().split(/\s+/) || [];
      const existingTitleWords = e.title.toLowerCase().split(/\s+/);
      const titleSimilarity = titleWords.filter(word => 
        word.length > 3 && existingTitleWords.includes(word)
      ).length;
      
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
    
    return []; // We don't have access to tasks here without a proper context
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
  
  const archiveOldEntries = (daysThreshold: number) => {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
    
    const entriesToArchive = entries.filter(entry => 
      entry.category !== "archives" && 
      entry.updatedAt && entry.updatedAt < thresholdDate
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

  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setResources([...resources, newResource]);
    return newResource.id;
  };
  
  const updateResource = (id: string, resource: Partial<Resource>) => {
    setResources(resources.map(r => r.id === id ? { ...r, ...resource } : r));
  };
  
  const deleteResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };
  
  const addBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      dateAdded: new Date()
    };
    setBooks([...books, newBook]);
    return newBook.id;
  };
  
  const updateBook = (id: string, book: Partial<Book>) => {
    setBooks(books.map(b => b.id === id ? { ...b, ...book } : b));
  };
  
  const deleteBook = (id: string) => {
    setBooks(books.filter(b => b.id !== id));
  };
  
  const addSkillset = (skillset: Omit<Skillset, 'id'>) => {
    const newSkillset: Skillset = {
      ...skillset,
      id: Date.now().toString()
    };
    setSkillsets([...skillsets, newSkillset]);
    return newSkillset.id;
  };
  
  const updateSkillset = (id: string, skillset: Partial<Skillset>) => {
    setSkillsets(skillsets.map(s => s.id === id ? { ...s, ...skillset } : s));
  };
  
  const deleteSkillset = (id: string) => {
    setSkillsets(skillsets.filter(s => s.id !== id));
  };
  
  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };
    setNotes([...notes, newNote]);
    return newNote.id;
  };
  
  const updateNote = (id: string, note: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...note, lastUpdated: new Date() } : n));
  };
  
  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(notes =>
      notes.map(note =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  const togglePinResource = (id: string) => {
    setResources(resources =>
      resources.map(resource =>
        resource.id === id ? { ...resource, pinned: !resource.pinned } : resource
      )
    );
  };

  const togglePinBook = (id: string) => {
    setBooks(books =>
      books.map(book =>
        book.id === id ? { ...book, pinned: !book.pinned } : book
      )
    );
  };

  const togglePinSkillset = (id: string) => {
    setSkillsets(skillsets =>
      skillsets.map(skillset =>
        skillset.id === id ? { ...skillset, pinned: !skillset.pinned } : skillset
      )
    );
  };

  const togglePinEntry = (id: string) => {
    setEntries(entries =>
      entries.map(entry =>
        entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
      )
    );
  };

  const value: KnowledgeContextValue = {
    entries,
    notes,
    resources,
    books,
    skillsets,
    tags,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    activeTags,
    setActiveTags,
    isOffline,
    
    // Entry operations
    addEntry,
    updateEntry,
    deleteEntry,
    moveEntry,
    getEntriesByCategory,
    findSimilarEntries,
    checkForDuplicates,
    searchEntries,
    generateAiSummary,
    filterEntries,
    archiveOldEntries,
    getEntriesStats,
    togglePinEntry,
    
    // Resource operations
    addResource,
    updateResource,
    deleteResource,
    
    // Book operations
    addBook,
    updateBook,
    deleteBook,
    
    // Skillset operations
    addSkillset,
    updateSkillset,
    deleteSkillset,
    
    // Note operations
    addNote,
    updateNote,
    deleteNote,
    
    // Task linking
    linkTaskToEntry,
    unlinkTaskFromEntry,
    getLinkedTasks,
    getRelatedEntriesForTask,
    
    // Pinning functionality
    togglePinNote,
    togglePinResource,
    togglePinBook,
    togglePinSkillset
  };

  return (
    <KnowledgeContext.Provider value={value}>
      {children}
    </KnowledgeContext.Provider>
  );
};

export const useKnowledge = () => {
  const context = useContext(KnowledgeContext);
  if (!context) {
    throw new Error("useKnowledge must be used within a KnowledgeProvider");
  }
  return context;
};
