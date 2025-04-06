
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book, KnowledgeCategory, KnowledgeEntry, Note, ReadingStatus, Resource, Skillset, Tag } from '@/types/knowledge';
import { useToast } from '@/hooks/use-toast';

const KnowledgeContext = createContext<any>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Getting Started with React',
      content: 'React is a JavaScript library for building user interfaces...',
      tags: ['react', 'javascript', 'frontend'],
      lastUpdated: new Date(2023, 0, 15),
      pinned: true
    },
    {
      id: '2',
      title: 'CSS Grid Layout',
      content: 'CSS Grid Layout is a two-dimensional layout system...',
      tags: ['css', 'frontend', 'layout'],
      lastUpdated: new Date(2023, 1, 20),
      pinned: false
    }
  ]);
  
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      title: 'React Documentation',
      url: 'https://reactjs.org',
      type: 'article',
      notes: 'Official React documentation with examples and tutorials',
      tags: ['react', 'documentation'],
      dateAdded: new Date(2023, 0, 10),
      completed: false,
      pinned: true
    },
    {
      id: '2',
      title: 'Advanced CSS and Sass Course',
      url: 'https://udemy.com/course/advanced-css-and-sass',
      type: 'course',
      notes: 'Comprehensive course on advanced CSS techniques',
      tags: ['css', 'sass', 'course'],
      dateAdded: new Date(2023, 1, 5),
      completed: false,
      pinned: false
    }
  ]);
  
  const [books, setBooks] = useState<Book[]>([
    {
      id: '1',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      coverImage: 'https://example.com/clean-code.jpg',
      readingStatus: 'In Progress' as ReadingStatus,
      dateAdded: new Date(2023, 0, 20),
      currentPage: 150,
      totalPages: 464,
      genre: 'Programming',
      tags: ['coding', 'best-practices'],
      notes: 'Great book about writing maintainable code',
      rating: 4
    },
    {
      id: '2',
      title: 'Design Patterns',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      coverImage: 'https://example.com/design-patterns.jpg',
      readingStatus: 'Not Started' as ReadingStatus,
      dateAdded: new Date(2023, 2, 15),
      genre: 'Programming',
      tags: ['coding', 'architecture'],
      notes: '',
      rating: 0
    }
  ]);
  
  const [skillsets, setSkillsets] = useState<Skillset[]>([
    {
      id: '1',
      name: 'Front-end Development',
      description: 'Building user interfaces with HTML, CSS, and JavaScript',
      category: 'technical' as SkillsetCategory,
      proficiency: 85,
      learningResources: ['1', '2'],
      tags: ['web', 'frontend'],
      lastPracticed: new Date(),
      mastery: 85,
      resourceCount: 5
    },
    {
      id: '2',
      name: 'UI/UX Design',
      description: 'Designing user interfaces and experiences',
      category: 'creative' as SkillsetCategory,
      proficiency: 70,
      learningResources: [],
      tags: ['design', 'ui', 'ux'],
      lastPracticed: new Date(),
      mastery: 70,
      resourceCount: 3
    }
  ]);
  
  const [tags, setTags] = useState<Tag[]>([
    {
      id: '1',
      name: 'react',
      color: 'blue'
    },
    {
      id: '2',
      name: 'javascript',
      color: 'yellow'
    },
    {
      id: '3',
      name: 'css',
      color: 'green'
    },
    {
      id: '4',
      name: 'frontend',
      color: 'red'
    }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | KnowledgeCategory>('all');
  const [isOffline, setIsOffline] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        title: 'You are back online',
        description: 'Your changes will now be synchronized.',
      });
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast({
        title: 'You are offline',
        description: 'Changes will be saved locally until you reconnect.',
        variant: 'destructive'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);
  
  // Notes CRUD
  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      lastUpdated: new Date(),
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
  
  // Resources CRUD
  const addResource = (resource: Omit<Resource, 'id' | 'dateAdded'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
      dateAdded: new Date(),
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
  
  // Books CRUD
  const addBook = (book: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      dateAdded: new Date(),
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
  
  // Skillsets CRUD
  const addSkillset = (skillset: Omit<Skillset, 'id'>) => {
    const newSkillset: Skillset = {
      ...skillset,
      id: Date.now().toString(),
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
  
  // Tags CRUD
  const addTag = (tag: Omit<Tag, 'id'>) => {
    const newTag: Tag = {
      ...tag,
      id: Date.now().toString(),
    };
    setTags([...tags, newTag]);
    return newTag.id;
  };
  
  const updateTag = (id: string, tag: Partial<Tag>) => {
    setTags(tags.map(t => t.id === id ? { ...t, ...tag } : t));
  };
  
  const deleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  // Pinning functionality
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
  
  // Create knowledge entries for the second brain system
  const entries: KnowledgeEntry[] = [
    ...notes.map(note => ({
      id: note.id,
      title: note.title,
      content: note.content,
      category: 'note' as KnowledgeCategory,
      tags: note.tags,
      createdAt: note.lastUpdated,
      updatedAt: note.lastUpdated,
      pinned: note.pinned
    })),
    ...resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      content: resource.notes || "",
      category: 'resource' as KnowledgeCategory,
      tags: resource.tags,
      createdAt: resource.dateAdded,
      updatedAt: resource.dateAdded,
      pinned: resource.pinned || false,
      url: resource.url
    }))
  ];
  
  const value = {
    notes,
    resources,
    books,
    skillsets,
    tags,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    addNote,
    updateNote,
    deleteNote,
    addResource,
    updateResource,
    deleteResource,
    addBook,
    updateBook,
    deleteBook,
    addSkillset,
    updateSkillset,
    deleteSkillset,
    addTag,
    updateTag,
    deleteTag,
    isOffline,
    entries,
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
    throw new Error('useKnowledge must be used within a KnowledgeProvider');
  }
  return context;
};
