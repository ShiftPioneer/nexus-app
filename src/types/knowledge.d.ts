
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
  pinned?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  url?: string;
  type: "article" | "video" | "book" | "course" | "other";
  notes?: string;
  tags: string[];
  dateAdded: Date;
  pinned?: boolean;
  completed?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

// Adding missing types for Knowledge components
export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  pages?: number;
  readingStatus: ReadingStatus;
  notes?: string;
  description?: string;
  rating: number;
  dateAdded: Date;
  dateCompleted?: Date;
  tags: string[];
  pinned?: boolean;
  relatedSkillsets?: string[];
  summary?: string;
  keyLessons?: string[];
}

export type ReadingStatus = "to-read" | "reading" | "completed" | "abandoned" | "Not Yet Read";

export type KnowledgeCategory = "note" | "concept" | "idea" | "question" | "insight" | "summary";

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives";
  tags: string[];
  createdAt: Date;
  updatedAt?: Date;
  pinned?: boolean;
  url?: string;
  linkedTaskIds?: string[];
  fileAttachment?: {
    name: string;
    url: string;
    type: string;
  };
  aiSummary?: string;
}

export interface Skillset {
  id: string;
  name: string;
  category: SkillsetCategory;
  proficiency: number;
  description?: string;
  resources?: string[];
  lastPracticed?: Date;
  goalLevel?: number;
  pinned?: boolean;
  mastery?: number;
  color?: string;
  resourceCount?: number;
}

export type SkillsetCategory = "technical" | "creative" | "soft" | "language" | "business" | "other" | 
  "Programming" | "Design" | "Analytics" | "Soft Skills" | "Language" | "Music" | "Sport" | "Art" | "Business" | "Religion" | "Other";

export interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  notes: Note[];
  resources: Resource[];
  books: Book[];
  skillsets: Skillset[];
  tags: Tag[];
  
  // State management
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  activeFilter?: "all" | KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives";
  setActiveFilter?: (filter: "all" | KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives") => void;
  activeTags?: string[];
  setActiveTags?: (tags: string[]) => void;
  
  // Entry operations
  addEntry: (entry: Omit<KnowledgeEntry, "id">) => string;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  moveEntry?: (id: string, category: KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives") => void;
  getEntriesByCategory?: (category: KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives") => KnowledgeEntry[];
  findSimilarEntries?: (entry: KnowledgeEntry) => KnowledgeEntry[];
  checkForDuplicates?: (entry: Partial<KnowledgeEntry>) => KnowledgeEntry[];
  searchEntries?: (query: string) => KnowledgeEntry[];
  generateAiSummary?: (entry: KnowledgeEntry) => string;
  
  // Resource operations
  addResource: (resource: Omit<Resource, 'id'>) => string;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  
  // Book operations
  addBook: (book: Omit<Book, 'id'>) => string;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  
  // Skillset operations
  addSkillset: (skillset: Omit<Skillset, 'id'>) => string;
  updateSkillset: (id: string, skillset: Partial<Skillset>) => void;
  deleteSkillset: (id: string) => void;
  
  // Note operations
  addNote: (note: Omit<Note, 'id'>) => string;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  // Task linking
  linkTaskToEntry?: (entryId: string, taskId: string) => void;
  unlinkTaskFromEntry?: (entryId: string, taskId: string) => void;
  getLinkedTasks?: (entryId: string) => any[];
  getRelatedEntriesForTask?: (taskId: string) => KnowledgeEntry[];
  
  // Filtering and organization
  filterEntries?: (category: "all" | KnowledgeCategory | "inbox" | "projects" | "areas" | "resources" | "archives", tags: string[], query: string) => KnowledgeEntry[];
  archiveOldEntries?: (daysThreshold: number) => void;
  
  // Analytics
  getEntriesStats?: () => {
    categories: {
      inboxCount: number;
      projectsCount: number;
      areasCount: number;
      resourcesCount: number;
      archivesCount: number;
    };
    totalEntries: number;
    withTasks: number;
    withFiles: number;
  };
  
  // Pinning functionality
  togglePinNote: (id: string) => void;
  togglePinResource: (id: string) => void;
  togglePinBook: (id: string) => void;
  togglePinEntry?: (id: string) => void;
  togglePinSkillset: (id: string) => void;
  
  // Offline status
  isOffline?: boolean;
}
