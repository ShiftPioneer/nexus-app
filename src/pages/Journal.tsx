import React, { useState } from "react";
import ModernAppLayout from "@/components/layout/ModernAppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import JournalEditor from "@/components/journal/JournalEditor";
import JournalPrompts from "@/components/journal/JournalPrompts";
import JournalHeader from "@/components/journal/JournalHeader";
import JournalEntriesList from "@/components/journal/JournalEntriesList";
import JournalStats from "@/components/journal/JournalStats";
import { useToast } from "@/hooks/use-toast";
const Journal = () => {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

  // Mock journal entries
  const [entries, setEntries] = useState<JournalEntry[]>([{
    id: "1",
    title: "Morning Reflection",
    content: "Today I'm feeling optimistic about the new project at work. I had a good meditation session that helped me focus my thoughts.",
    date: new Date(2023, 6, 15),
    tags: ["reflection", "work", "meditation"],
    mood: "positive"
  }, {
    id: "2",
    title: "Weekly Review",
    content: "This week was productive. I completed most of my tasks and made progress on my habit of reading 30 minutes daily.",
    date: new Date(2023, 6, 12),
    tags: ["weekly-review", "productivity"],
    mood: "neutral"
  }, {
    id: "3",
    title: "Challenges and Growth",
    content: "Faced some obstacles with the database migration, but learned valuable lessons about planning ahead and communicating with the team.",
    date: new Date(2023, 6, 8),
    tags: ["challenges", "learning", "work"],
    mood: "mixed"
  }]);

  // Handle creating a new entry
  const handleCreateEntry = (entry: JournalEntry) => {
    if (currentEntry) {
      // Edit existing entry
      setEntries(entries.map(e => e.id === entry.id ? entry : e));
      toast({
        title: "Journal Updated",
        description: "Your journal entry has been updated successfully."
      });
    } else {
      // Add new entry
      const newEntry = {
        ...entry,
        id: Date.now().toString(),
        date: new Date()
      };
      setEntries([newEntry, ...entries]);
      toast({
        title: "Journal Created",
        description: "Your new journal entry has been created successfully."
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
      description: "Your journal entry has been deleted."
    });
  };
  const handleNewEntry = () => {
    setShowNewEntry(true);
    setCurrentEntry(null);
  };
  return <ModernAppLayout>
      <div className="animate-fade-in space-y-6">
        <JournalHeader onNewEntry={handleNewEntry} />

        {showNewEntry ? <Card className="bg-slate-950">
            <CardHeader className="rounded-lg bg-slate-950">
              <CardTitle>{currentEntry ? "Edit Journal Entry" : "Create New Journal Entry"}</CardTitle>
              <CardDescription>
                {currentEntry ? "Update your thoughts and reflections" : "Capture your thoughts, ideas, and reflections"}
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-slate-950">
              <JournalEditor initialEntry={currentEntry || {
            id: "",
            title: "",
            content: "",
            date: new Date(),
            tags: [],
            mood: "neutral"
          }} onSave={handleCreateEntry} onCancel={() => {
            setShowNewEntry(false);
            setCurrentEntry(null);
          }} />
            </CardContent>
          </Card> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <JournalEntriesList entries={filteredEntries} activeTab={activeTab} onTabChange={setActiveTab} onEditEntry={handleEditEntry} onDeleteEntry={handleDeleteEntry} onNewEntry={handleNewEntry} />
            </div>
            
            <div className="space-y-6">
              <JournalPrompts />
              <JournalStats entries={entries} />
            </div>
          </div>}
      </div>
    </ModernAppLayout>;
};
export default Journal;