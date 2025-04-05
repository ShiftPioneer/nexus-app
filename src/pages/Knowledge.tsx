
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
  Check
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Note, Resource } from "@/types/knowledge";

const Knowledge: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("notes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string>("all");
  
  // Mock data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Management Framework",
      content: "Key steps for managing complex projects include: 1. Define clear objectives 2. Create a detailed timeline 3. Assign specific responsibilities 4. Establish communication channels 5. Set up regular progress reviews",
      tags: ["work", "productivity"],
      lastUpdated: new Date(2023, 5, 15),
      pinned: true
    },
    {
      id: "2",
      title: "Book Notes: Atomic Habits",
      content: "Core concept: Small 1% improvements compound over time. Four laws of behavior change: 1. Make it obvious 2. Make it attractive 3. Make it easy 4. Make it satisfying",
      tags: ["books", "self-improvement"],
      lastUpdated: new Date(2023, 6, 20)
    },
    {
      id: "3",
      title: "Weekly reflection template",
      content: "1. What went well this week? 2. What challenges did I face? 3. What did I learn? 4. What am I grateful for? 5. What will I focus on next week?",
      tags: ["reflection", "productivity"],
      lastUpdated: new Date(2023, 7, 1)
    }
  ]);
  
  const [resources, setResources] = useState<Resource[]>([
    {
      id: "1",
      title: "How to Build a Second Brain",
      url: "https://fortelabs.com/blog/basboverview/",
      type: "article",
      notes: "Comprehensive framework for organizing digital information and personal knowledge",
      tags: ["productivity", "knowledge-management"],
      dateAdded: new Date(2023, 4, 10),
      pinned: true,
      completed: true
    },
    {
      id: "2",
      title: "Deep Work",
      type: "book",
      notes: "By Cal Newport - about focusing without distraction on cognitively demanding tasks",
      tags: ["books", "productivity"],
      dateAdded: new Date(2023, 5, 5),
      completed: false
    },
    {
      id: "3",
      title: "Learning How to Learn",
      url: "https://www.coursera.org/learn/learning-how-to-learn",
      type: "course",
      notes: "Coursera course on effective learning techniques based on neuroscience",
      tags: ["learning", "education"],
      dateAdded: new Date(2023, 6, 15),
      completed: false
    }
  ]);
  
  // All unique tags from both notes and resources
  const allTags = Array.from(new Set([
    ...notes.flatMap(note => note.tags),
    ...resources.flatMap(resource => resource.tags)
  ]));
  
  const handleAddNewItem = () => {
    toast({
      title: `Create new ${activeTab === "notes" ? "note" : "resource"}`,
      description: "Creation dialog coming soon",
      duration: 3000,
    });
  };
  
  const handleTogglePin = (id: string, type: "note" | "resource") => {
    if (type === "note") {
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, pinned: !note.pinned } : note
      ));
      
      const note = notes.find(n => n.id === id);
      if (note) {
        toast({
          title: note.pinned ? "Note unpinned" : "Note pinned",
          description: `"${note.title}" has been ${note.pinned ? "removed from" : "added to"} your pinned items`,
          duration: 2000,
        });
      }
    } else {
      setResources(prev => prev.map(resource => 
        resource.id === id ? { ...resource, pinned: !resource.pinned } : resource
      ));
      
      const resource = resources.find(r => r.id === id);
      if (resource) {
        toast({
          title: resource.pinned ? "Resource unpinned" : "Resource pinned",
          description: `"${resource.title}" has been ${resource.pinned ? "removed from" : "added to"} your pinned items`,
          duration: 2000,
        });
      }
    }
  };
  
  const handleToggleCompleted = (id: string) => {
    setResources(prev => prev.map(resource => 
      resource.id === id ? { ...resource, completed: !resource.completed } : resource
    ));
    
    const resource = resources.find(r => r.id === id);
    if (resource) {
      toast({
        title: resource.completed ? "Resource marked as not completed" : "Resource marked as completed",
        description: `"${resource.title}" has been updated`,
        duration: 2000,
      });
    }
  };
  
  // Filter and sort functions
  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = filterTag === "all" || note.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      // First sort by pinned status
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by last updated date
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
      // First sort by pinned status
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Then by date added
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
            <p className="text-muted-foreground">Organize your notes and resources</p>
          </div>
          <Button onClick={handleAddNewItem} className="gap-2">
            <Plus className="h-4 w-4" />
            Add {activeTab === "notes" ? "Note" : "Resource"}
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
                <BookOpen className="h-4 w-4" />
                Resources
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
                          onClick={() => handleTogglePin(note.id, "note")}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.length === 0 ? (
                <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No resources found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || filterTag !== "all" 
                      ? "Try adjusting your search or filters" 
                      : "Create your first resource to get started"}
                  </p>
                  {!searchQuery && filterTag === "all" && (
                    <Button onClick={handleAddNewItem}>
                      <Plus className="mr-2 h-4 w-4" /> Add Your First Resource
                    </Button>
                  )}
                </div>
              ) : (
                filteredResources.map(resource => (
                  <Card key={resource.id} className="group hover:shadow-md transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="flex-1 flex items-center gap-2">
                          {getResourceIcon(resource.type)}
                          <span className={resource.completed ? "line-through opacity-70" : ""}>
                            {resource.title}
                          </span>
                        </CardTitle>
                        <div className="flex">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleToggleCompleted(resource.id)}
                          >
                            <Check className={`h-4 w-4 ${resource.completed ? "text-green-500" : "text-muted-foreground"}`} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleTogglePin(resource.id, "resource")}
                          >
                            {resource.pinned ? (
                              <Pin className="h-4 w-4 text-primary" fill="currentColor" />
                            ) : (
                              <PinOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {resource.type}
                        </Badge>
                        {resource.pinned && (
                          <Badge variant="outline" className="bg-primary/10 text-primary text-xs">
                            <Pin className="h-3 w-3 mr-1" /> Pinned
                          </Badge>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {resource.notes && (
                        <p className="text-sm line-clamp-2 mb-3">{resource.notes}</p>
                      )}
                      {resource.url && (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline flex items-center gap-1 mb-3"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open resource
                        </a>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {resource.tags.map(tag => (
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
                       resources.filter(resource => resource.tags.includes(tag)).length}
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
