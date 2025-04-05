import React, { createContext, useState, useContext } from 'react';
import { KnowledgeContextValue, KnowledgeEntry, KnowledgeCategory, Note, Resource, Book, Skillset, Tag } from '@/types/knowledge';

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [skillsets, setSkillsets] = useState<Skillset[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  const addEntry = (entry: Omit<KnowledgeEntry, "id">) => {
    const newEntry: KnowledgeEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setEntries([...entries, newEntry]);
    return newEntry.id; // Return the string ID
  };
  
  const updateEntry = (id: string, entry: Partial<KnowledgeEntry>) => {
    setEntries(entries.map(e => e.id === id ? { ...e, ...entry, updatedAt: new Date() } : e));
  };
  
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
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
  
  const value: KnowledgeContextValue = {
    entries,
    notes,
    resources,
    books,
    skillsets,
    tags,
    addEntry,
    updateEntry,
    deleteEntry,
    addResource,
    updateResource,
    deleteResource,
    addBook,
    updateBook,
    deleteBook,
    addSkillset,
    updateSkillset,
    deleteSkillset,
    addNote,
    updateNote,
    deleteNote,
    togglePinNote,
    togglePinResource,
    togglePinBook,
    togglePinSkillset,
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
