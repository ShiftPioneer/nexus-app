
export type KnowledgeCategory = 'note' | 'resource' | 'reference' | 'idea' | 'concept' | 'insight';

export type SkillsetCategory = 'technical' | 'soft' | 'creative' | 'language' | 'business' | 'other';

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  url?: string;
  dateCreated?: Date; // Adding for backward compatibility
  dateUpdated?: Date; // Adding for backward compatibility
  lastUpdated?: Date; // Adding for backward compatibility
  attachments?: any[]; // Adding for backward compatibility
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  lastUpdated: Date;
  pinned?: boolean;
  image?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  coverUrl?: string; // For backward compatibility
  pages?: number;
  currentPage?: number; // For backward compatibility
  totalPages?: number; // For backward compatibility
  readingStatus: ReadingStatus;
  notes?: string;
  description?: string;
  rating: number;
  dateAdded: Date;
  dateStarted?: Date;
  dateFinished?: Date;
  dateCompleted?: Date; // For backward compatibility
  highlights?: string[];
  quotes?: string[];
  summary?: string;
  keyLessons?: string;
  genre?: string; // For backward compatibility
  tags?: string[]; // For backward compatibility
  pinned?: boolean; // For backward compatibility
}

export type ReadingStatus = 'not-started' | 'in-progress' | 'completed' | 'abandoned';

export interface BookshelfState {
  'not-started': Book[];
  'in-progress': Book[];
  'completed': Book[];
  'abandoned': Book[];
  // For backward compatibility
  'Not Started'?: Book[];
  'In Progress'?: Book[];
  'Completed'?: Book[];
  'Reading Now'?: Book[];
  'Not Yet Read'?: Book[];
  'Finished'?: Book[];
}

export interface Skillset {
  id: string;
  name: string;
  description: string;
  category: SkillsetCategory;
  level: number;
  goals?: string[];
  resources?: string[];
  lastPracticed?: Date;
  icon?: string;
  skills?: string[]; // For backward compatibility
  proficiency?: number; // For backward compatibility
  mastery?: number; // For backward compatibility
  resourceCount?: number; // For backward compatibility
  color?: string; // For backward compatibility
  pinned?: boolean; // For backward compatibility
  learningResources?: string[]; // For backward compatibility
}

export interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool' | 'other';
  tags: string[];
  dateAdded: Date;
  completed: boolean;
  notes?: string;
  rating?: number;
  pinned?: boolean; // For backward compatibility
}

export interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  books: Book[];
  skillsets: Skillset[];
  resources: Resource[];
  notes?: Note[]; // For backward compatibility
  tags?: Tag[]; // For backward compatibility
  addEntry: (entry: Omit<KnowledgeEntry, "id">) => string;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  addBook: (book: Omit<Book, "id">) => string;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addSkillset: (skillset: Omit<Skillset, "id">) => string;
  updateSkillset: (id: string, skillset: Partial<Skillset>) => void;
  deleteSkillset: (id: string) => void;
  addResource: (resource: Omit<Resource, "id">) => string;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  togglePinNote?: (id: string) => void; // Making optional for backward compatibility
  togglePinResource?: (id: string) => void;
  togglePinBook?: (id: string) => void;
  togglePinSkillset?: (id: string) => void;
  getEntriesStats?: () => any; // Making optional for backward compatibility
  // Additional field for components
  addNote?: (note: Omit<Note, "id">) => string;
  updateNote?: (id: string, note: Partial<Note>) => void;
  deleteNote?: (id: string) => void;
  addTag?: (tag: Omit<Tag, "id">) => string;
  updateTag?: (id: string, tag: Partial<Tag>) => void;
  deleteTag?: (id: string) => void;
}
