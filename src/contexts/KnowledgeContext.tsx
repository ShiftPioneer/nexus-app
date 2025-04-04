
import React, { createContext, useContext, useState, ReactNode } from "react";
import { KnowledgeEntry, KnowledgeCategory, KnowledgeContextValue } from "@/types/knowledge";

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

  const addEntry = (entry: KnowledgeEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const updateEntry = (id: string, updatedFields: Partial<KnowledgeEntry>) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
        ? { ...entry, ...updatedFields, updatedAt: new Date() } 
        : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const moveEntry = (id: string, category: KnowledgeCategory) => {
    setEntries(prev => 
      prev.map(entry => 
        entry.id === id 
        ? { ...entry, category, updatedAt: new Date() } 
        : entry
      )
    );
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

  const searchEntries = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return entries.filter(entry => 
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.content.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  return (
    <KnowledgeContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        moveEntry,
        getEntriesByCategory,
        findSimilarEntries,
        searchEntries
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  );
};
