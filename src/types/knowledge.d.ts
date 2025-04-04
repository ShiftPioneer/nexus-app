
export interface Skillset {
  id: string;
  name: string;
  description: string;
  category: string;
  mastery: number;
  lastPracticed: Date;
  resourceCount: number;
  color?: string;
}

export type SkillsetCategory = 
  | 'Programming'
  | 'Design'
  | 'Analytics'
  | 'Soft Skills'
  | 'Language'
  | 'Music'
  | 'Sport'
  | 'Art'
  | 'Business'
  | 'Religion'
  | 'Other';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  description: string;
  link: string;
  relatedSkillsets: string[];
  notes: string;
  imageUrl?: string;
}

export type ResourceType = 
  | 'YouTube'
  | 'Social Media'
  | 'Online Course'
  | 'Book'
  | 'Article'
  | 'Website'
  | 'Other';

export interface Book {
  id: string;
  title: string;
  author: string;
  readingStatus: ReadingStatus;
  rating: number;
  coverImage?: string;
  description: string;
  relatedSkillsets: string[];
  summary: string;
  keyLessons: string;
}

export type ReadingStatus = 'Reading Now' | 'Not Yet Read' | 'Finished';

// New PARA framework interfaces
export type KnowledgeCategory = 'inbox' | 'projects' | 'areas' | 'resources' | 'archives';

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  category: KnowledgeCategory;
  url?: string;
  fileAttachment?: FileAttachment;
  linkedTaskIds?: string[];
  aiSummary?: string;
}

export interface KnowledgeContextValue {
  entries: KnowledgeEntry[];
  addEntry: (entry: KnowledgeEntry) => void;
  updateEntry: (id: string, entry: Partial<KnowledgeEntry>) => void;
  deleteEntry: (id: string) => void;
  moveEntry: (id: string, category: KnowledgeCategory) => void;
  getEntriesByCategory: (category: KnowledgeCategory) => KnowledgeEntry[];
  findSimilarEntries: (entry: KnowledgeEntry) => KnowledgeEntry[];
  searchEntries: (query: string) => KnowledgeEntry[];
}
