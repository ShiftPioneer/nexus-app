
import React, { useState } from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, LinkIcon, BookOpen, Brain, Tag, Search, Filter } from "lucide-react";
import { useKnowledge } from "@/contexts/KnowledgeContext";

interface KnowledgeHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function KnowledgeHeader({
  activeTab,
  setActiveTab
}: KnowledgeHeaderProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("all");
  
  const {
    notes,
    resources,
    books,
    skillsets
  } = useKnowledge();
  
  const allTags = Array.from(new Set([
    ...notes.flatMap(note => note.tags), 
    ...resources.flatMap(resource => resource.tags), 
    ...books.flatMap(book => book.tags || []), 
    ...skillsets.flatMap(skillset => skillset.tags || [])
  ]));
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <TabsList className="mb-4 md:mb-0">
        <TabsTrigger value="skillsets" className="gap-2">
          <Brain className="h-4 w-4" />
          Skillsets
        </TabsTrigger>
        <TabsTrigger value="resources" className="gap-2">
          <LinkIcon className="h-4 w-4" />
          Resources
        </TabsTrigger>
        <TabsTrigger value="books" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Books
        </TabsTrigger>
        <TabsTrigger value="notes" className="gap-2">
          <FileText className="h-4 w-4" />
          Notes
        </TabsTrigger>
        <TabsTrigger value="tags" className="gap-2">
          <Tag className="h-4 w-4" />
          Tags
        </TabsTrigger>
      </TabsList>
      
      <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-full md:w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by tag" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map(tag => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
