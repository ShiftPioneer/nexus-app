
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
  status: ReadingStatus;
  notes?: string;
  rating?: number;
  dateAdded: Date;
  dateCompleted?: Date;
  tags: string[];
  pinned?: boolean;
}

export type ReadingStatus = "to-read" | "reading" | "completed" | "abandoned";

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  dateAdded: Date;
  lastUpdated?: Date;
  pinned?: boolean;
}

export type KnowledgeCategory = "note" | "concept" | "idea" | "question" | "insight" | "summary";

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
}

export type SkillsetCategory = "technical" | "creative" | "soft" | "language" | "business" | "other";

export interface KnowledgeContextValue {
  notes: Note[];
  resources: Resource[];
  books: Book[];
  entries: KnowledgeEntry[];
  skillsets: Skillset[];
  tags: Tag[];
  addNote: (note: Omit<Note, 'id'>) => string;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  addResource: (resource: Omit<Resource, 'id'>) => string;
  updateResource: (id: string, resource: Partial<Resource>) => void;
  deleteResource: (id: string) => void;
  addBook: (book: Omit<Book, 'id'>) => string;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  addEntry: (entry: Omit<KnowledgeEntry, 'id'>) => string;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  addSkillset: (skillset: Omit<Skillset, 'id'>) => string;
  updateSkillset: (id: string, skillset: Partial<Skillset>) => void;
  deleteSkillset: (id: string) => void;
  addTag: (tag: Omit<Tag, 'id'>) => string;
  deleteTag: (id: string) => void;
  togglePinNote: (id: string) => void;
  togglePinResource: (id: string) => void;
  togglePinBook: (id: string) => void;
  togglePinEntry: (id: string) => void;
  togglePinSkillset: (id: string) => void;
}
