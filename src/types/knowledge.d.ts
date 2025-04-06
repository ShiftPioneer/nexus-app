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
  highlights?: string[];
  quotes?: string[];
  summary?: string;
  keyLessons?: string;
  genre?: string; // For backward compatibility
}

export type ReadingStatus = 'not-started' | 'in-progress' | 'completed' | 'abandoned';

export interface BookshelfState {
  'not-started': Book[];
  'in-progress': Book[];
  'completed': Book[];
  'abandoned': Book[];
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
}

export interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  books: Book[];
  skillsets: Skillset[];
  resources: Resource[];
  addEntry: (entry: KnowledgeEntry) => void;
  updateEntry: (id: string, entry: KnowledgeEntry) => void;
  deleteEntry: (id: string) => void;
  addBook: (book: Book) => void;
  updateBook: (id: string, book: Book) => void;
  deleteBook: (id: string) => void;
  addSkillset: (skillset: Skillset) => void;
  updateSkillset: (id: string, skillset: Skillset) => void;
  deleteSkillset: (id: string) => void;
  addResource: (resource: Resource) => void;
  updateResource: (id: string, resource: Resource) => void;
  deleteResource: (id: string) => void;
  togglePinNote?: (id: string) => void; // Making optional for backward compatibility
  getEntriesStats?: () => any; // Making optional for backward compatibility
}
