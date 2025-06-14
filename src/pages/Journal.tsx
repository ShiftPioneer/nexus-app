import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, Plus, PenSquare, Calendar, BookText, Tag, Clock } from "lucide-react";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalPrompts from "@/components/journal/JournalPrompts";
import { useToast } from "@/hooks/use-toast";

const Journal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  
  // Mock journal entries
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      title: "Morning Reflection",
      content: "Today I'm feeling optimistic about the new project at work. I had a good meditation session that helped me focus my thoughts.",
      date: new Date(2023, 6, 15),
      tags: ["reflection", "work", "meditation"],
      mood: "positive"
    },
    {
      id: "2",
      title: "Weekly Review",
      content: "This week was productive. I completed most of my tasks and made progress on my habit of reading 30 minutes daily.",
      date: new Date(2023, 6, 12),
      tags: ["weekly-review", "productivity"],
      mood: "neutral"
    },
    {
      id: "3",
      title: "Challenges and Growth",
      content: "Faced some obstacles with the database migration, but learned valuable lessons about planning ahead and communicating with the team.",
      date: new Date(2023, 6, 8),
      tags: ["challenges", "learning", "work"],
      mood: "mixed"
    }
  ]);

  // Handle creating a new entry
  const handleCreateEntry = (entry: JournalEntry) => {
    if (currentEntry) {
      // Edit existing entry
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
      toast({
        title: "Journal Updated",
        description: "Your journal entry has been updated successfully.",
      });
    } else {
      // Add new entry
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        date: new Date(),
      };
      setEntries([newEntry, ...entries]);
      toast({
        title: "Journal Created",
        description: "Your new journal entry has been created successfully.",
      });
    }
    setShowNewEntry(false);
    setCurrentEntry(null);
  };

  // Filter entries based on active tab
  const filteredEntries = entries.filter(entry => {
    if (activeTab === "all") return true;
    if (activeTab === "today") return format(entry.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
    if (activeTab === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return entry.date >= oneWeekAgo;
    }
    if (activeTab === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return entry.date >= oneMonthAgo;
    }
    return true;
  });

  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setShowNewEntry(true);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Entry Deleted",
      description: "Your journal entry has been deleted.",
    });
  };

  return (
    <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookText className="h-6 w-6 text-primary" />
              Digital Journal
            </h1>
            <p className="text-muted-foreground">Capture your thoughts, reflections, and personal growth</p>
          </div>
          <Button onClick={() => setShowNewEntry(true)} className="gap-2">
            <Plus size={18} />
            New Journal
          </Button>
        </div>

        {showNewEntry ? (
          <Card>
            <CardHeader>
              <CardTitle>{currentEntry ? "Edit Journal Entry" : "Create New Journal Entry"}</CardTitle>
              <CardDescription>
                {currentEntry ? "Update your thoughts and reflections" : "Capture your thoughts, ideas, and reflections"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JournalEditor 
                initialEntry={currentEntry || {
                  id: "",
                  title: "",
                  content: "",
                  date: new Date(),
                  tags: [],
                  mood: "neutral"
                }} 
                onSave={handleCreateEntry} 
                onCancel={() => {
                  setShowNewEntry(false);
                  setCurrentEntry(null);
                }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-4">
                        <TabsTrigger value="all">All Entries</TabsTrigger>
                        <TabsTrigger value="today">Today</TabsTrigger>
                        <TabsTrigger value="week">This Week</TabsTrigger>
                        <TabsTrigger value="month">This Month</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search journal entries..." className="pl-8" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry) => (
                        <Card key={entry.id} className="cursor-pointer hover:bg-accent/20 transition-colors">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <CardTitle className="text-lg">{entry.title}</CardTitle>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditEntry(entry)}>
                                  <PenSquare className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteEntry(entry.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  ×
                                </Button>
                              </div>
                            </div>
                            <div className="flex gap-2 items-center text-sm text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{format(entry.date, "PPP")}</span>
                              <Clock className="h-3 w-3 ml-2" />
                              <span>{format(entry.date, "p")}</span>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm line-clamp-3">{entry.content}</p>
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="flex gap-2 flex-wrap">
                              {entry.mood && (
                                <Badge variant={
                                  entry.mood === "positive" ? "default" : 
                                  entry.mood === "negative" ? "destructive" : 
                                  "outline"
                                } className="mr-1">
                                  {entry.mood}
                                </Badge>
                              )}
                              {entry.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookText className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                        <h3 className="mt-4 text-lg font-medium">No journal entries found</h3>
                        <p className="mt-2 text-muted-foreground">
                          {activeTab === "all" 
                            ? "Start writing your first entry to begin your journaling journey." 
                            : "Try changing your filter or create a new entry."
                          }
                        </p>
                        <Button onClick={() => setShowNewEntry(true)} className="mt-4 gap-2">
                          <Plus size={16} />
                          New Journal
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right sidebar with prompts and stats */}
            <div className="space-y-6">
              <JournalPrompts />
              
              {/* Journal Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Journal Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">{entries.length}</p>
                      <p className="text-xs text-muted-foreground">Total Entries</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">
                        {entries.filter(entry => 
                          format(entry.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                        ).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">
                        {Array.from(new Set(entries.flatMap(entry => entry.tags))).length}
                      </p>
                      <p className="text-xs text-muted-foreground">Unique Tags</p>
                    </div>
                    <div className="border rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold">
                        {entries.reduce((streak, entry, index) => {
                          if (index === 0) return 1;
                          const prevDate = new Date(entries[index-1].date);
                          prevDate.setDate(prevDate.getDate() - 1);
                          return format(prevDate, "yyyy-MM-dd") === format(entry.date, "yyyy-MM-dd") 
                            ? streak + 1 : streak;
                        }, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Streak</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </ModernAppLayout>
  );
};

export default Journal;
