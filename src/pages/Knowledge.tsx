import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Link as LinkIcon, 
  Tag, 
  Pin, 
  PinOff,
  ExternalLink,
  Clock,
  Check,
  Brain,
  Bookmark
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Note, Resource } from "@/types/knowledge";
import { useKnowledge } from "@/contexts/KnowledgeContext";
import { BookshelfTab } from "@/components/knowledge/BookshelfTab";
import { SkillsetTab } from "@/components/knowledge/SkillsetTab";
import ResourcesTab from "@/components/knowledge/ResourcesTab";
import SecondBrainSystem from "@/components/knowledge/SecondBrainSystem";

const Knowledge: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("all");
  const { 
    notes, 
    resources, 
    books, 
    skillsets,
    addNote, 
    updateNote, 
    deleteNote,
    togglePinNote,
    togglePinResource,
    togglePinBook,
    togglePinSkillset
  } = useKnowledge();
  
  const allTags = Array.from(new Set([
    ...notes.flatMap(note => note.tags),
    ...resources.flatMap(resource => resource.tags),
    ...books.flatMap(book => book.relatedSkillsets || []),
    ...skillsets.map(skillset => skillset.name)
  ]));
  
  const handleAddNewItem = () => {
    toast({
      title: `Create new ${activeTab === "notes" ? "note" : 
        activeTab === "resources" ? "resource" : 
        activeTab === "books" ? "book" : "skillset"}`,
      description: "Creation dialog coming soon",
      duration: 3000,
    });
  };
  
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === "all" || note.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });
  
  const filteredResources = resources
    .filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (resource.notes && resource.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = filterTag === "all" || resource.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });
  
  const getResourceIcon = (type: string) => {
    switch(type) {
      case "article": return <FileText className="h-4 w-4" />;
      case "book": return <BookOpen className="h-4 w-4" />;
      case "video": return <ExternalLink className="h-4 w-4" />;
      case "course": return <BookOpen className="h-4 w-4" />;
      default: return <LinkIcon className="h-4 w-4" />;
    }
  };
  
  return (
    <AppLayout>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">Organize your notes, resources, books, and skillsets</p>
          </div>
          <Button onClick={handleAddNewItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add {
              activeTab === "notes" ? "Note" : 
              activeTab === "resources" ? "Resource" : 
              activeTab === "books" ? "Book" : 
              activeTab === "skillsets" ? "Skillset" : 
              activeTab === "secondbrain" ? "Entry" : ""
            }
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <TabsList className="mb-4 md:mb-0">
              <TabsTrigger value="notes" className="gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="books" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Books
              </TabsTrigger>
              <TabsTrigger value="skillsets" className="gap-2">
                <Brain className="h-4 w-4" />
                Skillsets
              </TabsTrigger>
              <TabsTrigger value="secondbrain" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Second Brain
              </TabsTrigger>
              <TabsTrigger value="tags" className="gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
          
          <TabsContent value="notes" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.length === 0 ? (
                <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No notes found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || filterTag !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first note to get started"}
                  </p>
                  {!searchQuery && filterTag === "all" && (
                    <Button onClick={handleAddNewItem}>
                      <Plus className="mr-2 h-4 w-4" /> Create Your First Note
                    </Button>
                  )}
                </div>
              ) : (
                filteredNotes.map(note => (
                  <Card key={note.id} className="group hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex-1">{note.title}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => togglePinNote(note.id)}
                        >
                          {note.pinned ? (
                            <Pin className="h-4 w-4 text-primary" fill="currentColor" />
                          ) : (
                            <PinOff className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(note.lastUpdated).toLocaleDateString()}
                        {note.pinned && (
                          <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                            <Pin className="h-3 w-3 mr-1" /> Pinned
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3 mb-3">{note.content}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {note.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-6">
            <ResourcesTab />
          </TabsContent>
          
          <TabsContent value="books" className="mt-6">
            <BookshelfTab />
          </TabsContent>
          
          <TabsContent value="skillsets" className="mt-6">
            <SkillsetTab />
          </TabsContent>
          
          <TabsContent value="secondbrain" className="mt-6">
            <SecondBrainSystem />
          </TabsContent>
          
          <TabsContent value="tags" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allTags.map(tag => (
                <Card key={tag} className="hover:shadow-md transition-all cursor-pointer" onClick={() => setFilterTag(tag)}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <h3 className="font-medium">{tag}</h3>
                    </div>
                    <Badge variant="secondary">
                      {notes.filter(note => note.tags.includes(tag)).length + 
                       resources.filter(resource => resource.tags.includes(tag)).length +
                       books.filter(book => (book.relatedSkillsets || []).includes(tag)).length +
                       skillsets.filter(skillset => skillset.name === tag).length}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Knowledge;
