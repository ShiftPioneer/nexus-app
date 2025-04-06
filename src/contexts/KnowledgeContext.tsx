
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book, KnowledgeCategory, KnowledgeEntry, ReadingStatus, Resource, Skillset, Tag } from '@/types/knowledge';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeContextValue {
  notes: KnowledgeEntry[];
  resources: Resource[];
  books: Book[];
  skillsets: Skillset[];
  tags: Tag[];
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  activeFilter: 'all' | KnowledgeCategory;
  setActiveFilter: React.Dispatch<React.SetStateAction<'all' | KnowledgeCategory>>;
  addNote: (note: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateUpdated'>) => void;
  updateNote: (id: string, note: Partial<KnowledgeEntry>) => void;
  deleteNote: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id' | 'dateAdded'>) => void;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addSkillset: (skillset: Omit<Skillset, 'id'>) => void;
  updateSkillset: (id: string, skillset: Partial<Skillset>) => void;
  deleteSkillset: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => void;
  updateTag: (id: string, tag: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  isOffline: boolean;
  entries: KnowledgeEntry[];
}

const KnowledgeContext = createContext<KnowledgeContextValue | undefined>(undefined);

export const KnowledgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<KnowledgeEntry[]>([
    {
      id: '1',
      title: 'Getting Started with React',
      content: 'React is a JavaScript library for building user interfaces...',
      category: 'note',
      tags: ['react', 'javascript', 'frontend'],
      dateCreated: new Date(2023, 0, 15),
      dateUpdated: new Date(2023, 0, 15),
      pinned: true,
      attachments: []
    },
    {
      id: '2',
      title: 'CSS Grid Layout',
      content: 'CSS Grid Layout is a two-dimensional layout system...',
      category: 'note',
      tags: ['css', 'frontend', 'layout'],
      dateCreated: new Date(2023, 1, 10),
      dateUpdated: new Date(2023, 1, 20),
      pinned: false,
      attachments: []
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
      coverUrl: 'https://example.com/clean-code.jpg',
      readingStatus: 'In Progress' as ReadingStatus,
      dateAdded: new Date(2023, 0, 20),
      currentPage: 150,
      totalPages: 464,
      genre: 'Programming',
      tags: ['coding', 'best-practices'],
      notes: 'Great book about writing maintainable code'
    },
    {
      id: '2',
      title: 'Design Patterns',
      author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
      coverUrl: 'https://example.com/design-patterns.jpg',
      readingStatus: 'Not Started' as ReadingStatus,
      dateAdded: new Date(2023, 2, 15),
      genre: 'Programming',
      tags: ['coding', 'architecture'],
      notes: ''
    }
  ]);
  
  const [skillsets, setSkillsets] = useState<Skillset[]>([
    {
      id: '1',
      name: 'Front-end Development',
      description: 'Building user interfaces with HTML, CSS, and JavaScript',
      skills: [
        { id: '1', name: 'HTML5', proficiency: 90 },
        { id: '2', name: 'CSS3', proficiency: 85 },
        { id: '3', name: 'JavaScript', proficiency: 80 },
        { id: '4', name: 'React', proficiency: 75 }
      ],
      category: 'Technical',
      learningResources: ['1', '2'],
      tags: ['web', 'frontend']
    },
    {
      id: '2',
      name: 'UI/UX Design',
      description: 'Designing user interfaces and experiences',
      skills: [
        { id: '1', name: 'Figma', proficiency: 70 },
        { id: '2', name: 'User Research', proficiency: 65 },
        { id: '3', name: 'Wireframing', proficiency: 75 }
      ],
      category: 'Design',
      learningResources: [],
      tags: ['design', 'ui', 'ux']
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
  const addNote = (note: Omit<KnowledgeEntry, 'id' | 'dateCreated' | 'dateUpdated'>) => {
    const newNote: KnowledgeEntry = {
      ...note,
      id: Date.now().toString(),
      dateCreated: new Date(),
      dateUpdated: new Date(),
    };
    setNotes([...notes, newNote]);
  };
  
  const updateNote = (id: string, note: Partial<KnowledgeEntry>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...note, dateUpdated: new Date() } : n));
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
  };
  
  const updateTag = (id: string, tag: Partial<Tag>) => {
    setTags(tags.map(t => t.id === id ? { ...t, ...tag } : t));
  };
  
  const deleteTag = (id: string) => {
    setTags(tags.filter(t => t.id !== id));
  };

  // Combined entries for SecondBrainSystem
  const entries: KnowledgeEntry[] = [
    ...notes,
    ...resources.map(resource => ({
      id: resource.id,
      title: resource.title,
      content: resource.notes || "",
      category: 'resource' as KnowledgeCategory,
      tags: resource.tags,
      dateCreated: resource.dateAdded,
      dateUpdated: resource.dateAdded,
      pinned: resource.pinned || false,
      attachments: [],
      url: resource.url
    }))
  ];
  
  const value: KnowledgeContextValue = {
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
    entries
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
